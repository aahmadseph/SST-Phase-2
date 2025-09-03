import apiUtil from 'utils/Api';
import store from 'Store';
import Filters from 'utils/Filters';
import Location from 'utils/Location.js';
import localeUtils from 'utils/LanguageLocale';
import biUtils from 'utils/BiProfile';
import BazaarVoiceClient from 'services/api/thirdparty/BazarVoiceClient';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

let settings = Sephora.configurationSettings.bvApi_rich_profile;

// Use this searchRatingClient for implementing search R&R feature.
// It can be extracted to separate file, responsible for that feature.
let searchRatingReadConfig = Sephora.configurationSettings.bvApi_rich_profile;

const SOCIAL_LOCKUP_DELIMITER = '|';
/*eslint camelcase: ["error", {properties: "never"}]*/

/**
 * Return ContextData values for bi attributes.
 *
 * null or undefined values are not included
 *
 * @param user
 * @param info
 * @param extraData
 * @returns {{ContextDataValue_age: string}}
 */
function getContextDataValuesFilter(user, info, extraData) {
    const contextDataValues = {};
    const biTypes = biUtils.TYPES;
    info.ageRange && (contextDataValues['ContextDataValue_' + biTypes.AGE_RANGE] = info.ageRange.join?.(','));

    info.skinTone && (contextDataValues['ContextDataValue_' + biTypes.SKIN_TONE] = info.skinTone.join?.(','));

    info.skinType && (contextDataValues['ContextDataValue_' + biTypes.SKIN_TYPE] = info.skinType.join?.(','));

    info.eyeColor && (contextDataValues['ContextDataValue_' + biTypes.EYE_COLOR] = info.eyeColor.join?.(','));

    info.hairColor && (contextDataValues['ContextDataValue_' + biTypes.HAIR_COLOR] = info.hairColor.join?.(','));

    info.skinConcerns && (contextDataValues['ContextDataValue_' + biTypes.SKIN_CONCERNS] = info.skinConcerns.join?.(','));

    info.hairType && (contextDataValues['ContextDataValue_' + biTypes.HAIR_TYPE] = info.hairType.join?.(','));

    info.hairConcerns && (contextDataValues['ContextDataValue_' + biTypes.HAIR_CONCERNS] = info.hairConcerns.join?.(','));

    if (extraData) {
        extraData.isFreeSample && (contextDataValues['ContextDataValue_IncentivizedReview'] = 'True');
        extraData.isSephoraEmployee && (contextDataValues['ContextDataValue_StaffContext'] = 'true');
    }

    return contextDataValues;
}

function convertFilterName(bvFilterName) {
    for (const key in Filters.REVIEW_FILTERS) {
        if (hasOwnProperty.call(Filters.REVIEW_FILTERS, key)) {
            if (Filters.REVIEW_FILTERS[key].bvName === bvFilterName) {
                return key;
            }
        }
    }

    return null;
}

/**
 *
 * @returns NVPs containing arrays of values for each key.  Values are all converted to lower case
 */
const getContextDataValues = function (extraData) {
    const user = store.getState().user;
    const userBeautyPreferences = user.userBeautyPreference || {};

    if (user.customerPreference && extraData.world?.key) {
        const key = extraData.world?.key;
        userBeautyPreferences.ageRange = user.customerPreference[key]?.['ageRange'];
        userBeautyPreferences.skinTone = user.customerPreference[key]?.['skinTone'];
        userBeautyPreferences.skinType = user.customerPreference[key]?.['skinType'];
        userBeautyPreferences.eyeColor = user.customerPreference[key]?.['eyeColor'];
        userBeautyPreferences.hairColor = user.customerPreference[key]?.['hairColor'];
        userBeautyPreferences.skinConcerns = user.customerPreference[key]?.['skinConcerns'];
        userBeautyPreferences.hairType = user.customerPreference[key]?.['hairType'];
        userBeautyPreferences.hairConcerns = user.customerPreference[key]?.['hairConcerns'];
    }

    const contextDataValues = getContextDataValuesFilter(user, userBeautyPreferences, extraData);

    const keys = Object.keys(contextDataValues);

    // Convert all values to lowercase
    keys.forEach(key => {
        // TODO: remove not to pickup first (DESC order) value when BazaarVoice supports
        // TODO: multi-values to be submitted
        const bvValue = contextDataValues[key].split(',');
        bvValue.sort((a, b) => {
            const A = a.toLowerCase();
            const B = b.toLowerCase();

            if (A < B) {
                return -1;
            } else if (A > B) {
                return 1;
            } else {
                return 0;
            }
        });
        contextDataValues[key] = bvValue[0];
    });

    return contextDataValues;
};

