import localStorageSearchUtils from 'utils/localStorage/Search';
import Storage from 'utils/localStorage/Storage';
import searchTypeAhead from 'services/api/search-n-browse/searchTypeAhead';
import searchReducer from 'reducers/search';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import { VIEW_ALL_PER_PAGE_MAX, CATALOG_API_CALL } from 'constants/Search';
import searchUtils from 'utils/Search';
import ufeApi from 'services/api/ufeApi';
import snbApi from 'services/api/search-n-browse';
import cachingConcern from 'services/api/cache';
import decoratorUtils from 'utils/decorators';
import isFunction from 'utils/functions/isFunction';
import { getProductsFromKeyword } from 'services/api/search-n-browse/searchProductsByKeyword';
import searchPageReducer from 'reducers/page/search';
import { SET_SEARCH } from 'constants/actionTypes/search';
import { breakpoints } from 'style/config';
import productUtils from 'utils/product';
import { PRODUCT_TILE } from 'style/imageSizes';
const IMAGE_SIZE = PRODUCT_TILE;
import catalogUtils from 'utils/Catalog';
import Location from 'utils/Location';
import { SALE_KEYWORDS, TRENDING_CATEGORIES_OBJECT_COUNT } from 'constants/Search.js';

const { KEYS } = localStorageSearchUtils;
const { buildProductImageSrc } = productUtils;
const { ACTION_TYPES: TYPES } = searchReducer;
const { ACTION_TYPES: SEARCH_TYPES } = searchPageReducer;
const { withInterstice } = decoratorUtils;

const URLS = {
    SEARCH_URL: '/search?keyword=',
    SEARCH_TYPEAHEAD_URL: '/api/catalog/search?type=typeahead&q='
};

const STORAGE_KEYS = { STORAGE_PREVIOUS_RESULTS: KEYS.STORAGE_PREVIOUS_RESULTS };

const MAX_SEARCH_SUGGESTIONS_COUNT = 10;

const SPACE_REPLACE_STRING = '%20';

const SALE_REDIRECT_PATH = '/sale';
const HOME_REDIRECT_PATH = '/';

const identity = keyString => keyString;
const allowedParamKeys = {
    pageSize: identity,
    currentPage: currentPageStr => parseInt(currentPageStr[0], 10) || 1,
    ph: identity,
    pl: identity,
    ref: identity,
    sortBy: identity,
    ptype: identity,
    node: identity
};

const formatRefinementString = val => (typeof val === 'string' ? val.replace(' ', SPACE_REPLACE_STRING) : val ? val.toString() : '');

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

function mapResults(results) {
    if (!results || results.length === 0) {
        return [];
    }

    const mappedResults = results.map(result => {
        if (result.trendingCategories === null) {
            return null;
        }

        if (result instanceof Object && !(result.trendingCategories && result.trendingCategories.length > 0)) {
            let searchResult = result.brandName ? result.brandName + ' - ' : '';
            searchResult += result.productName;
            result.value = typeof result.term !== 'undefined' ? result.term : searchResult;
        }

        return result;
    });

    const filteredResults = mappedResults.filter(item => item !== null);

    return filteredResults;
}

function showSearchResults(keyword, results) {
    return {
        type: TYPES.SHOW_SEARCH_RESULTS,
        keyword: keyword,
        results: mapResults(results.slice(0, MAX_SEARCH_SUGGESTIONS_COUNT + TRENDING_CATEGORIES_OBJECT_COUNT))
    };
}

function showZeroStateSearchResults() {
    const data = Storage.local.getItem(KEYS.STORAGE_PREVIOUS_RESULTS);

    return {
        type: TYPES.SHOW_ZERO_STATE_RESULTS,
        results: data ? mapResults(data.slice(0, KEYS.MAX_PREVIOUS_RESULTS_COUNT)) : []
    };
}

