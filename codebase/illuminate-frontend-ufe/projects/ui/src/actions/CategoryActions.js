/* eslint-disable complexity */
import nthCategory from 'reducers/page/nthCategory';
import { SET_NTH_CATEGORY, SET_NTH_CATEGORY_FULFILLMENT_OPTIONS } from 'constants/actionTypes/nthCategory';
import { SET_NTH_BRAND, SET_NTH_BRAND_FULFILLMENT_OPTIONS } from 'constants/actionTypes/nthBrand';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import decoratorUtils from 'utils/decorators';
import cachingConcern from 'services/api/cache';
import catalogUtils from 'utils/Catalog';
import ufeApi from 'services/api/ufeApi';
import snbApi from 'services/api/search-n-browse';
import sdnApi from 'services/api/sdn';
import PageTemplateType from 'constants/PageTemplateType';
import { breakpoints } from 'style/config';
import productUtils from 'utils/product';
import { PRODUCT_TILE as IMAGE_SIZE } from 'style/imageSizes';
import SpaUtils from 'utils/Spa';
import Location from 'utils/Location';
import languageLocaleUtils from 'utils/LanguageLocale';
import { PICKUP, SAME_DAY } from 'constants/UpperFunnel';
import * as catalogConstantsUtils from 'utils/CatalogConstants';
import pixleeUtils from 'utils/pixlee';
import rmnUtils from 'utils/rmn';
import { PAGE_TYPES } from 'constants/sponsoredProducts';
import { FULFILLMENT_TYPES } from 'actions/ActionsConstants';
import urlUtils from 'utils/Url';
import helpersUtils from 'utils/Helpers';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import { STORE_ID_REFINEMENTS, ZIP_CODE_REFINEMENTS } from 'constants/UpperFunnel';

const { deferTaskExecution } = helpersUtils;
const { getAdServiceParams } = rmnUtils;
const { buildProductImageSrc } = productUtils;
const { loadPixlee } = pixleeUtils;
const { getCurrentLanguage, getCurrentCountry } = languageLocaleUtils;
const { withInterstice } = decoratorUtils;
const { ACTION_TYPES: TYPES } = nthCategory;

let currentApiRequestControl;
const { CHECKBOXES_WITH_DROPDOWN } = catalogConstantsUtils.REFINEMENT_TYPES;
const allowedParamKeys = ['currentPage', 'pageSize', 'ph', 'pl', 'ref', 'sortBy', 'ptype'];
const MAX_IMAGES_TO_PRELOAD = 8;

const getImagesToPreload = ({ products = [] } = {}) => {
    const imagesToPreload = [];
    const generateSrcs = true;
    let size;

    if (window.matchMedia(breakpoints.smMin).matches) {
        size = IMAGE_SIZE[1];
    } else {
        size = IMAGE_SIZE;
    }

    products.slice(0, MAX_IMAGES_TO_PRELOAD).forEach(({ currentSku: { skuId: id }, heroImage: image }) => {
        const skuImages = { image };
        const [, , x1PixelDensityUrl, x2PixelDensityUrl] = buildProductImageSrc({
            id,
            skuImages,
            size,
            generateSrcs
        });
        imagesToPreload.push({
            x1PixelDensityUrl,
            x2PixelDensityUrl
        });
    });

    return imagesToPreload;
};

function setNthCatalogData(data, template, requestOptions, displayOptions) {
    const type = template === PageTemplateType.NthCategory ? SET_NTH_CATEGORY : SET_NTH_BRAND;

    return {
        type: type,
        payload: {
            data,
            requestOptions,
            displayOptions
        }
    };
}