/* checks if it's a product id based on the existence of a 'p'
 *  @params: string
 *  @return: boolean
 */
function isSkuId(id) {
    return id[0].toLowerCase() !== 'p';
}

/**
 * pulls out and converts data that we need specifically for use in our codebase
 * handles both populated data and user DNE data response
 * @params object api response
 * @returns object
 **/
function reviewsDataAdapter(data) {
    const copy = {};
    copy.totalResults = data.TotalResults;

    copy.results = data.Results.map(review => {
        const additionalFields = {
            socialLockUp: review.AdditionalFields.sociallockup
                ? {
                    value: review.AdditionalFields.sociallockup.Value ? review.AdditionalFields.sociallockup.Value : null
                }
                : null
        };
        const biTraits = {};
        const biTraitsOrder = [];
        review.ContextDataValuesOrder.forEach(key => {
            const convertedKey = convertFilterName(key);

            if (convertedKey) {
                biTraitsOrder.push(convertedKey);
                biTraits[convertedKey] = review.ContextDataValues[key];
            } else {
                biTraitsOrder.push(key);
                biTraits[key] = review.ContextDataValues[key];
            }
        });

        // Note of caution: review.ProductId can be either a skuId or a productId,
        // which is why there are subsequent adapters in most of the api calls
        return {
            reviewId: review.Id,
            productId: review.ProductId,
            rating: review.Rating,
            title: review.Title,
            reviewText: review.ReviewText,
            userNickname: review.UserNickname,
            location: review.UserLocation,
            submissionTime: new Date(review.SubmissionTime),
            totalNegativeFeedbackCount: review.TotalNegativeFeedbackCount,
            totalPositiveFeedbackCount: review.TotalPositiveFeedbackCount,
            isRecommended: review.IsRecommended,
            biTraits: biTraits,
            biTraitsOrder: biTraitsOrder,
            badges: review.Badges,
            photos: review.Photos,
            videos: review.Videos,
            badgesOrder: review.BadgesOrder,
            additionalFields: additionalFields
        };
    });

    if (data.Includes) {
        copy.includes = data.Includes;
    }

    return copy;
}

function userReviewsDataAdapter(data) {
    const copy = { totalResults: data.totalResults };
    /*
     * Logic to figure out what should the be the skuId and the productId on a review.
     * Because BazaarVoice can send us back either the skuId for a swatch based color
     * product or an actual productId
     */
    copy.results = data.results.map(review => {
        const adaptedReview = Object.assign({}, review);

        if (isSkuId(review.productId)) {
            // we use the extraneous information provided in products to figure out
            // the product 'family' the sku belongs to and assign the productId
            adaptedReview.productId = data.includes.Products[review.productId].Attributes.BV_FE_FAMILY.Values[0].Value;
            adaptedReview.skuId = review.productId;
        } else {
            adaptedReview.productId = review.productId;
        }

        return adaptedReview;
    });

    return copy;
}

