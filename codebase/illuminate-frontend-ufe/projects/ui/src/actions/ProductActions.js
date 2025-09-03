/* eslint-disable complexity */

/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
import productReducer from 'reducers/product';
import bccUtils from 'utils/BCC';
import constantsAnalytics from 'analytics/constants';
import AnalyticsUtils from 'analytics/utils';
import getProductDetails from 'services/api/search-n-browse/getProductDetails';
import localeUtils from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import ProfileApi from 'services/api/profile';
import skuUtils from 'utils/Sku';
import SnbApi from 'services/api/search-n-browse';
import utilityApi from 'services/api/utility';
import store from 'store/Store';
import { breakpoints } from 'style/config';
import { THUMBNAIL_PRODUCT_MEDIA_ITEM } from 'style/imageSizes';
import anaConsts from 'analytics/constants';
import { PostLoad } from 'constants/events';
import productUtils from 'utils/product';
import anaUtils from 'analytics/utils';
import PageActionCreators from 'actions/framework/PageActionCreators';
import userUtils from 'utils/User';
import RmnUtils from 'utils/rmn';
import sdnApi from 'services/api/sdn';
import languageLocaleUtils from 'utils/LanguageLocale';
import { FULFILLMENT_TYPES } from 'actions/ActionsConstants';
import { mountProductEventData } from 'analytics/utils/eventName';
import UrlUtils from 'utils/Url';

const onLastLoadEvent = Sephora.Util.onLastLoadEvent;
const { ACTION_TYPES: TYPES } = productReducer;
const {
    IMAGE_SIZES: { ZOOM }
} = bccUtils;
const {
    MEDIA_TYPE: { IMAGE }
} = constantsAnalytics;
import { Pages } from 'constants/Pages';
import skuHelpers from 'utils/skuHelpers';
const {
    productViewableImpressionTrackingInformation,
    productClickTrackingInformation,
    buildProductHeroImageSrc,
    buildProductImageSrc,
    getMediaItems
} = productUtils;
const { getCurrentLanguage, getCurrentCountry } = languageLocaleUtils;

const SKU_UPDATE_SOURCE = {
    SWATCHES: 'SWATCHES',
    QUERY_STRING: 'QUERY_STRING'
};
const PRODUCT_NOT_CARRIED_URL = '/search?keyword=productnotcarried';

const { PRODUCTS_GRID } = anaConsts.COMPONENT_TITLE;
const { EVENTS_TYPES_NAME } = anaConsts;

const getImagesToPreload = product => {
    const mediaItems = getMediaItems(product);
    const imagesToPreload = [];
    const size = THUMBNAIL_PRODUCT_MEDIA_ITEM;
    const isMobile = window.matchMedia(breakpoints.smMax).matches;

    const hideBadge = true;
    const generateSrcs = true;
    mediaItems.forEach(item => {
        if (item.type === IMAGE) {
            let [x1PixelDensityUrl, x2PixelDensityUrl] = buildProductHeroImageSrc(item, isMobile);
            imagesToPreload.push({
                x1PixelDensityUrl,
                x2PixelDensityUrl
            });

            // Only preload thumbnail images on desktop
            if (!isMobile) {
                const src = skuUtils.getImgSrc(ZOOM, item.media);
                [, , x1PixelDensityUrl, x2PixelDensityUrl] = buildProductImageSrc({
                    src,
                    size,
                    hideBadge,
                    generateSrcs
                });
                imagesToPreload.push({
                    x1PixelDensityUrl,
                    x2PixelDensityUrl
                });
            }
        }
    });

    return imagesToPreload;
};

class ProductPageActionCreators extends PageActionCreators {
    get TYPES() {
        return TYPES;
    }

    get SKU_UPDATE_SOURCE() {
        return SKU_UPDATE_SOURCE;
    }

    isNewPage = ({ newLocation, previousLocation } /*: IPageNavigationContext*/) => {
        const productPageData = skuUtils.getProductPageData(newLocation);
        const previousProductPageData = skuUtils.getProductPageData(previousLocation);
        const differentProduct = productPageData.productId !== previousProductPageData?.productId;

        return differentProduct;
    };

