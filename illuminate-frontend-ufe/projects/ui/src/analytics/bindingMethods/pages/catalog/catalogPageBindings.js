import anaConsts from 'analytics/constants';
import {
    CATEGORY_LEVEL, SALE_PAGE_PATH, SALE_PAGE_PATH_RWD, KEYWORD_SALE, TEMPLATES, KEYWORD_SEARCH
} from 'constants/Search';
import urlUtils from 'utils/Url';
import catalogUtils from 'utils/Search';
import basketUtils from 'utils/Basket';
import anaUtils from 'analytics/utils';
import locationUtils from 'utils/Location';
import processEvent from 'analytics/processEvent';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';
import catUtils from 'utils/Catalog';
import headerUtils from 'utils/Headers';
import { SALE_KEYWORDS } from 'constants/Search.js';

const { userXTimestampHeader, setEventTimestampFBCapi } = headerUtils;

//Catalog Page (Category/Brand/Search) Binding Methods

function getCurrentCategoryLevel(
    categories,
    isSearch = false,
    options = {
        parameter: 'isSelected',
        value: true
    }
) {
    let currentCategoryLevel;
    const selectedCategory = catalogUtils.getCatalogInfoFromCategories(categories, options);

    if (selectedCategory) {
        switch (selectedCategory.level) {
            case CATEGORY_LEVEL.ROOT:
                currentCategoryLevel = isSearch ? anaConsts.PAGE_TYPES.SEARCH_CATEGORY : anaConsts.PAGE_TYPES.ROOTCATEGORY;

                break;
            case CATEGORY_LEVEL.TOP:
                currentCategoryLevel = isSearch ? anaConsts.PAGE_TYPES.SEARCH_TOP : anaConsts.PAGE_TYPES.TOPCATEGORY;

                break;
            case CATEGORY_LEVEL.NTH:
                currentCategoryLevel = isSearch ? anaConsts.PAGE_TYPES.SEARCH_NTH : anaConsts.PAGE_TYPES.NTHCATEGORY;

                break;
            default:
                break;
        }
    }

    return currentCategoryLevel;
}

function getPageType(type) {
    // EXP-2126 - Please refer for mapping explanation
    // CE topcategory is Category for analytics tracking
    // and CE category is TopCategory for analytics tracking
    let pageType;

    switch (type) {
        case 'topcategory':
            pageType = anaConsts.PAGE_TYPES.RWD_CATEGORY;

            break;
        case 'category':
            pageType = anaConsts.PAGE_TYPES.RWD_TOPCATEGORY;

            break;
        case 'nthcategory':
            pageType = anaConsts.PAGE_TYPES.RWD_NTHCATEGORY;

            break;
        default:
            // Do nothing
            break;
    }

    return pageType;
}

function isTypeSearch() {
    const prevPageData = anaUtils.getPreviousPageData();

    return !!(prevPageData && prevPageData.prevSearchType);
}

function getSearchPageName(categories) {
    let searchPageName = 'products';
    const searchKeyword = urlUtils.getParamValueAsSingleString('keyword');
    const isSalePage = SALE_KEYWORDS.indexOf(searchKeyword?.toLowerCase()) !== -1;
    const urlPath = window.location.pathname;

    if (urlPath === SALE_PAGE_PATH || urlPath === SALE_PAGE_PATH_RWD || isSalePage) {
        searchPageName = KEYWORD_SALE;
    } else if (!isTypeSearch()) {
        const currentCategoryLevel = getCurrentCategoryLevel(categories, true);

        if (currentCategoryLevel) {
            searchPageName = currentCategoryLevel;
        }
    }

    return `results-${searchPageName}`;
}

function getSearchPageAttributes(totalProducts, userSegment, productsDisplayed) {
    let searchTerm = urlUtils.getParamValueAsSingleString('keyword');

    if (!searchTerm && locationUtils.isSalePage()) {
        searchTerm = 'sale';
    }

    return {
        searchTerm,
        numberOfResults: totalProducts ? totalProducts : digitalData.page.attributes.search.numberOfResults,
        searchAlgorithmType: userSegment,
        productsDisplayed
    };
}