function productNStatsDataAdapter(data) {
    const copy = { totalResults: data.totalResults };

    copy.results = data.results.map(review => {
        const adaptedReview = Object.assign({}, review);
        adaptedReview.productId = review.productId;

        if (isSkuId(review.productId)) {
            adaptedReview.skuId = review.productId;
        }

        return adaptedReview;
    });

    // can grab any of the subsidary products/skus from ProductsOrder because
    // ReviewStatistics object will be the same no matter what, so just happen
    // to be grabbing the first product
    if (data.includes.Products) {
        const id = data.includes.ProductsOrder[0];
        const ReviewStatistics = data.includes.Products[id].ReviewStatistics;
        copy.reviewStatistics = {
            ratingDistribution: ReviewStatistics.RatingDistribution,
            totalReviewCount: ReviewStatistics.TotalReviewCount,
            averageOverallRating: ReviewStatistics.AverageOverallRating,
            recommendedCount: ReviewStatistics.RecommendedCount,
            helpfulVoteCount: ReviewStatistics.HelpfulVoteCount,
            userContext: ReviewStatistics.ContextDataDistribution,
            notHelpfulVoteCount: ReviewStatistics.NotHelpfulVoteCount
        };
    }

    return copy;
}

function mediaDataAdapter(data) {
    const copy = {};

    if (data.Errors && data.Errors.length > 0) {
        copy.errors = data.Errors;

        return copy;
    }

    const photos = data.Photo ? data.Photo.Sizes : null;

    if (photos) {
        copy.thumbnailUrl = photos.thumbnail && photos.thumbnail.Url;
    }

    return copy;
}

function bazaarVoiceApiRequest(options) {
    if (Location.isAddReviewPage()) {
        settings = Sephora.configurationSettings.bvApi_review_page;
    } else if (Location.isProductPage()) {
        settings = Sephora.isMobile()
            ? Sephora.configurationSettings.bvApi_rwdRating_mWeb_read
            : Sephora.configurationSettings.bvApi_rwdRating_desktop_read;
    }

    const HOST = settings.host;
    const PASSKEY = settings.token;
    const VERSION = settings.version;
    const IS_BAZAAR_ENABLED = Sephora.configurationSettings.isBazaarVoiceEnabled;

    const getText = localeUtils.getLocaleResourceFile('services/api/thirdparty/locales', 'messages');

    if (!IS_BAZAAR_ENABLED) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ error: getText('bazaarVoiceApiRequestFailureReason') });
    }

    const qsParams = Object.assign({}, options.qsParams, {
        passkey: PASSKEY,
        apiversion: VERSION,
        Locale: localeUtils.getCurrentLanguageCountryCode()
    });

    const opts = Object.assign({}, options, {
        url: 'https://' + HOST + options.url,
        qsParams
    });

    return new Promise((resolve, reject) => {
        apiUtil
            .request(opts)
            .then(response => response.json())
            .then(data => {
                if (data.HasErrors) {
                    // structure of api errors
                    // "Errors": [
                    //     {
                    //       "Message": "The filter 'authorid:' must specify " +
                    //                  "a non-empty value.",
                    //       "Code": "ERROR_PARAM_INVALID_FILTER_ATTRIBUTE"
                    //     }
                    // ]
                    const extraErrors = [];

                    if (data.FormErrors && data.FormErrors.FieldErrors) {
                        (data.FormErrors.FieldErrorsOrder || []).forEach(field => {
                            const error = data.FormErrors.FieldErrors[field];
                            const contextDataValues = getContextDataValues();
                            Object.keys(contextDataValues).forEach(contextKey => {
                                if (contextKey.toLowerCase() === field.toLowerCase()) {
                                    error.Message += getText('fieldValue') + contextDataValues[contextKey];
                                }
                            });
                            extraErrors.push(error);
                        });
                    }

                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject({ errors: [].concat(data.Errors).concat(extraErrors) });
                } else {
                    resolve(data);
                }
            })
            .catch(error => {
                reject(Object.assign({}, error, { apiFailed: true }));
            });
    });
}