function addRefinement(refinementId, removeFirst) {
    return (dispatch, getState) => {
        const refinementToAdd = formatRefinementString(refinementId);

        let queryParams = Object.assign({}, getState().historyLocation.queryParams);

        const catalogService = Sephora.Util?.InflatorComps?.services?.CatalogService;

        if (catalogService && catalogService.isNLPCatalog()) {
            queryParams = Sephora.Util.getConstructorQueryStringParams(queryParams);
        }

        const currentRefinements = searchUtils.getRefinementsFromQueryParams(queryParams);

        /* This condition applies for Up funnel filters */
        if (currentRefinements.length && removeFirst) {
            const filterKeyValue = refinementId.split('=')[0];
            const refinementIndex = currentRefinements.findIndex(ref => {
                return ref.split('=')[0] === filterKeyValue;
            });

            if (refinementIndex !== -1) {
                currentRefinements.splice(refinementIndex, 1);
            }
        }

        if (currentRefinements.indexOf(refinementToAdd) === -1) {
            currentRefinements.push(refinementToAdd);
            queryParams.ref = currentRefinements;
            delete queryParams.currentPage;

            if (queryParams.keyword && queryParams.keyword[0]) {
                queryParams.keyword = [catalogUtils.encodeDecodedParam(queryParams.keyword[0])];
            }

            dispatch(historyLocationActions.goTo({ queryParams }));
        }
    };
}

function removeRefinements(refinementsIds) {
    return (dispatch, getState) => {
        const refinementsToRemove = refinementsIds.map(one => formatRefinementString(one));

        let queryParams = Object.assign({}, getState().historyLocation.queryParams);

        const catalogService = Sephora.Util?.InflatorComps?.services?.CatalogService;

        if (catalogService && catalogService.isNLPCatalog()) {
            queryParams = Sephora.Util.getConstructorQueryStringParams(queryParams);
        }

        const currentRefinements = searchUtils.getRefinementsFromQueryParams(queryParams);

        const newRefinements = currentRefinements.filter(one => decodeURIComponent(refinementsToRemove).indexOf(decodeURIComponent(one)) === -1);

        const shouldURLChange = newRefinements.length !== currentRefinements.length;

        if (shouldURLChange) {
            queryParams.ref = newRefinements;
            delete queryParams.currentPage;
            dispatch(historyLocationActions.goTo({ queryParams }));
        }
    };
}

