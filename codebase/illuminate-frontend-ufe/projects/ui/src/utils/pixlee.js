/*global Pixlee*/
import loadScriptUtils from 'utils/LoadScripts';
import ufeApi from 'services/api/ufeApi';
import userUtils from 'utils/User';
import communityUtils from 'utils/Community';
import authentication from 'utils/Authentication';
import languageLocaleUtils from 'utils/LanguageLocale';
import { isUfeEnvProduction } from 'utils/Env';

const { loadScripts } = loadScriptUtils;
const { getCurrentLanguage, getCurrentCountry } = languageLocaleUtils;
const EVENT_NAMES = {
    completed: 'pixlee:upload:complete',
    close: 'pixlee:close:uploader',
    closeString: '[iFrameSizer]pixlee_uploader:0:0:close'
};

const EVENT_TYPES = {
    action: 'action'
};

const UPLOADER_WIDGET_ID = isUfeEnvProduction ? 16572675 : 16366429;

const pixleeGetPhotosQueryParamsMapping = {
    apiKey: 'api_key',
    page: 'page',
    photosPerPage: 'per_page',
    sort: 'sort',
    filters: 'filters',
    regionId: 'region_id',
    sku: 'sku',
    productName: 'product_name',
    productUrl: 'product_url',
    productImageUrl: 'product_image_url',
    recency: 'recency'
};
/* eslint-disable camelcase */
const regionIds = {
    prod: {
        us_en: '2784',
        ca_en: '2785',
        ca_fr: '2815'
    },
    qa: {
        us_en: '2786',
        ca_en: '2787',
        ca_fr: '2816'
    }
};
/*eslint-enable camelcase */

function dispatchPixleeEvent() {
    window.dispatchEvent(
        new CustomEvent('PixleeLoaded', {
            detail: {}
        })
    );
}

function loadPixlee() {
    // Don't load Pixlee if it's already in there
    if (window.Pixlee) {
        dispatchPixleeEvent();
    } else {
        loadScripts(['https://assets.pxlecdn.com/assets/pixlee_widget_1_0_0.js'], () => {
            Pixlee.init({
                apiKey: Sephora.configurationSettings.pixleeApiKey
            });
            dispatchPixleeEvent();
        });
    }
}

function getLikes(mediaIds) {
    const url = `https://distillery.pixlee.co/api/v2/media/vote/counts?album_photo_ids=${mediaIds.join(',')}&api_key=${
        Sephora.configurationSettings.pixleeApiKey
    }`;

    return ufeApi
        .makeRequest(url, { method: 'GET' })
        .then(data => {
            return data;
        })
        .catch(err => Promise.reject(err));
}

function getUserLikes(mediaIds) {
    return userUtils
        .validateUserStatus()
        .then(({ user }) => {
            if (user.login) {
                const url = `https://distillery.pixlee.co/api/v2/media/vote/counts?album_photo_ids=${mediaIds.join(',')}&api_key=${
                    Sephora.configurationSettings.pixleeApiKey
                }&distinct_user_hash=${user.login}`;

                return ufeApi
                    .makeRequest(url, { method: 'GET' })
                    .then(data => {
                        return data;
                    })
                    .catch(err => Promise.reject(err));
            } else {
                return '';
            }
        })
        .catch(err => Promise.reject(err));
}

function getLikesForPhotos(mediaIds) {
    const results = Promise.all([getLikes(mediaIds), getUserLikes(mediaIds)]);

    return results;
}

function getRegionId() {
    const country = getCurrentCountry();
    const language = getCurrentLanguage();
    const environment = Sephora?.UFE_ENV?.toLowerCase() === 'prod' ? 'prod' : 'qa';

    return regionIds[environment][`${country}_${language}`.toLowerCase()];
}

function addDefaultFilters(filters = {}) {
    return {
        ...filters,
        // eslint-disable-next-line camelcase
        has_permission: true
    };
}

function getApprovedContentForPhoto(photoId, retrieveLikes = true) {
    const { apiKey } = pixleeGetPhotosQueryParamsMapping;

    const pixleeGetPhotoUrl = new URL(`https://distillery.pixlee.co/api/v2/media/${photoId}`);
    pixleeGetPhotoUrl.searchParams.append(apiKey, Sephora.configurationSettings.pixleeApiKey);

    return ufeApi
        .makeRequest(pixleeGetPhotoUrl.href, { method: 'GET' })
        .then(res => {
            if (!retrieveLikes) {
                return res;
            }

            return getLikesForPhotos([photoId])
                .then(([allLoves, lovesByUser]) => {
                    res.data.loves = {};
                    allLoves.data?.forEach(asset => {
                        if (res.data.album_photo_id === asset.album_photo_id) {
                            res.data.loves = { count: asset.vote_count };
                        }
                    });
                    lovesByUser.data?.forEach(lovedAsset => {
                        if (res.data.album_photo_id === lovedAsset.album_photo_id) {
                            res.data.loves = { ...res.data.loves, isLovedByCurrentUser: true };
                        }
                    });

                    return res;
                })
                .catch(() => {
                    return res;
                });
        })
        .catch(err => Promise.reject(err));
}