function getBazaarVoiceFilter(filterKey, filterValues, bvFilters) {
    if (filterKey === Filters.REVIEW_FILTERS_TYPES.SKU || !filterValues || !filterValues.length) {
        return null;
    }

    let value = '';
    const isSort = filterKey === Filters.REVIEW_FILTERS_TYPES.SORT;
    const isRating = filterKey === 'rating';
    const prefix = !isSort && !isRating ? 'contextdatavalue_' : '';
    const filterName = !isSort ? (Filters.REVIEW_FILTERS[filterKey].bvName || '') + ':' : '';

    if (filterKey === 'reviewContent') {
        if (filterValues.indexOf('Photos') >= 0) {
            bvFilters.push('HasPhotos:eq:true');
        }

        if (filterValues.indexOf('Video') >= 0) {
            bvFilters.push('HasVideos:eq:true');
        }

        // Prevents processing of the filter key below since its values have already been
        // added to filters here
        value = null;
    } else if (isSort) {
        value = filterValues.join(',');
    } else {
        value = Filters.getBVValues(filterKey, filterValues, null);
    }

    return value ? prefix + filterName + value : null;
}

function getUserReviews(profileId, limit) {
    return bazaarVoiceApiRequest({
        method: 'GET',
        url: '/data/reviews.json',
        qsParams: {
            limit: limit,
            Filter: `authorid:${profileId}`,
            Include: 'Products'
        }
    })
        .then(data => reviewsDataAdapter(data))
        .then(data => userReviewsDataAdapter(data))
        .catch(() => {
            return {
                totalResults: 0,
                results: []
            };
        });
}

/**
 * For more information look at:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/reviews/review-display
 * #requesting-all-reviews-for-a-particular-product-with-review-statistics-(inc.-average-rating)
 */
function getReviewsAndStats(productId, limit, filtersAndSorts = {}, offset) {
    const filters = [];
    const sorts = [];

    // Add all filter values to an aray of filters and all sort values to an array of sorts
    Object.keys(filtersAndSorts).forEach(filterKey => {
        const filterValues = filtersAndSorts[filterKey];
        const isSort = filterKey === Filters.REVIEW_FILTERS_TYPES.SORT;
        const bazaarVoiceFilter = getBazaarVoiceFilter(filterKey, filterValues, filters);

        if (bazaarVoiceFilter) {
            isSort ? sorts.push(bazaarVoiceFilter) : filters.push(bazaarVoiceFilter);
        }
    });

    // Add language filtering BY DEFAULT
    if (localeUtils.isUS()) {
        filters.push('contentlocale:en*');
    }

    const qsParams = {
        Filter: filters,
        Sort: sorts,
        Limit: limit,
        Offset: offset,
        Include: 'Products,Comments',
        Stats: 'Reviews'
    };

    const skuFilterValues = filtersAndSorts[Filters.REVIEW_FILTERS_TYPES.SKU];

    if (skuFilterValues && skuFilterValues.length) {
        filters.push('ProductId:' + skuFilterValues.join(','));
        qsParams.ExcludeFamily = 'True';
    } else {
        filters.push(`ProductId:${productId}`);
    }

    return bazaarVoiceApiRequest({
        method: 'GET',
        url: '/data/reviews.json',
        qsParams: qsParams
    })
        .then(data => reviewsDataAdapter(data))
        .then(data => productNStatsDataAdapter(data, productId));
}