    openPage =
        ({ newLocation, requestConfig, events } /*: IPageNavigationContext*/) =>
            dispatch => {
                const { onDataLoaded, onPageUpdated, onError } = events;

                try {
                    const productPageData = skuUtils.getProductPageData(newLocation);
                    const { productId, skuId } = productPageData;

                    const apiOptions = {
                        addCurrentSkuToProductChildSkus: true,
                        includeRegionsMap: true,
                        showContent: true,
                        includeConfigurableSku: true,
                        countryCode: localeUtils.isCanada() ? localeUtils.COUNTRIES.CA : localeUtils.COUNTRIES.US,
                        removePersonalizedData: true,
                        includeReviewFilters: true,
                        includeReviewImages: true
                    };

                    const productPromise = SnbApi.getProductDetails(productId, skuId, apiOptions, requestConfig);
                    const { user } = store.getState();
                    // TODO: SnbApi.getProductDetails ^^^ could return all data we need
                    // to skip invocation of ProfileApi.getUserSpecificProductDetails
                    const userSpecificProductDetailsPromise = ProfileApi.getUserSpecificProductDetails(productId, skuId, false, user?.profileId);

                    return productPromise
                        .then(product => {
                        // Temp error handling for when PXS returns a HTTP 200 success but error data instead of the actual response.
                            if (product.errorCode) {
                                const { errorCode } = product;

                                // -4 Country restricted sku, -15 Not available sku
                                if (errorCode === -4 || errorCode === -15) {
                                    UrlUtils.redirectTo(PRODUCT_NOT_CARRIED_URL);
                                } else {
                                    UrlUtils.redirectTo(Pages.Error404);
                                }
                            }

                            const imagesToPreload = getImagesToPreload(product);
                            onDataLoaded(product, imagesToPreload);
                            const setProductAction = ProductActions.setProduct(product);
                            dispatch(setProductAction); // Does +1 render circle on PDP

                            onPageUpdated(product, () => {
                                userSpecificProductDetailsPromise.then(userSpecificDetails => {
                                    const updateCurrentProductWithUserSpecificDetailsAction =
                                    ProductActions.updateCurrentUserSpecificProduct(userSpecificDetails);
                                    dispatch(updateCurrentProductWithUserSpecificDetailsAction); // Does +1 render circle on PDP
                                });
                            });
                        })
                        .catch(onError);
                } catch (error) {
                    onError(error);

                    return Promise.reject(error);
                }
            };

    updatePage =
        ({ newLocation, previousLocation } /*: IPageNavigationContext*/) =>
            dispatch => {
                const productPageData = skuUtils.getProductPageData(newLocation);
                const previousProductPageData = skuUtils.getProductPageData(previousLocation);
                // We are not switching product pages therefor we must be switching between skus on the same product page
                // We can assume that the sku is the default sku if it is missing from the product page data
                const skuId = (productPageData.skuId && productPageData.skuId[0]) || Sephora.productPage.defaultSkuId.toString();
                const sku = skuHelpers.getSkuFromProduct(null, skuId);
                const prevSkuId = previousProductPageData.skuId && previousProductPageData.skuId[0];

                if (skuId && skuId !== (prevSkuId || Sephora.productPage.defaultSkuId.toString())) {
                    dispatch(ProductActions.updateSkuInCurrentProduct(sku, ProductActions.SKU_UPDATE_SOURCE.SWATCHES));
                }
            };

    updateProductWithUserSpecificData = () => dispatch => {
        const {
            page: {
                product,
                product: { currentProductUserSpecificDetails = {}, currentSku = {}, productDetails = {} }
            },
            user
        } = store.getState();

        const productId = productDetails.productId || product.productId || currentProductUserSpecificDetails.productId;
        // TODO: temp fix while json product returns default sku instead of selected
        const skuId = AnalyticsUtils.getQueryParam('skuId') || currentSku.skuId;
        const promise = ProfileApi.getUserSpecificProductDetails(productId, skuId, false, user?.profileId)
            .then(productData => dispatch(ProductActions.updateCurrentUserSpecificProduct({ ...productData })))
            .catch(() => {
                /* exception handling goes here */
            });

        return promise;
    };

    setProduct = product => ({
        type: TYPES.SET_PRODUCT,
        payload: { product }
    });

    updateCurrentProduct(currentProduct) {
        return {
            type: TYPES.UPDATE_CURRENT_PRODUCT,
            currentProduct: currentProduct
        };
    }

    /** Mixes the user specific data in to the product (on all sku levels) and updates
     * the product in the store
     * @param {Object} currentProductUserSpecificDetails User product specific details
     * @returns {{type: string, payload: Object}} Action
     */
    updateCurrentUserSpecificProduct = currentProductUserSpecificDetails => ({
        type: TYPES.UPDATE_CURRENT_PRODUCT_USER_SPECIFIC,
        payload: { currentProductUserSpecificDetails }
    });

    updateReserveOnlinePickUpInStoreProductDetails(updateReserveOnlinePickUpInStoreProductDetails) {
        return {
            type: TYPES.UPDATE_RESERVE_ONLINE_PICK_UP_IN_STORE_DETAILS,
            reserveOnlinePickUpInStoreProductDetails: updateReserveOnlinePickUpInStoreProductDetails
        };
    }

    restoreProductWithNoExtraDetails() {
        return { type: TYPES.RESTORE_PRODUCT_WITH_NO_EXTRA_DETAILS };
    }