function getLevelDisplayName(
    categories,
    options = {
        parameter: 'isSelected',
        value: true
    }
) {
    const selectedCategory = catalogUtils.getCatalogInfoFromCategories(categories, options);

    return (selectedCategory && selectedCategory.displayName) || '';
}

/**
 * helper function for buildNavEventData, returns navigationInfo string
 * @param {array}   data    [category, toplevel, nthlevel]
 * @param {string}  brand   the brand name
 * @return {string} - The Navigation Info string
 */
function buildNavInfoString(data, brand = '') {
    let navInfo = [];

    if (brand) {
        navInfo = ['brands', brand, ...data];
    } else {
        navInfo = [...data, null];
    }

    navInfo.forEach((item, i) => {
        if (!item) {
            navInfo[i] = navInfo[i - 1];
        }
    });

    return `left nav:${navInfo.join(':').toLowerCase()}`;
}

/**
 * helper function for getRecordCountOfSelection, returns the required item within
 * the array
 * @param {int}     type            root, top or nth
 * @param {string}  requiredItem    items to search
 */
function findItemInArray(list, requiredItem) {
    return list.find(item => item.displayName === requiredItem);
}

/**
 * helper function for buildNavEventData, returns total of search results
 * @param {int}  type       root, top or nth
 * @param {array}  items    items to search
 */
function getRecordCountOfSelection(type, items, selectedOpt) {
    let currentOption;

    switch (type) {
        case CATEGORY_LEVEL.ROOT:
            currentOption = findItemInArray(items, selectedOpt);

            break;

        case CATEGORY_LEVEL.TOP:
            currentOption = findItemInArray(items[0].subCategories, selectedOpt);

            break;

        case CATEGORY_LEVEL.NTH:
            currentOption = findItemInArray(items[0].subCategories[0].subCategories, selectedOpt);

            break;

        default:
            break;
    }

    return currentOption.recordCount;
}

/**
 * build data for navigation in categories, brand and search results
 * @param {array}  navItems    List of all items available for navigation menu
 * @param {string}  template    Type of the current template
 * @param {string}  selectedOpt Title of the selected option
 * @param {string}  currentLevel Level of the selected option
 */
/* eslint-disable-next-line complexity */
function buildNavEventData(navItems, template, selectedOpt, level) {
    const brand = digitalData.page.attributes.brand;
    let currentLevel = level;
    const brandPageType = brand ? anaConsts.PAGE_TYPES.BRAND : null;
    let pageDetail = selectedOpt && brand === selectedOpt ? '' : selectedOpt;
    let rootCategoryTitle = selectedOpt && navItems.length > 1 ? selectedOpt : navItems[0]?.displayName;
    let topLevelCategoryTitle;
    let nthLevelCategoryTitle;
    let pageName;
    let pageType;
    let navigationInfo;
    let world;
    let recordCount;
    const isSearch = template === TEMPLATES.SEARCH;

    // Fix for Brand See All which is above any category level
    if (template === TEMPLATES.NTH_BRAND && selectedOpt && selectedOpt === brand) {
        currentLevel = null;
        // Fix for wrong BE data where category level is incorrectly set as level:1 instead of level:0
    } else if (isSearch && !navItems[0]?.subCategories) {
        currentLevel = 0;
    }

    switch (currentLevel) {
        case CATEGORY_LEVEL.ROOT:
            pageType = isSearch ? anaConsts.PAGE_TYPES.SEARCH_CATEGORY : anaConsts.PAGE_TYPES.ROOTCATEGORY;

            break;

        case CATEGORY_LEVEL.TOP:
            pageType = isSearch ? anaConsts.PAGE_TYPES.SEARCH_TOP : anaConsts.PAGE_TYPES.TOPCATEGORY;
            topLevelCategoryTitle = selectedOpt;

            break;

        case CATEGORY_LEVEL.NTH:
            pageType = isSearch ? anaConsts.PAGE_TYPES.SEARCH_NTH : anaConsts.PAGE_TYPES.NTHCATEGORY;
            topLevelCategoryTitle = navItems[0].subCategories[0].displayName;
            nthLevelCategoryTitle = selectedOpt;

            break;

        default:
            rootCategoryTitle = null;

            break;
    }

    world = rootCategoryTitle || 'n/a';

    switch (template) {
        case TEMPLATES.SEARCH:
            pageDetail = `results-${pageType}`;
            world = 'n/a';
            recordCount = selectedOpt ? getRecordCountOfSelection(currentLevel, navItems, selectedOpt) : '';
            pageType = 'search';
            // TODO: extract this side effect
            digitalData.page.attributes.search = { numberOfResults: recordCount };

            break;

        case TEMPLATES.NTH_BRAND:
            pageType = [brandPageType, pageType].filter(Boolean).join('-');
            pageDetail = [brand, pageDetail].filter(Boolean).join('-');

            break;

        default:
            break;
    }

    pageDetail = pageDetail.toLowerCase();

    // eslint-disable-next-line prefer-const
    pageName = [pageType, pageDetail, world, '*' + digitalData.page.attributes.additionalPageInfo].join(':').toLowerCase();

    // eslint-disable-next-line prefer-const
    navigationInfo = buildNavInfoString([rootCategoryTitle, topLevelCategoryTitle, nthLevelCategoryTitle], brand);

    const eventData = {
        data: {
            pageName,
            pageType,
            world,
            pageDetail,
            navigationInfo,
            previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            eventStrings: !isSearch
                ? Sephora.Util?.InflatorComps?.services?.CatalogService?.catalogEngine.toLowerCase() === 'nlp'
                    ? [anaConsts.Event.NLP_SEARCH]
                    : [anaConsts.Event.ENDECA_SEARCH]
                : []
        }
    };

    // TODO: extract this side effect
    //Update page name so subsequent async calls have the proper previous page name.
    digitalData.page.attributes.sephoraPageInfo.pageName = eventData.data.pageName;
    digitalData.page.pageInfo.pageName = eventData.data.pageDetail;

    return eventData;
}