function clearRefinements() {
    return (dispatch, getState) => {
        const queryParams = Object.assign({}, getState().historyLocation.queryParams);
        delete queryParams.ref;
        delete queryParams.pl;
        delete queryParams.ph;
        delete queryParams.currentPage;
        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setSorting(sortOptionCode) {
    return (dispatch, getState) => {
        const queryParams = Object.assign({}, getState().historyLocation.queryParams);
        queryParams.sortBy = sortOptionCode;
        delete queryParams.currentPage;
        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setPageNumber(pageNumber) {
    return (dispatch, getState) => {
        const queryParams = Object.assign({}, getState().historyLocation.queryParams);
        queryParams.currentPage = pageNumber;
        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setPrices(prices) {
    return (dispatch, getState) => {
        const queryParams = Object.assign({}, getState().historyLocation.queryParams);

        let priceLow = [];
        let priceHigh = [];

        if (prices && Array.isArray(prices) && prices.length === 2) {
            priceLow = prices[0];
            priceHigh = prices[1];
        }

        queryParams.pl = priceLow;
        queryParams.ph = priceHigh;

        delete queryParams.currentPage;

        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setPageSize(pageSize) {
    return (dispatch, getState) => {
        const queryParams = Object.assign({}, getState().historyLocation.queryParams);
        queryParams.pageSize = pageSize;

        // Per https://jira.sephora.com/browse/ILLUPH-103611, we remove page
        // number whenever page size is changed to the "View all" one, implying
        // that the user is always starting all over from the beginning of
        // the result set and if there are more than view-all max
        // (currently 300) products, they see the paginator and may use it.
        if (pageSize === String(VIEW_ALL_PER_PAGE_MAX)) {
            delete queryParams.currentPage;
        }

        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setCategory(targetUrl) {
    return (dispatch, getState) => {
        const { pageSize, sortBy } = getState().historyLocation.queryParams;

        dispatch(
            historyLocationActions.goTo({
                path: targetUrl,
                queryParams: {
                    pageSize,
                    sortBy
                }
            })
        );
    };
}

function setSearchCategory(categoryNode) {
    return (dispatch, getState) => {
        const { node, ...queryParams } = getState().historyLocation.queryParams;

        if (node && categoryNode) {
            if (node[0] !== categoryNode && parseInt(node[0]) !== parseInt(categoryNode)) {
                queryParams.node = categoryNode;
            }
        } else {
            queryParams.node = categoryNode;
        }

        delete queryParams.currentPage;
        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function refreshSearchResults() {
    return (dispatch, getState) => {
        const ts = Math.round(new Date().getTime() / 1000);
        const queryParams = {
            ...getState().historyLocation.queryParams,
            ts
        };

        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setSearchData(data, requestOptions = {}, displayOptions = {}) {
    return {
        type: SET_SEARCH,
        payload: {
            data,
            requestOptions,
            displayOptions
        }
    };
}

function fetchSearchResponse(requestOptions) {
    let resultsPromise;

    const cachedResults = Storage.session.getItem(requestOptions.q);

    if (cachedResults) {
        resultsPromise = Promise.resolve(cachedResults);
        Storage.session.removeItem(requestOptions.q);
    } else {
        resultsPromise = getProductsFromKeyword({ config: { returnCorrelationId: true }, ...requestOptions });
    }

    return resultsPromise;
}

/* eslint-disable object-curly-newline */
const isNewPage = ({ newLocation, previousLocation }) => {
    const { path: newPath, queryParams } = newLocation;
    const { path: prevPath, queryParams: prevQueryParams } = previousLocation;

    const { keyword: newKeyword, node: newNode } = queryParams;
    const { keyword: previousKeyword, node: previousNode } = prevQueryParams;

    const differentPage = prevPath !== newPath || previousKeyword?.[0] !== newKeyword?.[0] || previousNode?.[0] !== newNode?.[0];

    /* eslint-enable object-curly-newline */
    return differentPage;
};

// eslint-disable-next-line object-curly-newline
const createOpenOrUpdatePageRequestOptions = ({ path, queryParams }) => {
    const salePaths = ['/sale', '/ca/en/sale', '/ca/fr/sale'];

    if (salePaths.indexOf(path) !== -1) {
        queryParams.keyword = ['sale'];
    }

    const normalizedParamKeys = Object.keys(queryParams).reduce((allowedParams, key) => {
        if (isFunction(allowedParamKeys[key])) {
            allowedParams[key] = allowedParamKeys[key](queryParams[key]);
        }

        return allowedParams;
    }, {});

    const decodeURIComponentSafely = uri => {
        try {
            return decodeURIComponent(uri);
        } catch (e) {
            return uri;
        }
    };
    const URI = decodeURIComponentSafely(queryParams.keyword[0]);

    const requestOptions = {
        q: URI,
        ...normalizedParamKeys
    };

    return requestOptions;
};

const openPage = context => {
    const {
        newLocation,
        events: { onDataLoaded, onPageUpdated, onError }
    } = context;
    const requestOptions = createOpenOrUpdatePageRequestOptions(newLocation);
    let redirectPath;

    if (SALE_KEYWORDS.includes(requestOptions.q) && newLocation.path === '/search') {
        redirectPath = SALE_REDIRECT_PATH;
    }

    if (!requestOptions.q || requestOptions.q === '') {
        redirectPath = HOME_REDIRECT_PATH;
    }

    if (redirectPath) {
        return Location.navigateTo(null, redirectPath);
    }

    return dispatch => {
        try {
            return fetchSearchResponse(requestOptions)
                .then(data => {
                    if (data.searchRedirectTarget) {
                        const { targetValue } = data.searchRedirectTarget;
                        Location.navigateTo(null, targetValue);
                    } else {
                        const imagesToPreload = getImagesToPreload(data);
                        onDataLoaded(data, imagesToPreload);
                        data.contextId = catalogUtils.createContextId();
                        dispatch(setSearchData(data, requestOptions));
                        onPageUpdated(data);
                    }
                })
                .catch(error => {
                    const imagesToPreload = getImagesToPreload(error);
                    onDataLoaded(error, imagesToPreload);
                    error.contextId = catalogUtils.createContextId();
                    dispatch(setSearchData(error, requestOptions));
                    onPageUpdated(error);
                });
        } catch (error) {
            onError(error);

            return Promise.reject(error);
        }
    };
};

const updatePage =
    ({ newLocation }) =>
        (dispatch, getState) => {
            const { page } = getState();
            const currentSearchResults = page['search'];
            const requestOptions = createOpenOrUpdatePageRequestOptions(newLocation);
            const requestControl = {};
            const apiCall = CATALOG_API_CALL.SEARCH;
            const abortablePromise = ufeApi.abortable(snbApi[apiCall], requestControl);
            const interstice = withInterstice(abortablePromise, 0);

            const { path: newPath, queryParams } = newLocation;

            if (newPath === '/sale') {
                queryParams.keyword = ['sale'];
            }

            return cachingConcern
                .decorate(
                    apiCall,
                    interstice
                )(requestOptions)
                .then(data => {
                    data.contextId = catalogUtils.createContextId();
                    // When Loading more products -> Add them instead of replacing them

                    if (
                        parseInt(requestOptions.currentPage) === parseInt(currentSearchResults.currentPage || 1) + 1 &&
                    // If products received is bigger than the pageSize
                    // we dont need to add because it's from cache (using back button)
                    data.products.length <= (data.pageSize || 60)
                    ) {
                        data.products = currentSearchResults.products.concat(data.products);
                    }

                    dispatch(setSearchData(data, requestOptions));
                })
                .catch(reason => {
                    if (reason.responseStatus === 200 && reason.errors && reason.errors.noSearchResult) {
                        reason.contextId = catalogUtils.createContextId();
                        dispatch(setSearchData(reason, requestOptions));
                    } else if (reason.errorCode === ufeApi.ResponseErrorCode.REQUEST_ABORTED) {
                    // eslint-disable-next-line no-console
                        console.debug('api request got aborted!');
                    } else {
                    // eslint-disable-next-line no-console
                        console.log(reason);
                    }

                    // eslint-disable-next-line no-console
                    console.log('Something went wrong', reason);
                });
        };

const getSearchResults = (keyword, suggestions) => {
    if (keyword && keyword.length) {
        /* show search suggestions only for keyword more then N characters long */
        if (keyword.length < KEYS.MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS) {
            return showSearchResults(keyword, []);
        } else {
            return dispatch => {
                return searchTypeAhead(keyword, false, suggestions)
                    .then(data => {
                        const results = [...data.typeAheadTerms];

                        if (data.trendingCategories) {
                            results.push({ trendingCategories: data.trendingCategories });
                        }

                        return dispatch(showSearchResults(keyword, results));
                    })
                    .catch(() => dispatch(showSearchResults(keyword, [])));
            };
        }
    } else {
        return showZeroStateSearchResults();
    }
};

export default {
    addRefinement,
    clearRefinements,
    getSearchResults,
    isNewPage,
    openPage,
    refreshSearchResults,
    removeRefinements,
    SEARCH_TYPES,
    setCategory,
    setPageNumber,
    setPageSize,
    setPrices,
    setSearchCategory,
    setSearchData,
    setSorting,
    showZeroStateSearchResults,
    STORAGE_KEYS,
    TYPES,
    updatePage,
    URLS
};