function mapToBazaarVoiceFilters(config, filterKey, filterValues, refinements) {
    if (filterKey === 'sku' || filterKey === 'beautyMatches' || !filterValues || !filterValues.length || !config) {
        return [];
    }

    const filterConfig = config.find(x => x.id === filterKey);
    const refinementsFilterConfig = refinements.find(item => item.key === filterKey);
    let bvNameToValues;
    const { isReviewsFiltersMasterListEnabled } = Sephora.configurationSettings;

    if (refinementsFilterConfig && isReviewsFiltersMasterListEnabled?.isEnabled) {
        //we need to map value names from master list to BV (for BP filters that are from user selected BP, and are not in PXS)
        bvNameToValues = filterValues
            .map(
                value =>
                    refinementsFilterConfig.items.find(item => item.value === value) || filterConfig.options.find(option => option.value === value)
            )
            .reduce((acc, option) => {
                const bvName = refinementsFilterConfig.key || option?.bvName || filterConfig?.bvName;
                acc[bvName] = acc[bvName] || [];
                acc[bvName].push(option.key || option?.bvValue);

                return acc;
            }, {});
    } else {
        bvNameToValues = filterValues
            .map(value => filterConfig.options.find(option => option.value === value))
            .reduce((acc, option) => {
                const bvName = option?.bvName || filterConfig?.bvName || '';
                acc[bvName] = acc[bvName] || [];
                acc[bvName].push(option?.bvValue || '');

                return acc;
            }, {});
    }

    const prefix = filterKey !== 'sort' && filterKey !== 'rating' && filterKey !== 'reviewContent' ? 'contextdatavalue_' : '';

    return Object.keys(bvNameToValues).map(bvName => `${prefix}${bvName}:${bvNameToValues[bvName].join(',')}`);
}

/**
 * For more information look at:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/reviews/review-display
 * #requesting-all-reviews-for-a-particular-product-with-review-statistics-(inc.-average-rating)
 */
function getReviewsAndStatsWithConfig(config, productId, limit, filtersAndSorts = {}, offset, refinementsByCategory) {
    const filters = [];
    const sorts = [];

    Object.keys(filtersAndSorts).forEach(filterKey => {
        const filterValues = filtersAndSorts[filterKey];
        const bvFilters = mapToBazaarVoiceFilters(config, filterKey, filterValues, refinementsByCategory);
        bvFilters.forEach(bvFilter => (filterKey === 'sort' ? sorts.push(bvFilter) : filters.push(bvFilter)));
    });

    // Add language filtering BY DEFAULT
    if (localeUtils.isUS()) {
        filters.push('contentlocale:en*');
    }

    const qsParams = {
        Filter: filters,
        Sort: sorts,
        Limit: limit,
        Offset: offset,
        Include: 'Products,Comments',
        Stats: 'Reviews'
    };

    const skuFilterValues = filtersAndSorts['sku'];

    if (skuFilterValues && skuFilterValues.length) {
        filters.push('ProductId:' + skuFilterValues.join(','));
        qsParams.ExcludeFamily = 'True';
    } else {
        filters.push(`ProductId:${productId}`);
    }

    return bazaarVoiceApiRequest({
        method: 'GET',
        url: '/data/reviews.json',
        qsParams: qsParams
    })
        .then(data => reviewsDataAdapter(data))
        .then(data => productNStatsDataAdapter(data, productId));
}

/**
 * For more information look at:
 * https://developer.bazaarvoice.com/conversations-api/getting-started/display-fundamentals#full-text-search
 */
function getSearchReviews(productId, limit, keyword, offset) {
    if (Location.isProductPage()) {
        searchRatingReadConfig = Sephora.isMobile()
            ? Sephora.configurationSettings.bvApi_rwdRating_mWeb_read
            : Sephora.configurationSettings.bvApi_rwdRating_desktop_read;
    }

    const searchRatingClient = new BazaarVoiceClient({
        readConfig: searchRatingReadConfig,
        isEnabled: Sephora.configurationSettings.isBazaarVoiceEnabled
    });
    const qsParams = {
        Filter: `ProductId:${productId}`,
        Search: `"${keyword}"`,
        Limit: limit,
        Offset: offset,
        Include: 'Products,Comments',
        Stats: 'Reviews'
    };

    return searchRatingClient
        .request({
            method: 'GET',
            url: '/data/reviews.json',
            qsParams: qsParams
        })
        .then(data => reviewsDataAdapter(data))
        .then(data => productNStatsDataAdapter(data, productId));
}