function pullCatalogData(location, templateInformation, page, user) {
    const currentCatalogData = page[templateInformation?.pageName];
    const categoriesForSearching = currentCatalogData.categories && currentCatalogData.categories.slice();

    if (catalogUtils.catalogInstanceOptions[templateInformation.template].shouldAugmentCategories) {
        const prevSelectedCategory = catalogUtils.getPrevSelectedCategory(Object.assign({}, currentCatalogData.categories));

        if (prevSelectedCategory) {
            categoriesForSearching.push(prevSelectedCategory);
        }
    }

    const getOptionsFromLocationParams = {
        isSaleResultsPage: false,
        template: templateInformation.template,
        pageSize: currentCatalogData.pageSize,
        isCollapseNth: catalogUtils.catalogInstanceOptions[templateInformation.template].isCollapseNth,
        responseSource: currentCatalogData.responseSource
    };
    const options = catalogUtils.getOptionsFromLocation(location, categoriesForSearching, getOptionsFromLocationParams);

    // Aborting the pending request as soon as possible.
    if (currentApiRequestControl && currentApiRequestControl.abort) {
        currentApiRequestControl.abort();
    }

    const requestControl = {};
    currentApiRequestControl = requestControl;

    const createRequestOptionsParams = {
        catalogId: currentCatalogData.categoryId,
        brandId: currentCatalogData.brandId,
        template: templateInformation.template,
        responseSource: currentCatalogData.responseSource
    };
    let requestOptions = catalogUtils.createRequestOptions(options.displayOptions, createRequestOptionsParams, location);
    requestOptions = catalogUtils.addNLPRequestOptions(requestOptions);
    requestOptions = catalogUtils.addUpperFunnelParams(requestOptions, user);
    requestOptions.catalogSeoName = catalogUtils.getCatalogName(location.path, templateInformation.routes?.[0]);

    const apiCall = catalogUtils.catalogInstanceOptions[templateInformation.template].catalogApiCall;
    const abortablePromise = ufeApi.abortable(snbApi[apiCall], requestControl);
    const interstice = withInterstice(abortablePromise, 0);

    cachingConcern
        .decorate(
            apiCall,
            interstice
        )(requestOptions)
        .then(data => {
            data.contextId = catalogUtils.createContextId();

            // When Loading more products -> Add them instead of replacing them
            if (
                parseInt(options.displayOptions.currentPage) === parseInt(currentCatalogData.currentPage || 1) + 1 &&
                // If products received is bigger than the pageSize
                // we dont need to add because it's from cache (using back button)
                data.products.length <= data.pageSize
            ) {
                data.products = currentCatalogData.products.concat(data.products);
            }

            Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = data.responseSource;
            const action = setNthCatalogData(data, templateInformation.template, requestOptions, options.displayOptions);
            store.dispatch(action);
            SpaUtils.updateHeaderTags(data, templateInformation.template);
            currentApiRequestControl = null;
        })
        .catch(reason => {
            if (reason.errorCode === ufeApi.ResponseErrorCode.REQUEST_ABORTED) {
                // eslint-disable-next-line no-console
                console.debug('api request got aborted!');
            } else {
                // eslint-disable-next-line no-console
                console.log(reason);
            }

            currentApiRequestControl = null;
            // eslint-disable-next-line no-console
            console.log('Something went wrong', reason);
        });
}

// eslint-disable-next-line object-curly-newline
const isNewPage = ({ newLocation: { path: newPath }, previousLocation: { path: prevPath } }) => {
    const differentPage = prevPath !== newPath;

    return differentPage;
};

// eslint-disable-next-line object-curly-newline
const openPage = ({ newLocation, events: { onDataLoaded, onPageUpdated, onError } }) => {
    const { path: newPath, queryParams } = newLocation;
    const templateInformation = SpaUtils.getSpaTemplateInfoByUrl(newPath) || {};

    return (dispatch, getState) => {
        try {
            const catalogSeoName = catalogUtils.getCatalogName(newPath, templateInformation.routes?.[0]);
            let allowedParams = Object.keys(queryParams)
                .filter(key => allowedParamKeys.find(allowedKey => key.toLowerCase() === allowedKey.toLowerCase()))
                .reduce((acc, x) => {
                    acc[x] = queryParams[x];

                    return acc;
                }, {});

            allowedParams = catalogUtils.addNLPRequestOptions(allowedParams);
            const { user } = getState();
            allowedParams = catalogUtils.addUpperFunnelParams(allowedParams, user);
            const adServiceParams = getAdServiceParams(PAGE_TYPES.BROWSE);
            const hasFilters = queryParams?.ref?.length > 0 || queryParams?.pl?.length > 0 || queryParams?.ph?.length > 0;
            const options = {
                catalogSeoName: catalogSeoName,
                content: true,
                includeRegionsMap: true,
                targetSearchEngine: 'nlp',
                countryCode: localeUtils.isCanada() ? localeUtils.COUNTRIES.CA : localeUtils.COUNTRIES.US,
                ...allowedParams,
                ...(!hasFilters && { ...adServiceParams })
            };

            const catalogPromise =
                templateInformation.template === PageTemplateType.NthCategory ? snbApi.getCategory(options) : snbApi.getBrand(options);

            return catalogPromise
                .then(data => {
                    if (Sephora.Util.InflatorComps.services.CatalogService) {
                        Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = data.responseSource;
                    }

                    const imagesToPreload = getImagesToPreload(data);
                    onDataLoaded(data, imagesToPreload);

                    data.contextId = catalogUtils.createContextId();
                    const action = setNthCatalogData(data, templateInformation.template, null);
                    dispatch(action);
                    loadPixlee();

                    onPageUpdated(data);
                })
                .catch(onError);
        } catch (error) {
            onError(error);

            return Promise.reject(error);
        }
    };
};