/**
 * Build data for products displayed on subcategory pages
 * @param {array} products List of products from the component.
 * Use to extract product skus as strings.
 */
function buildCatalogProductStrings(products) {
    let productStrings = [];

    if (products) {
        const productsWithSku = products.filter(product => product.currentSku && product.currentSku.skuId);

        productStrings = productsWithSku.slice(0, 20).map(product => product.currentSku.skuId);
    }

    return productStrings;
}

function setSearchPageLoadAnalytics(catalog, categoryFilters = []) {
    digitalData.page.category.pageType = anaConsts.PAGE_TYPES.SEARCH;
    digitalData.page.attributes.date = {};
    digitalData.page.attributes.date.timestamp = userXTimestampHeader(true)['x-timestamp'];
    digitalData.page.attributes.uniqueId = setEventTimestampFBCapi();
    digitalData.page.attributes.world = '';

    if (catalog.categories) {
        //Search Analytics
        digitalData.page.pageInfo.pageName = getSearchPageName(catalog.categories);
        digitalData.page.attributes.search = getSearchPageAttributes(catalog.totalProducts, catalog.userSegment, catalog.products);
    } else {
        //Null Search Analytics
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.FAILED_SEARCH;
        digitalData.page.attributes.search = getSearchPageAttributes('0', '', []);
        digitalData.page.attributes.searchFailedCorrelationId = catalog.correlationId;
    }

    digitalData.page.attributes.sephoraPageInfo = {
        pageName: generalBindings.getSephoraPageName(),
        categoryFilters: categoryFilters
    };
}

