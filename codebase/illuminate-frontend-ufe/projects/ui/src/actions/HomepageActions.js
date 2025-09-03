/* eslint-disable complexity */
import { breakpoints } from 'style/config';
import ContentConstants from 'constants/content';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { getContent } from 'services/api/Content/getContent';
import imageUtils from 'utils/Image';
import p13nApi from 'services/api/p13n';
import { homeSelector } from 'selectors/page/home/homeSelector';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { SET_HOME_PAGE } from 'constants/actionTypes/home';
import cookieUtils from 'utils/Cookies';
import Empty from 'constants/empty';
import p13nUtils from 'utils/localStorage/P13n';
import { pageSelector } from 'selectors/page/pageSelector';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import CookieUtils from 'utils/Cookies';
import Storage from 'utils/localStorage/Storage';
import Location from 'utils/Location';
import { SET_INITIALIZATION, SET_P13N_DATA_FOR_PREVIEW, SET_P13N_DATA } from 'constants/actionTypes/personalization';

const { COMPONENT_TYPES } = ContentConstants;
const { getImageSrcForPreload } = imageUtils;
const { setPersonalizationCache, getContextIdsToUpdate } = p13nUtils;

const isNewPage = ({ newLocation, previousLocation }) => {
    return previousLocation.prevPath !== newLocation.newPath;
};

function getImagesToPreload({ items = Empty.Array }) {
    const firstItem = items[0] || Empty.Object;
    let imagesToPreload = Empty.Array;
    const isLargeScreen = window.matchMedia(breakpoints.smMin).matches;
    const viewportWidth = window.innerWidth;
    const imageWidth = isLargeScreen ? firstItem.largeWidth || firstItem.width : firstItem.width;
    const amountOfImagesToShow = Math.ceil(viewportWidth / imageWidth);

    if (firstItem.type === COMPONENT_TYPES.BANNER_LIST) {
        imagesToPreload = firstItem.items
            .map(({ media = Empty.Object, largeMedia = Empty.Object }) => {
                if (!media.src) {
                    return null;
                }

                const mediaSrc = firstItem.largeWidth && isLargeScreen ? largeMedia.src || media.src : media.src;
                const imgWidth = firstItem.largeWidth && isLargeScreen ? firstItem.largeWidth : firstItem.width;

                return getImageSrcForPreload(mediaSrc, imgWidth);
            })
            .slice(0, amountOfImagesToShow);
    }

    return imagesToPreload;
}

function setHomepageData(payload) {
    return {
        type: SET_HOME_PAGE,
        payload
    };
}

const openPage = ({ events: { onDataLoaded, onPageUpdated, onError } }) => {
    return dispatch => {
        const { country, language } = Sephora.renderQueryParams;

        return getContent({
            country,
            language,
            path: '/home'
        })
            .then(response => {
                let data;

                if (!response.data) {
                    // eslint-disable-next-line no-console
                    console.error('No data returned from getContent');
                    data = { items: Empty.Array };
                } else {
                    data = response.data;
                }

                const imagesToPreload = getImagesToPreload(data);
                onDataLoaded(data, imagesToPreload);
                dispatch(setHomepageData(data));
                onPageUpdated(data);
            })
            .catch(onError);
    };
};

const updatePage = () => {};

const setP13NInitialization = payload => {
    return {
        type: SET_INITIALIZATION,
        payload
    };
};

const setP13NDataForPreview = payload => {
    return {
        type: SET_P13N_DATA_FOR_PREVIEW,
        payload
    };
};

const setP13NData = payload => {
    return {
        type: SET_P13N_DATA,
        payload
    };
};

const setPersonalizationAnalyticsData = p13nData => {
    const analyticsData = [];

    Array.isArray(p13nData) &&
        p13nData?.forEach(item => {
            const {
                context, variation, ruleId, ruleSetId, isControl, isAbTest, isDefault
            } = item.p13n || Empty.Object;

            const getBooleanValue = value => {
                if (value === true) {
                    return value;
                } else if (value === false) {
                    return false;
                }

                return 'n/a';
            };

            const c = 'c=' + (context || 'n/a');
            const v = 'v=' + (variation || 'n/a');
            const rid = 'rid=' + (ruleId || 'n/a');
            const rsid = 'rsid=' + (ruleSetId || 'n/a');
            const isc = 'isc=' + getBooleanValue(isControl);
            const isab = 'isab=' + getBooleanValue(isAbTest);
            const isd = 'isd=' + getBooleanValue(isDefault);

            const data = [c, v, rid, rsid, isc, isab, isd];
            analyticsData.push(data.join(';'));
        });
    digitalData.page.attributes.p13nAnalyticsData = analyticsData.join(',');
};