const updatePage =
    ({ newLocation }) =>
        (_dispatch, getState) => {
            const { page, user } = getState();
            const templateInformation = SpaUtils.getSpaTemplateInfoByUrl(newLocation.path) || {};
            pullCatalogData(newLocation, templateInformation, page, user);
        };

const getFulfillmentOptions =
    (shouldUpdateUpperFunnel = false, source = 'default', requestOrigin = 'Browse') =>
        (dispatch, getState) => {
            const { shipToHomeFilterEligibleInBrowse } = Sephora.configurationSettings;
            const isUS = localeUtils.isUS();
            const { pageName, template } = SpaUtils.getSpaTemplateInfoByUrl(Location.getLocation().pathname) || {};
            const { user, page } = getState();
            const { enablePickupSearchFilterInBrowse, enableSameDaySearchFilterInBrowse } = user;
            const pageData = page[pageName];
            const upfunnelRampUp = enablePickupSearchFilterInBrowse || enableSameDaySearchFilterInBrowse;
            const hasUpperFunnelRefinement = shouldUpdateUpperFunnel ? false : catalogUtils.hasUpperFunnelRefinement(pageData.refinements);
            const pageHasProducts = pageData?.products?.length > 0;
            const hasDeliveryOps = pageData.deliveryOptions;
            const shouldGetFulfillmentOptions = upfunnelRampUp && pageHasProducts && (!hasUpperFunnelRefinement || !hasDeliveryOps) && !Sephora.isSEO;

            if (!shouldGetFulfillmentOptions) {
                return Promise.resolve();
            }

            let type;

            if (template === PageTemplateType.NthCategory) {
                type = SET_NTH_CATEGORY_FULFILLMENT_OPTIONS;
            } else if (template === PageTemplateType.BrandNthCategory) {
                type = SET_NTH_BRAND_FULFILLMENT_OPTIONS;
            }

            const country = getCurrentCountry();
            const locale = `${country}_${getCurrentLanguage()}`;
            const payload = {
                source: shipToHomeFilterEligibleInBrowse ? 'ufe' : source,
                requestOrigin,
                country,
                locale,
                fulfillmentOptions: [],
                ...(shipToHomeFilterEligibleInBrowse && {
                    enterpriseCode: isUS ? 'SEPHORAUS' : 'SEPHORACA',
                    sellerCode: isUS ? 'SEPHORADOTCOM' : 'SEPHORADOTCA'
                })
            };

            const storeIdFromUrl = catalogUtils.refinementValueFromUrl(PICKUP);
            const storeId = storeIdFromUrl || user?.preferredStore || user?.preferredStoreInfo?.storeId;

            if (enablePickupSearchFilterInBrowse && storeId) {
                payload.fulfillmentOptions.push({
                    fulfillmentType: FULFILLMENT_TYPES.PICKUP,
                    locations: [storeId]
                });
            }

            const zipCodeFromUrl = catalogUtils.refinementValueFromUrl(SAME_DAY);
            const zipCode = zipCodeFromUrl || user?.preferredZipCode;
            const encryptedStoreIds = user?.encryptedStoreIds;

            if (enableSameDaySearchFilterInBrowse && zipCode && encryptedStoreIds) {
                payload.zipCode = zipCode;
                payload.fulfillmentOptions.push({
                    fulfillmentType: FULFILLMENT_TYPES.SAMEDAY,
                    preferredZipCode: zipCode,
                    locations: [encryptedStoreIds]
                });
            }

            if (payload.fulfillmentOptions.length > 0) {
                const products = catalogUtils.getPageProductsIds(pageData);
                payload.products = products;
            }

            if (shipToHomeFilterEligibleInBrowse && zipCode && pageData?.products?.length > 0) {
                payload.fulfillmentOptions.push({
                    fulfillmentType: FULFILLMENT_TYPES.SHIP,
                    items: [pageData.products[0]?.currentSku?.skuId], // only the skuId of the first product available is being passed on Cat pages
                    address: {
                        zipCode,
                        country
                    }
                });
            }

            const filterUpfunnelValues = fulfillmentOptions => {
                const newFulfillmentOptions = { ...fulfillmentOptions };

                const checkboxesWithDropDownIdx = (newFulfillmentOptions?.refinements || []).findIndex(ref => ref.type === CHECKBOXES_WITH_DROPDOWN);

                if (checkboxesWithDropDownIdx >= 0) {
                    if (!enablePickupSearchFilterInBrowse) {
                        newFulfillmentOptions.refinements[checkboxesWithDropDownIdx].values = newFulfillmentOptions.refinements[
                            checkboxesWithDropDownIdx
                        ].values.filter(value => !(value.refinementStringValueId || value.refinementValue || '').startsWith(PICKUP));
                    }

                    if (!enableSameDaySearchFilterInBrowse) {
                        newFulfillmentOptions.refinements[checkboxesWithDropDownIdx].values = newFulfillmentOptions.refinements[
                            checkboxesWithDropDownIdx
                        ].values.filter(value => !(value.refinementStringValueId || value.refinementValue || '').startsWith(SAME_DAY));
                    }
                }

                return newFulfillmentOptions;
            };

            const includeDetails = Boolean(storeIdFromUrl || zipCodeFromUrl);

            return sdnApi.getFulfillmentOptions(payload, includeDetails).then(fulfillmentOptions => {
                const fulfillmentOptionsWithFilteredValues = filterUpfunnelValues(fulfillmentOptions);
                const newPageData = catalogUtils.mergeFulfillOptions(pageData, fulfillmentOptionsWithFilteredValues);
                const action = {
                    type,
                    payload: {
                        ...newPageData,
                        hasClientSideData: true // triggers new render client side
                    }
                };

                return dispatch(action);
            });
        };