    updateSkuInCurrentProduct(currentSku) {
        return {
            type: TYPES.UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT,
            payload: { currentSku }
        };
    }

    updateSameDayDeliveryProductDetails(updateSameDayDeliveryProductDetails) {
        return {
            type: TYPES.UPDATE_SAME_DAY_DELIVERY_DETAILS,
            sameDayDeliveryProductDetails: updateSameDayDeliveryProductDetails
        };
    }

    toggleCustomSets(isOpen) {
        return {
            type: TYPES.TOGGLE_CUSTOM_SETS,
            isOpen: isOpen
        };
    }

    // forceapply tells ReviewsFilters to update, even if
    // filters have not changed
    applyReviewFilters(filters, forceApply = false) {
        return {
            type: TYPES.REVIEW_FILTERS_APPLIED,
            filters: filters,
            apply: forceApply
        };
    }

    selectReviewFilters(filters) {
        return {
            type: TYPES.REVIEW_FILTERS_SELECTED,
            filters: filters
        };
    }

    applyReviewsSearch(productId, keyword) {
        return {
            type: TYPES.REVIEW_SEARCH_APPLIED,
            productId,
            keyword
        };
    }

    loadHighlightedReviews = ({ sentiment, type, productId, language, limit, page }) => {
        return dispatch => {
            utilityApi
                .getHighlightedReviews({
                    sentiment,
                    productID: productId,
                    language,
                    limit,
                    page
                })
                .then(data => {
                    dispatch(ProductActions.updateHighlightedReviews({ data, type, sentiment }));
                    dispatch(ProductActions.setSelectedSentiment(sentiment));
                });
        };
    };

    removeHighlightedReviews() {
        return {
            type: TYPES.REMOVE_HIGHLIGHTED_REVIEWS
        };
    }

    updateHighlightedReviews(parameters) {
        const { data, type, sentiment } = parameters;
        const reviews = data;
        const proConType = type;
        const { count, productHighlight } = reviews;

        return {
            type: TYPES.UPDATE_HIGHLIGHTED_REVIEWS,
            highlightedReviews: {
                count,
                proConType: proConType,
                selectedSentiment: sentiment,
                reviews: productHighlight
            }
        };
    }

    fetchCurrentProduct(productId, skuId) {
        return dispatch => {
            return getProductDetails(productId, skuId, { addCurrentSkuToProductChildSkus: true }).then(data =>
                dispatch(this.updateCurrentProduct(data))
            );
        };
    }

    selectSortOption(code, name) {
        return {
            type: TYPES.SELECT_SORT_OPTION,
            sortOption: {
                code: code,
                name: name
            }
        };
    }

    selectFilterOption(code, name) {
        return {
            type: TYPES.SELECT_FILTER_OPTION,
            filterOption: {
                code: code,
                name: name
            }
        };
    }

    purchasesFilterOptions(filterOptions) {
        return {
            type: TYPES.PURCHASES_FILTER_OPTIONS,
            filterOptions: filterOptions
        };
    }

    setSelectedSentiment(selectedSentiment) {
        return {
            type: TYPES.SET_SELECTED_SENTIMENT,
            selectedSentiment
        };
    }

    fireProductViewableImpressionTracking({ product, source }) {
        // Async Action

        // Inside the Action Creator
        return () => {
            // Inside the Action
            if (!product || !product.sponsored) {
                return Promise.resolve();
            }

            // Waits until the page is completely loaded to fire the event for Signal/TMS.
            onLastLoadEvent(window, [PostLoad], () => {
                // Extras the viewable tracking information from the sponsored product
                const trackingInformation = productViewableImpressionTrackingInformation(product);
                let eventName;
                const sotEvent = mountProductEventData(EVENTS_TYPES_NAME.VIEW);

                switch (source) {
                    // Homepage sponsored products come inside a carousel
                    case RmnUtils.RMN_SOURCES.HOMEPAGE:
                        eventName = anaConsts.EVENT_NAMES.PLA_HOME_SPONSORED_CAROUSEL_VIEWABLE_IMPR;

                        break;
                    // Product page sponsored products also come inside a carousel
                    case RmnUtils.RMN_SOURCES.PDP:
                        eventName = sotEvent ?? anaConsts.EVENT_NAMES.PLA_SPONSORED_CAROUSEL_VIEWABLE_IMPRESSION;

                        break;
                    // Category and Search pages sponsored products
                    default:
                        eventName = sotEvent;
                }

                // Verifies the sponsored product information is available and that the product is a sponsored one.
                if (trackingInformation && trackingInformation.isSponsoredProduct) {
                    processEvent.process(
                        anaConsts.SOT_LINK_TRACKING_EVENT,
                        {
                            data: {
                                linkName: eventName,
                                actionInfo: eventName,
                                specificEventName: eventName,
                                sponsoredProductInformation: trackingInformation
                            }
                        },
                        { specificEventName: eventName }
                    );
                }
            });

            return Promise.resolve();
        };
    }