function getReviewsWithImage(productId) {
    const qsParams = {
        Filter: [`ProductId:${productId}`, 'HasPhotos:true'],
        Sort: 'LastModeratedTime:Desc',
        limit: 100
    };

    return bazaarVoiceApiRequest({
        method: 'GET',
        url: '/data/reviews.json',
        qsParams: qsParams
    })
        .then(data => reviewsDataAdapter(data))
        .then(data => productNStatsDataAdapter(data, productId));
}

// FIX IT
function getHelpfulReviews(productId) {
    return Promise.all([
        getReviewsAndStats(productId, 1, { [Filters.REVIEW_FILTERS_TYPES.SORT]: ['Rating:desc', 'TotalPositiveFeedbackCount:desc'] }),
        getReviewsAndStats(productId, 1, { [Filters.REVIEW_FILTERS_TYPES.SORT]: ['Rating:asc', 'TotalPositiveFeedbackCount:desc'] })
    ]).then(([positive, negative]) => {
        const helpfulReviews = [];
        let mostHelpfulPositive;

        if (positive && positive.results && positive.results.length) {
            mostHelpfulPositive = positive.results[0];

            if (!mostHelpfulPositive.totalPositiveFeedbackCount) {
                // do not return Top helpful reviews if real feedback count is 0
                return [];
            }

            helpfulReviews.push(mostHelpfulPositive);
        }

        if (negative && negative.results && negative.results.length && mostHelpfulPositive) {
            const mostHelpfulNegative = negative.results[0];

            if (!mostHelpfulNegative.totalPositiveFeedbackCount || mostHelpfulPositive.reviewId === mostHelpfulNegative.reviewId) {
                return [];
            }

            helpfulReviews.push(mostHelpfulNegative);
        }

        return helpfulReviews;
    });
}

function totalFeedbackCountReview(productId) {
    return getReviewsAndStats(productId, 1, { [Filters.REVIEW_FILTERS_TYPES.SORT]: ['TotalFeedbackCount:desc'] });
}

const getSocialProfileParameter = function () {
    const user = store.getState().user;

    let param = null;

    const socialInfo = store.getState().socialInfo;

    if (user.nickName && socialInfo && socialInfo.socialProfile) {
        const socialProfile = socialInfo.socialProfile;

        // TODO: to be safe, any ampersands in these values should be escaped
        param =
            'avatar=' +
            socialProfile.avatar +
            SOCIAL_LOCKUP_DELIMITER +
            'biBadgeUrl=' +
            socialProfile.biBadgeUrl +
            SOCIAL_LOCKUP_DELIMITER +
            'engagementBadgeUrl=' +
            socialProfile.engagementBadgeUrl +
            SOCIAL_LOCKUP_DELIMITER +
            'biTier=' +
            user.beautyInsiderAccount.vibSegment;
    }

    // TODO 2016: What do we do if there is no nickname (lithium is down)

    return param;
};

/**
 * Submit review API expects params to come in the body concatonated with &.
 * @param params
 * @returns String of &-concatonated params
 */
function generateSubmitReviewBody(params) {
    let body = '';

    const keys = Object.keys(params);

    keys.forEach((key, index) => {
        body += key + '=' + params[key];

        if (index !== keys.length - 1) {
            body += '&';
        }
    });

    return body;
}