function setPageLoadAnalytics(catalog, categoryFilters) {
    const isBrandTemplate = locationUtils.isBrandNthCategoryPage();
    const brand = isBrandTemplate ? catalog.displayName : '';
    const brandPageType = isBrandTemplate ? 'brand' : '';
    const totalBasketCount = basketUtils.getTotalBasketCount();

    const brandCategory =
        catUtils.getCategoryInfoFromCategories(catalog.categories, {
            parameter: 'targetUrl',
            value: catalog.seoCanonicalUrl
        }) || catalog.categories.length > 0
            ? catalog.categories[0]
            : {};
    const category = catUtils.getCurrentCategoryById(catalog?.categoryId, catalog.categories);
    const currentCategory = isBrandTemplate ? brandCategory : category;
    const pageType = isBrandTemplate
        ? getCurrentCategoryLevel(currentCategory, false)
        : getPageType(catalog?.pageType?.toLowerCase()) || getCurrentCategoryLevel(currentCategory, false);
    const rootCategoryName = isBrandTemplate ? currentCategory?.displayName : catalog.categories[0]?.displayName;

    const pageDetail = isBrandTemplate
        ? getLevelDisplayName(currentCategory)
        : currentCategory
            ? getLevelDisplayName(currentCategory).toLowerCase()
            : rootCategoryName?.toLowerCase();

    const brandInfo =
        catalog.categories && catalog.categories.length
            ? catalogUtils.getCatalogInfoFromCategories(catalog.categories, {
                parameter: 'isSelected',
                value: true
            })
            : null;
    const isBrandLanding = isBrandTemplate && !brandInfo;

    digitalData.page.category.pageType = [brandPageType, pageType].filter(Boolean).join('-');
    digitalData.page.pageInfo.pageName = [brand, pageDetail].filter(Boolean).join('-');
    digitalData.page.category.primaryCategory = rootCategoryName;
    digitalData.page.attributes.world = isBrandLanding ? '' : rootCategoryName;
    digitalData.page.attributes.brand = brand;
    digitalData.page.category.fbProductSkus = buildCatalogProductStrings(catalog.products || []);
    digitalData.page.category.productSkus = catalog.products?.map(productData => productData.currentSku?.skuId) || [];
    digitalData.page.attributes.additionalPageInfo = '';
    digitalData.page.attributes.catalogTotalProducts = catalog.totalProducts || 0;
    digitalData.page.attributes.totalBasketCount = totalBasketCount;

    digitalData.page.attributes.sephoraPageInfo = {
        pageName: generalBindings.getSephoraPageName(),
        categoryFilters: categoryFilters
    };

    digitalData.page.attributes.date = {};
    digitalData.page.attributes.date.timestamp = userXTimestampHeader(true)['x-timestamp'];
    digitalData.page.attributes.uniqueId = setEventTimestampFBCapi();

    if (digitalData.page.attributes.previousPageData?.prevSearchType && !locationUtils.isSearchPage()) {
        digitalData.page.attributes.previousPageData.prevSearchType = '';
    }
}

function fireAsyncPageLoadAnalytics(catalog, categoryFilters) {
    const previousPageData = anaUtils.getPreviousPageData();
    const isSearch = locationUtils.isSearchPage();
    digitalData.page.attributes.catalogTotalProducts = catalog.totalProducts || 0;
    digitalData.page.attributes.sephoraPageInfo.categoryFilters = categoryFilters;
    digitalData.page.attributes.search = getSearchPageAttributes(catalog.totalProducts, catalog.userSegment, catalog.products);

    if (digitalData.page.attributes.previousPageData?.prevSearchType && !locationUtils.isSearchPage()) {
        digitalData.page.attributes.previousPageData.prevSearchType = '';
    }

    if (isSearch) {
        const pageDetail = getSearchPageName(catalog.categories);
        const pageName = `${KEYWORD_SEARCH}:${pageDetail}:n/a:*`;
        digitalData.page.pageInfo.pageName = pageDetail;
        digitalData.page.attributes.sephoraPageInfo.pageName = pageName;
        anaUtils.setNextPageData({ pageName });
    }

    const eventData = {
        data: {
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType,
            world: digitalData.page.attributes.world,
            pageDetail: digitalData.page.pageInfo.pageName,
            categoryFilters: digitalData.page.attributes.sephoraPageInfo?.categoryFilters
        }
    };

    if (isSearch) {
        eventData.data.previousPageName = previousPageData.pageName;
    }

    eventData.data.eventStrings = generalBindings.getPageEvents(
        digitalData.page.attributes.sephoraPageInfo.pageName,
        digitalData.page.category.pageType
    );

    if (previousPageData?.navigationInfo) {
        eventData.data.navigationInfo = previousPageData.navigationInfo;
    }

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, eventData);
}

export default {
    getCurrentCategoryLevel,
    isTypeSearch,
    getSearchPageName,
    getSearchPageAttributes,
    getLevelDisplayName,
    buildNavEventData,
    buildCatalogProductStrings,
    setPageLoadAnalytics,
    fireAsyncPageLoadAnalytics,
    setSearchPageLoadAnalytics
};