function getApprovedContentFromAlbum(albumId, options) {
    const {
        filters, sort, sku, regionId, apiKey
    } = pixleeGetPhotosQueryParamsMapping;

    //https://developers.pixlee.com/reference/get-approved-content-from-album
    const pixleeGetPhotosUrl = new URL(`https://distillery.pixlee.co/api/v2/albums/${albumId}/photos`);
    pixleeGetPhotosUrl.searchParams.append(apiKey, Sephora.configurationSettings.pixleeApiKey);
    pixleeGetPhotosUrl.searchParams.append(regionId, getRegionId());

    if (options.sku) {
        pixleeGetPhotosUrl.searchParams.append(sku, options.sku);
    }

    options.filters = addDefaultFilters(options.filters);

    Object.keys(options).forEach(key => {
        const queryParam = pixleeGetPhotosQueryParamsMapping[key];

        if (queryParam !== sku) {
            if (queryParam === filters || queryParam === sort) {
                pixleeGetPhotosUrl.searchParams.append(queryParam, JSON.stringify(options[key]));
            } else {
                pixleeGetPhotosUrl.searchParams.append(queryParam, options[key]);
            }
        }
    });

    return ufeApi
        .makeRequest(pixleeGetPhotosUrl.href, {
            method: 'GET'
        })
        .then(res => {
            const assetIds = [];
            res.data.forEach(item => assetIds.push(item.album_photo_id));

            if (assetIds.length === 0) {
                return '';
            }

            return getLikesForPhotos(assetIds)
                .then(([allLoves, lovesByUser]) => {
                    res.data.forEach(item => {
                        item.loves = {};
                        allLoves.data?.forEach(asset => {
                            if (item.album_photo_id === asset.album_photo_id) {
                                item.loves = { count: asset.vote_count };
                            }
                        });
                        lovesByUser.data?.forEach(lovedAsset => {
                            if (item.album_photo_id === lovedAsset.album_photo_id) {
                                item.loves = { ...item.loves, isLovedByCurrentUser: true };
                            }
                        });
                    });

                    return res;
                })
                .catch(() => {
                    return res;
                });
        })
        .catch(err => Promise.reject(err));
}

function getApprovedContentCount(albumId, options = {}) {
    const {
        filters, sort, sku, regionId, apiKey, recency
    } = pixleeGetPhotosQueryParamsMapping;

    // https://developers.pixlee.com/reference/get-content-count
    const pixleeGetContentCountUrl = new URL(`https://distillery.pixlee.co/api/v2/albums/${albumId}/photos/count`);
    pixleeGetContentCountUrl.searchParams.append(apiKey, Sephora.configurationSettings.pixleeApiKey);
    pixleeGetContentCountUrl.searchParams.append(regionId, getRegionId());
    pixleeGetContentCountUrl.searchParams.append(recency, true);

    options.filters = addDefaultFilters(options.filters);

    Object.keys(options).forEach(key => {
        const queryParam = pixleeGetPhotosQueryParamsMapping[key];

        if (queryParam !== sku) {
            if (queryParam === filters || queryParam === sort) {
                pixleeGetContentCountUrl.searchParams.append(queryParam, JSON.stringify(options[key]));
            } else {
                pixleeGetContentCountUrl.searchParams.append(queryParam, options[key]);
            }
        }
    });

    return ufeApi
        .makeRequest(pixleeGetContentCountUrl.href, {
            method: 'GET'
        })
        .then(res => {
            return res;
        })
        .catch(err => Promise.reject(err));
}

function getSearchResults(albumId, term = '', options) {
    const results = Promise.all([
        /* eslint-disable camelcase */
        getApprovedContentFromAlbum(albumId, { filters: { filter_by_userhandle: { contains: [term] } }, ...options }),
        getApprovedContentFromAlbum(albumId, { filters: { filter_by_caption: { contains: [term] } }, ...options }),
        getApprovedContentFromAlbum(albumId, { filters: { filter_by_hashtag: { equals: term } }, ...options })
        /*eslint-enable camelcase */
    ]);

    return results;
}

function checkUserBeforeActions() {
    return authentication
        .requireLoggedInAuthentication()
        .then(() => {
            let promise = Promise.resolve();

            if (!userUtils.isSocial()) {
                promise = authentication.requireLoggedInAuthentication().then(() => communityUtils.showSocialRegistrationModal());
            }

            return promise;
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.debug('user sign in required');

            return Promise.reject(error);
        });
}

export default {
    EVENT_NAMES,
    EVENT_TYPES,
    UPLOADER_WIDGET_ID,
    loadPixlee,
    getApprovedContentFromAlbum,
    getApprovedContentCount,
    getSearchResults,
    getLikes,
    checkUserBeforeActions,
    getApprovedContentForPhoto
};