function submitReview(config) {
    const {
        productId,
        title,
        rating,
        isRecommended,
        reviewText,
        photos,
        isFreeSample,
        isSephoraEmployee,
        verifiedPurchaser,
        bazaarvoiceUasToken,
        fp,
        world
    } = config;

    const user = store.getState().user;

    const socialProfileParam = getSocialProfileParameter();

    // TODO: HostedAuthentication params
    // TODO 2018: video
    // TODO 2018: photo
    let params = Object.assign(
        {},
        {
            Action: 'Submit',
            ProductId: productId,
            Title: encodeURIComponent(title),
            Rating: rating,
            IsRecommended: isRecommended,
            ReviewText: encodeURIComponent(reviewText),
            // TODO: AgreedToTermsAndConditions: true,
            UserNickname: user.nickName,
            AdditionalField_sociallockup: socialProfileParam,
            contextdatavalue_VerifiedPurchaser: verifiedPurchaser ? 'True' : 'False', //not boolean, this is what BV wants.
            User: bazaarvoiceUasToken, //not sending userID as per request fom BV
            fp: encodeURIComponent(fp)
        },
        photos
    );

    const contextDataValues = getContextDataValues({
        isFreeSample,
        isSephoraEmployee,
        world
    });

    params = Object.assign(params, contextDataValues);

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/submitreview.json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: generateSubmitReviewBody(params)
    });
}

function uploadPhoto(imageContent) {
    const getText = localeUtils.getLocaleResourceFile('services/api/thirdparty/locales', 'messages');

    // https://developer.bazaarvoice.com/conversations-api/tutorials/submission/photo-upload
    // BMP  PNG  GIF JPG
    const IMAGE_REG_EX = /image\/*\w+/g;
    const MAX_FILE_SIZE = 5242880;

    // Return false if file is not an image
    if (!imageContent || !imageContent.type.match(IMAGE_REG_EX) || imageContent.size > MAX_FILE_SIZE) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ errors: [{ Message: getText('uploadPhotoRejectMessage') }] });
    }

    const formData = new FormData();
    formData.append('photo', imageContent);

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/uploadphoto.json',
        qsParams: { contenttype: 'Review' },
        params: formData,
        isMultiPart: true
    }).then(data => mediaDataAdapter(data));
}

/**
 * Submit feedback on whether a given ereview was helpful or unhelpful
 *
 * For more information:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/feedback/feedback-submission
 *
 * @param helpfulnessVote Valid votes are: Positive, Negative
 * @param reviewId
 */
function voteHelpfulness(helpfulnessVote, reviewId) {
    const params = {
        FeedbackType: 'helpfulness',
        Vote: helpfulnessVote,
        ContentId: reviewId,
        ContentType: 'review'
    };

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/submitfeedback.json',
        qsParams: params
    });
}

/**
 * Submit feedback on whether a given Content was Positive or Negative
 *
 * For more information:
 * https://developer.bazaarvoice.com/conversations-api/reference/v5.4/feedback/feedback-submission
 *
 * @param contentType Valid contentTypes are: review | question | answer | review_comment
 * @param contentId Identification of the content
 * @param isPositive Use true for Positive Vote, otherwise it sends Negative Vote
 */
function submitFeedback(contentType, contentId, isPositive) {
    const params = {
        FeedbackType: 'helpfulness',
        ContentType: contentType,
        ContentId: contentId,
        Vote: isPositive ? 'Positive' : 'Negative'
    };

    return bazaarVoiceApiRequest({
        method: 'POST',
        url: '/data/submitfeedback.json',
        qsParams: params
    });
}

/**
 * Get the name/key where product's review data is stored on Local Storage.
 * A thin normalization layer to access the proper key.
 *
 * @param { string } productId Product ID
 * @return { string } Local Storage key name
 */
function getStorageKeyForProductReview(productId) {
    return `${LOCAL_STORAGE.BAZAAR_STATS_REVIEW_DATA}_${productId}`;
}

export default {
    getUserReviews,
    getReviewsAndStats,
    getReviewsAndStatsWithConfig,
    getSearchReviews,
    getReviewsWithImage,
    getHelpfulReviews,
    submitReview,
    voteHelpfulness,
    submitFeedback,
    uploadPhoto,
    totalFeedbackCountReview,
    getStorageKeyForProductReview
};