const validateUpperFunnelParams = callback => (dispatch, getState) => {
    const hasUpperFunnelParams = catalogUtils.hasUpperFunnelParams();

    if (hasUpperFunnelParams) {
        const { user } = getState();
        const storeId = user?.preferredStore || user?.preferredStoreInfo?.storeId;
        const zipCode = user?.preferredZipCode;

        const urlParams = urlUtils.getParams();
        const refinements = urlParams.ref;
        const nextRefinements = [];

        // Remove upper funnel refinements when Store ID or Zip Code
        // doesn't match with current User configuration.
        for (const refinement of refinements) {
            const [key, value] = refinement.split('=');
            const isStoreIdRef = STORE_ID_REFINEMENTS.includes(key);
            const isZipCodeRef = ZIP_CODE_REFINEMENTS.includes(key);

            const shouldKeepRefinement =
                (!isStoreIdRef && !isZipCodeRef) || (isStoreIdRef && storeId === value) || (isZipCodeRef && zipCode === value);

            if (shouldKeepRefinement) {
                nextRefinements.push(refinement);
            }
        }

        const queryParams = {
            ...urlParams,
            ref: nextRefinements
        };

        if (refinements.length === nextRefinements.length) {
            const ts = Math.round(new Date().getTime() / 1000);
            queryParams.ts = ts;
        }

        // Zero delayed setTimeout to schedule a new macrotask.
        // This dispatch needs to be executed at the end of the macrotask queue.
        deferTaskExecution(() => {
            dispatch(historyLocationActions.goTo({ queryParams }));
        });
    } else {
        dispatch(callback);
    }
};

export default {
    isNewPage,
    openPage,
    setNthCatalogData,
    TYPES,
    updatePage,
    validateUpperFunnelParams,
    getFulfillmentOptions
};