const getPersonalizedEnabledComponents =
    (itemsList = []) =>
        async (dispatch, getState) => {
            dispatch(setP13NInitialization(false));
            const reduxState = getState();
            const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

            const {
                isAnonymous, isInitialized, userId: atgId, biId, defaultSAZipCode
            } = coreUserDataSelector(reduxState);
            const p13n = p13nSelector(reduxState);
            const page = pageSelector(reduxState);
            const persistentBannerItems = page.headerFooterTemplate?.data?.persistentBanner || Empty.Array;
            const megaNavData = page.headerFooterTemplate?.data?.megaNav || Empty.Object;
            const beautyOffersPageItems = page?.content?.layout?.content || Empty.Array;
            const rwdBasketTopContentItems = page?.rwdBasket?.cmsData?.topContent || Empty.Array;
            const { items = Empty.Array } = homeSelector(reduxState);
            const totalItems = items.concat(persistentBannerItems, beautyOffersPageItems, rwdBasketTopContentItems, itemsList);
            const customerData = Storage.session.getItem(LOCAL_STORAGE.CUSTOMER_OBJECT);

            if (Object.keys(megaNavData).length) {
                totalItems.push(megaNavData);
            }

            if (Sephora.configurationSettings?.isBirthdayLandingPageP13NEnabled) {
                if (Location.isBirthdayGiftPage()) {
                    const topBanner = page?.content?.layout?.heroBanner;
                    topBanner.personalization = {
                        ...topBanner?.personalization,
                        isBirthdayGift: true
                    };
                    totalItems.push(topBanner);
                }
            }

            const isPrvEnv = prvCookie && !p13n.isInitialized;
            const otherEnvs = !isAnonymous && !p13n.isInitialized && isInitialized;

            if (isPrvEnv || otherEnvs) {
                const {
                    p13nContextIds = Empty.Array,
                    nbcContextIds = Empty.Array,
                    bdContextIds = Empty.Array,
                    mabContextIds = Empty.Array
                } = getContextIdsToUpdate(totalItems);

                const contextEntryIds = [...p13nContextIds, ...nbcContextIds, ...bdContextIds, ...mabContextIds];

                if (!contextEntryIds.length) {
                    return dispatch(setP13NInitialization(true));
                }

                if (!prvCookie && !atgId) {
                    return Promise.resolve();
                }

                const { country, channel, language } = Sephora.renderQueryParams;
                let personalizationData = [];

                if (customerData && !customerData.atg_id) {
                // eslint-disable-next-line camelcase
                    customerData.atg_id = atgId;
                    Storage.session.setItem(LOCAL_STORAGE.CUSTOMER_OBJECT, customerData);
                }

                if (nbcContextIds?.length) {
                    try {
                        const nbcData = await p13nApi.getP13nNbcData({
                            channel,
                            country,
                            language,
                            atgId,
                            contextEntryIds: nbcContextIds,
                            zipCode: defaultSAZipCode
                        });

                        if (nbcData?.length) {
                            personalizationData = personalizationData.concat(nbcData);
                        }
                    } catch (error) {
                        Sephora.logger.error('Error getting NBC data:', error);
                    }
                }

                if (mabContextIds?.length) {
                    try {
                        const mabData = await p13nApi.getP13nMABData({
                            channel,
                            country,
                            language,
                            atgId,
                            contextEntryIds: mabContextIds,
                            zipCode: defaultSAZipCode
                        });

                        if (mabData?.length) {
                            personalizationData = personalizationData.concat(mabData);
                        }
                    } catch (error) {
                        Sephora.logger.error('Error getting MAB data:', error);
                    }
                }

                if (bdContextIds?.length && Sephora.configurationSettings?.isBirthdayLandingPageP13NEnabled) {
                    try {
                        const birthdayData = await p13nApi.getP13nBirthdayData({
                            channel,
                            country,
                            language,
                            atgId,
                            contextEntryIds: bdContextIds,
                            zipCode: defaultSAZipCode
                        });

                        if (birthdayData?.length) {
                            personalizationData = personalizationData.concat(birthdayData);
                        }
                    } catch (error) {
                        Sephora.logger.error('Error getting Birthday data:', error);
                    }
                }

                if (cookieUtils.read(cookieUtils.KEYS.P13N_PRV) && customerData) {
                    if (!CookieUtils.read(CookieUtils.KEYS.PREVIEW_CUSTOMER)) {
                        const cookieData = {
                            ...customerData,
                            context: contextEntryIds,
                            zipCode: defaultSAZipCode
                        };
                        CookieUtils.write(CookieUtils.KEYS.PREVIEW_CUSTOMER, btoa(JSON.stringify(cookieData)), null, true, false);
                    }

                    const previewData = await p13nApi.getPreviewP13nData();

                    if (previewData?.length) {
                        personalizationData = personalizationData.concat(previewData);
                    }
                } else {
                    if (p13nContextIds?.length) {
                        try {
                            const p13nData = await p13nApi.getP13nData({
                                channel,
                                country,
                                language,
                                atgId,
                                biId,
                                contextEntryIds: p13nContextIds,
                                zipCode: defaultSAZipCode
                            });

                            if (p13nData?.length) {
                                personalizationData = personalizationData.concat(p13nData);
                            }
                        } catch (error) {
                        //eslint-disable-next-line no-console
                            console.error('Error getting P13N data:', error);
                            dispatch(setP13NInitialization(true));
                        }
                    }
                }

                if (!personalizationData.length) {
                    return Promise.resolve();
                }

                if (prvCookie) {
                    dispatch(setP13NDataForPreview(personalizationData));
                } else {
                    setPersonalizationCache(personalizationData);
                    dispatch(setP13NInitialization(true));
                    dispatch(setPersonalizationAnalyticsData(personalizationData));
                }

                return Promise.resolve();
            } else {
            // Set as true to prevent infinite loaders in components
            // which depends purely on this value to show it
                dispatch(setP13NInitialization(true));

                return Promise.resolve();
            }
        };

export default {
    getPersonalizedEnabledComponents,
    isNewPage,
    openPage,
    setP13NInitialization,
    updatePage,
    setP13NDataForPreview,
    setP13NData,
    setPersonalizationAnalyticsData
};