    fireSponsoredProductClickTracking = ({ product, source, _event, index }) => {
        // Inside the Action Creator
        return () => {
            digitalData.page.attributes.previousPageData.pageType = source;
            // reset internalCampaign so `getInternalCampaign` in generalBindings will set it
            // to the icid2 queryParam in the pPage URL
            digitalData.page.attributes.previousPageData.internalCampaign = '';
            const navigationInfo = digitalData.page.attributes.previousPageData.navigationInfo;
            const isLeftNav = navigationInfo.startsWith('left');

            const sotEvent = mountProductEventData(EVENTS_TYPES_NAME.CLICK);

            let eventName;

            switch (source) {
                case RmnUtils.RMN_SOURCES.HOMEPAGE:
                    eventName = anaConsts.EVENT_NAMES.PLA_HOMEPAGE_SPONSORED_PRODUCT_CLICK;

                    break;
                default:
                    eventName = sotEvent ?? anaConsts.EVENT_NAMES.PLA_SPONSORED_CAROUSEL_CLICK;

                    break;
            }

            const pageName = digitalData.page.pageInfo.pageName;

            // Trigger analytics only for sponsored products AND for specific sources defined by analytics team
            if (!product || !product.sponsored) {
                return Promise.resolve();
            }

            // Waits until the page is completely loaded to fire the event for Signal/TMS.
            onLastLoadEvent(window, [PostLoad], () => {
                const trackingInformation = productClickTrackingInformation(product);

                // Verifies the sponsored product information is available and that the product is a sponsored one,
                // or that the source is part of the ones that should trigger analytics.

                if (trackingInformation && trackingInformation.isSponsoredProduct) {
                    processEvent.process(
                        anaConsts.SOT_LINK_TRACKING_EVENT,
                        {
                            data: {
                                linkName: eventName,
                                actionInfo: eventName,
                                specificEventName: eventName,
                                sponsoredProductInformation: trackingInformation,
                                eventStrings: anaConsts.Event.EVENT_254,
                                internalCampaign: anaConsts.CAMPAIGN_STRINGS.RMN_PLA,
                                position: index,
                                pageName,
                                productId: product.productId,
                                customerId: userUtils.getProfileId(),
                                productStrings: `;${product.currentSku?.skuId};;;${anaConsts.Event.EVENT_254};eVar26=${product.currentSku?.skuId}|eVar124=N/A:[${index}]:N/A`
                            }
                        },
                        { specificEventName: eventName }
                    );
                }
            });

            // digitalData.page.attributes.previousPageData.recInfo is reset on SPA page loads
            anaUtils.setNextPageData({
                recInfo: { componentTitle: PRODUCTS_GRID },
                navigationInfo: isLeftNav ? null : navigationInfo
            });

            return Promise.resolve();
        };
    };

    getFulfillmentOptions =
        (source = 'PDP', requestOrigin = 'PDP') =>
            async (dispatch, getState) => {
                const { shipToHomeEligibleInPDP } = Sephora.configurationSettings;
                const {
                    page: {
                        product: { currentSku = {} }
                    },
                    user
                } = getState();
                const zipCode = user?.preferredZipCode;
                const shouldGetFulfillmentOptions = shipToHomeEligibleInPDP && !!zipCode;
                const isUS = localeUtils.isUS();
                const country = getCurrentCountry();
                const locale = `${country}_${getCurrentLanguage()}`;

                if (!shouldGetFulfillmentOptions) {
                    return Promise.resolve();
                }

                const payload = {
                    source,
                    requestOrigin,
                    country,
                    locale,
                    fulfillmentOptions: [
                        {
                            fulfillmentType: FULFILLMENT_TYPES.SHIP,
                            items: [currentSku?.skuId],
                            address: {
                                zipCode,
                                country
                            }
                        }
                    ],
                    enterpriseCode: isUS ? 'SEPHORAUS' : 'SEPHORACA',
                    sellerCode: isUS ? 'SEPHORADOTCOM' : 'SEPHORADOTCA'
                };

                const fulfillmentOptions = await sdnApi.getFulfillmentOptions(payload);

                const action = {
                    type: TYPES.SET_PRODUCT_PAGE_FULFILLMENT_OPTIONS,
                    payload: {
                        fulfillmentOptions
                    }
                };

                return dispatch(action);
            };

    setProductViews(payload) {
        return {
            type: TYPES.SET_PRODUCT_VIEWS,
            payload
        };
    }
}

const ProductActions = new ProductPageActionCreators();

export default ProductActions;
