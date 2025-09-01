import PageTemplateType from 'constants/PageTemplateType';
import { PICKUP, SAME_DAY, UPPER_FUNNEL_REFINEMENTS } from 'constants/UpperFunnel';
import Empty from 'constants/empty';
import * as catalogConstantsUtils from 'utils/CatalogConstants';
import Helpers from 'utils/Helpers';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';

const getText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog');
const {
    REFINEMENT_TYPES, REFINEMENT_STATES, PRICE_KEYS, PRICE_VALUES, MANUAL_PTYPE, SEARCH_SORT_OPTIONS
} = catalogConstantsUtils;

const FALLBACK_RESPONSE_SOURCE = 'endeca';

const ENDECA_SORT_OPTIONS = [
    {
        name: 'bestselling',
        code: 'BEST_SELLING',
        apiValue: 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0'
    },
    {
        name: 'topRated',
        code: 'TOP_RATED',
        apiValue: 'P_RATING:1'
    },
    {
        name: 'priceAsc',
        code: 'PRICE_LOW_TO_HIGH',
        apiValue: 'price:0'
    },
    {
        name: 'priceDesc',
        code: 'PRICE_HIGH_TO_LOW',
        apiValue: 'price:1'
    },
    {
        name: 'new',
        code: 'NEW',
        apiValue: 'P_NEW:1::P_START_DATE:1'
    }
];

const NLP_SORT_OPTIONS = [
    {
        name: 'relevancy',
        code: 'RELEVANCY',
        apiValue: '-1'
    },
    {
        name: 'bestselling',
        code: 'BEST_SELLING',
        apiValue: 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0'
    },
    {
        name: 'topRated',
        code: 'TOP_RATED',
        apiValue: 'P_RATING:1'
    },
    {
        name: 'priceAsc',
        code: 'PRICE_LOW_TO_HIGH',
        apiValue: 'price:0'
    },
    {
        name: 'priceDesc',
        code: 'PRICE_HIGH_TO_LOW',
        apiValue: 'price:1'
    },
    {
        name: 'new',
        code: 'NEW',
        apiValue: 'P_NEW:1::P_START_DATE:1'
    }
];

const SORT_OPTIONS = {
    search: SEARCH_SORT_OPTIONS,
    endeca: ENDECA_SORT_OPTIONS,
    nlp: NLP_SORT_OPTIONS
};

const DEFAULT_SORT_OPTION_CODE = {
    search: 'RELEVANCY',
    endeca: 'BEST_SELLING',
    nlp: 'RELEVANCY'
};

const CURRENCY_SYMBOL = localeUtils.CURRENCY_SYMBOLS.US;

function getSortByApiValue(responseSource, sortOptionCode) {
    const rs = responseSource?.toLowerCase() || FALLBACK_RESPONSE_SOURCE;
    const apiValue = SORT_OPTIONS[rs].find(x => x.code === sortOptionCode)?.apiValue;

    return apiValue;
}

function getSelectedOrDefaultSortOption(refinementValues, showUpdateDefaultSort) {
    let sortByFromUrl;
    const isSearchPage = Location.isSearchPage();
    const isSalePage = Location.isSalePage();

    if (global.window) {
        sortByFromUrl = new URLSearchParams(global.window?.location.search).get('sortBy');
    } else {
        sortByFromUrl = urlUtils.getParamValueAsSingleString('sortBy');
    }

    if (showUpdateDefaultSort && !sortByFromUrl && !isSearchPage && !isSalePage) {
        sortByFromUrl = DEFAULT_SORT_OPTION_CODE.endeca;
    }

    const selectedOrDefaultOption =
        refinementValues?.find(x => x.refinementValueStatus === REFINEMENT_STATES.CHECKED) ||
        refinementValues?.find(x => x.refinementValue === sortByFromUrl) ||
        refinementValues?.find(x => x.isDefault);

    return selectedOrDefaultOption;
}

function createSortRefinement(responseSource, sortOptionCode, selectedFilters, isSamePage, showUpdateDefaultSort = false) {
    // (EXP-3199) Reset Sort state when navigating to new page
    const optionCode = isSamePage ? sortOptionCode : null;

    const rs = responseSource?.toLowerCase() || FALLBACK_RESPONSE_SOURCE;
    const isSearchPage = Location.isSearchPage();
    const isSalePage = Location.isSalePage();

    let defaultSortOptionCode = DEFAULT_SORT_OPTION_CODE[rs];

    if (rs === 'nlp' && showUpdateDefaultSort && !isSearchPage && !isSalePage) {
        defaultSortOptionCode = 'BEST_SELLING';
    }

    const values = SORT_OPTIONS[rs].map(x => ({
        refinementValue: x.code,
        refinementValueDisplayName: getText(x.name),
        refinementValueStatus: x.code === optionCode ? REFINEMENT_STATES.CHECKED : REFINEMENT_STATES.INACTIVE
    }));

    const name = getText('sort');
    const defaultValue = values.find(x => x.refinementValue === defaultSortOptionCode);
    defaultValue.isDefault = true;
    const userSelectedSomeSort = selectedFilters[name]?.length > 0;
    const noMatchToSortOptionCode = values.findIndex(x => x.refinementValueStatus === REFINEMENT_STATES.CHECKED) < 0;
    const resetSortToDefault = userSelectedSomeSort && noMatchToSortOptionCode;

    if (isSamePage && resetSortToDefault) {
        defaultValue.refinementValueStatus = REFINEMENT_STATES.CHECKED;
    }

    const sortRefinement = {
        displayName: name,
        type: REFINEMENT_TYPES.SORT,
        values: values
    };

    return sortRefinement;
}

function parseCustomRangeValues(refinementValue) {
    const values = refinementValue
        .split('&')
        .map(arg => {
            const kv = arg.split('=');

            return {
                key: kv[0],
                value: kv[1]
            };
        })
        .reduce((acc, x) => {
            acc[x.key] = x.value;

            return acc;
        }, {});

    return values;
}

function addLocalizedCurrencySign(value, separator = '') {
    return localeUtils.isFRCanada() ? `${value}${separator}${CURRENCY_SYMBOL}` : `${CURRENCY_SYMBOL}${separator}${value}`;
}

function createCustomRangeDisplayName(value) {
    const values = parseCustomRangeValues(value);
    const min = values[PRICE_KEYS.PL] === PRICE_VALUES.MIN ? '0' : values[PRICE_KEYS.PL];
    const max = values[PRICE_KEYS.PH];

    const result =
        max !== PRICE_VALUES.MAX
            ? `${addLocalizedCurrencySign(min)} - ${addLocalizedCurrencySign(max)}`
            : `${addLocalizedCurrencySign(min)} ${getText('andAbove')}`;

    return result;
}

function isCustomRange(value) {
    return value?.indexOf(MANUAL_PTYPE) >= 0;
}

function createFiltersWithSortRefinements(catalog, selectedFilters, isSamePage, showUpdateDefaultSort = false) {
    const { responseSource, refinements } = catalog;
    const sortOptionCode = urlUtils.getParamsByName('sortBy')?.[0] || undefined;
    let categoryFilters = [];
    const refinementsOrEmpty = Array.isArray(refinements) ? refinements : [];

    const sortRefinement = createSortRefinement(responseSource, sortOptionCode, selectedFilters, isSamePage, showUpdateDefaultSort);
    const withSortRefinements = [sortRefinement, ...refinementsOrEmpty];
    const filters = withSortRefinements.reduce((acc, refinement) => {
        const analiticsValues = [];
        const values = refinement?.values?.length
            ? refinement?.values
                .filter(x => x.refinementValueStatus === REFINEMENT_STATES.CHECKED)
                .map(x => {
                    const displayName = refinement.type === REFINEMENT_TYPES.SORT ? 'sortby' : refinement.displayName;
                    const rawSubKey = x.refinementValue.match(/filters\[(.*?)\]=/)?.[1];
                    // Format keys to have spaces in between as specified in jira: https://jira.sephora.com/browse/SBR-1752
                    const formattedSubKey = rawSubKey?.replace(/([a-z])([A-Z])/g, '$1 $2');
                    const subDisplayName = refinement.type === REFINEMENT_TYPES.BEAUTY_PREFERENCES && formattedSubKey ? `.${formattedSubKey}` : '';

                    const analyticsDisplayName = `${displayName}${subDisplayName}`;
                    const analyticsValueDisplayName = isCustomRange(x.refinementValue)
                        ? createCustomRangeDisplayName(x.refinementValue)
                        : x.refinementValueDisplayName;

                    analiticsValues.push(`${analyticsDisplayName}=${analyticsValueDisplayName}`.toLowerCase());

                    return x.refinementValue;
                })
            : Empty.Array;

        acc[refinement.displayName] = values;
        categoryFilters = [...categoryFilters, ...analiticsValues];

        return acc;
    }, {});

    return {
        filters,
        withSortRefinements,
        categoryFilters
    };
}

function addToSelection(currentSelectedFilters, filtersToSelect) {
    const newSelectedFilters = { ...currentSelectedFilters };

    Object.keys(filtersToSelect).forEach(filterKey => {
        newSelectedFilters[filterKey] = filtersToSelect[filterKey];
    });

    return newSelectedFilters;
}

function removeValueFromSelection(currentSelectedFilters, filterKey, filterValue) {
    const newSelectedFilters = { ...currentSelectedFilters };
    newSelectedFilters[filterKey] = currentSelectedFilters[filterKey].filter(x => x !== filterValue);

    return newSelectedFilters;
}

function createFiltersToApply(currentSelectedFilters, refinements) {
    const filtersToApply = {};
    Object.keys(currentSelectedFilters).forEach(name => {
        const ref = refinements.find(x => x.displayName === name);

        if (ref) {
            filtersToApply[ref.type] = filtersToApply[ref.type]
                ? filtersToApply[ref.type].concat(currentSelectedFilters[name])
                : currentSelectedFilters[name];
        }
    });

    return filtersToApply;
}

function resetSelection(currentSelectedFilters, resetSortToDefault) {
    const sortName = getText('sort');
    const newSelectedFilters = { ...currentSelectedFilters };
    Object.keys(newSelectedFilters).forEach(filterKey => {
        newSelectedFilters[filterKey] = filterKey === sortName && !resetSortToDefault ? currentSelectedFilters[filterKey] : [];
    });

    return newSelectedFilters;
}

function emptyByPattern(sourceValue, pattern) {
    const newValue = !sourceValue || sourceValue === pattern ? '' : `${addLocalizedCurrencySign(sourceValue)}`;

    return newValue;
}

function getCurrentCategoryById(categoryId, categories) {
    if (!categoryId || !categories || !categories.length) {
        return null;
    }

    const topCategory = categories[0]?.subCategories[0];

    if (topCategory.categoryId === categoryId) {
        return topCategory;
    } else {
        return topCategory?.subCategories?.find(nthCat => nthCat.categoryId === categoryId);
    }
}

function getCategoryDisplayName(categories, categoryId) {
    const foundCategory = categories?.find(x => x.categoryId === categoryId || x.isSelected);

    return foundCategory
        ? foundCategory.displayName
        : categories?.length > 0 && categories[0].subCategories
            ? getCategoryDisplayName(categories[0].subCategories, categoryId)
            : null;
}

function getCategoryInfoFromCategories(categories, options) {
    /*checking if targetUrl in categories.catalog starts with /ca/en or /ca/fr
    and if options.targetUrl also starts with /ca/en or /ca/fr
    */
    if (options.parameter === 'targetUrl' && categories && Object.keys(categories).length > 0) {
        let optionsValuePrefix;
        const categoriesTargetUrl = categories[0]?.targetUrl || categories.targetUrl;

        if (categoriesTargetUrl) {
            if (categoriesTargetUrl.startsWith('/ca/en')) {
                optionsValuePrefix = '/ca/en';
            } else if (categoriesTargetUrl.startsWith('/ca/fr')) {
                optionsValuePrefix = '/ca/fr';
            }
        }

        //prefix /ca/en or /ca/fr if options.value doesnot have one
        if (optionsValuePrefix && !options.value.startsWith('/ca')) {
            options.value = `${optionsValuePrefix}${options.value}`;
        }
    }

    if (!categories || categories[options.parameter] === options.value) {
        return categories;
    }

    let result, property;

    for (property in categories) {
        if (
            Object.prototype.hasOwnProperty.call(categories, property) &&
            (Helpers.isObject(categories[property]) || Array.isArray(categories[property]))
        ) {
            result = getCategoryInfoFromCategories(categories[property], options);

            if (result) {
                return result;
            }
        }
    }

    return result;
}

function getCatalogInfoByURL(url, categories) {
    // Removing /ca/en or /ca/fr to normalize this logic
    const urlWithoutCaPrefix = url.replace(urlUtils.isSEOForCanadaRegExp, '');
    const urlSections = urlWithoutCaPrefix.split('/');
    const isAllCategories = urlSections[urlSections.length - 1] === 'all';
    const isSearch = urlSections[1] === 'search';
    const catalogInfo = isAllCategories
        ? { catalogId: 'all' }
        : isSearch
            ? { catalogId: urlUtils.getParams(window.location.search, ['keyword']).keyword[0] }
            : getCategoryInfoFromCategories(categories, {
                parameter: 'targetUrl',
                value: urlWithoutCaPrefix
            });

    return catalogInfo;
}

function addCategoryOptions(displayOptions, category, isCollapseNth) {
    const categoryDisplayOptions = { displayOptions };

    if (category) {
        displayOptions.catalogId = category.categoryId;

        if (isCollapseNth) {
            categoryDisplayOptions.currentCategoryLevel = category.level;
        }
    }

    return categoryDisplayOptions;
}

function addBrandOptions(displayOptions, brandInfo, isCollapseNth) {
    const categoryDisplayOptions = { displayOptions };

    if (brandInfo) {
        displayOptions.catalogId = brandInfo.node || brandInfo.nodeStr || brandInfo.catalogId;

        if (isCollapseNth) {
            categoryDisplayOptions.currentCategoryLevel = brandInfo.level;
        }
    }

    return categoryDisplayOptions;
}

function addNLPRequestOptions(options, excludePersonalizedContent = true) {
    if (excludePersonalizedContent) {
        const isUserAnonymous = userUtils.isAnonymous();

        if (isUserAnonymous) {
            options.headers = { EXCLUDE_PERSONALIZED_CONTENT: true };

            return options;
        }
    }

    const isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
    const isNLPCatalog = Sephora.Util.InflatorComps.services.CatalogService?.isNLPCatalog();
    const constructorSessionID = global.ConstructorioTracker?.getSessionID();
    const constructorClientID = global.ConstructorioTracker?.getClientID();

    if (isNLPInstrumentationEnabled && isNLPCatalog && constructorSessionID && constructorClientID) {
        if (options.sortBy) {
            if (options.sortBy !== '-1' && excludePersonalizedContent) {
                options.headers = { EXCLUDE_PERSONALIZED_CONTENT: true };
            } else {
                delete options.sortBy;
            }
        }

        if (!options.headers?.EXCLUDE_PERSONALIZED_CONTENT) {
            options.constructorSessionID = constructorSessionID;
            options.constructorClientID = constructorClientID;
        }
    }

    return options;
}

function mergeFulfillOptions(pageData, fulfillmentOptions) {
    const mergedData = {};
    const defaultInventoryAvailability = {
        pickupEligible: false,
        sameDayEligible: false
    };

    if (fulfillmentOptions?.refinements) {
        const refinementsWithoutUpperFunnelRefinement = (pageData?.refinements || []).filter(
            ref => ref.type !== REFINEMENT_TYPES.CHECKBOXES_WITH_DROPDOWN
        );

        mergedData.refinements = [...fulfillmentOptions.refinements, ...refinementsWithoutUpperFunnelRefinement];
    }

    if (fulfillmentOptions?.deliveryOptions) {
        mergedData.deliveryOptions = { ...fulfillmentOptions.deliveryOptions };
    }

    if (fulfillmentOptions?.products) {
        const productsMap = new Map();
        const allProductsData = [...pageData.products, ...fulfillmentOptions.products];

        for (const product of allProductsData) {
            const productId = product.productId;
            productsMap.set(productId, Object.assign(productsMap.get(productId) || {}, defaultInventoryAvailability, product));
        }

        mergedData.products = Array.from(productsMap.values());
    }

    return mergedData;
}

function hasUpperFunnelRefinement(refinements) {
    const result = refinements.some(refinement => refinement.type === REFINEMENT_TYPES.CHECKBOXES_WITH_DROPDOWN);

    return result;
}

function isFiltered(filters = {}) {
    if (Sephora.isNodeRender) {
        return Object.prototype.hasOwnProperty.call(Sephora.renderQueryParams, 'cachedQueryParams');
    }

    const sortByFromUrl = new URLSearchParams(global.window?.location?.search).get('sortBy');

    if (sortByFromUrl) {
        return true;
    }

    for (const filter of Object.keys(filters)) {
        if (filters[filter].length > 0) {
            return true;
        }
    }

    return false;
}

function fillWithSkeleton(products) {
    const productsWithSkeletons = [];
    products.forEach((product, index) => {
        if (index === 2 || index === 4) {
            productsWithSkeletons.push(null);
        }

        productsWithSkeletons.push(product);
    });

    return { productsWithSponsor: productsWithSkeletons, totalProductsWithSponsor: 0 };
}

function fillWithBanner(products) {
    const reservedBannerPositions = 13;

    const productsWithBanner = [...products];

    productsWithBanner.splice(reservedBannerPositions, 0, { type: 'banner' });

    return productsWithBanner;
}

function fillWithSponsorProducts(products, sponsorProducts) {
    const copyOfProducts = [...products];
    const reservedSponsorPositions = [2, 5, 8, 15, 18, 21, 24, 31, 32, 39, 45, 56];
    const fallbackPositionOne = 9;
    const fallbackPositionTwo = 10;

    if (sponsorProducts.length === 0) {
        if (copyOfProducts.length > 10) {
            // Back fill sponsor positions 2 and 5
            // from products in position 9 and 10
            const product1 = copyOfProducts[fallbackPositionOne];
            const product2 = copyOfProducts[fallbackPositionTwo];
            copyOfProducts.splice(9, 2);
            copyOfProducts.splice(2, 0, product1);
            copyOfProducts.splice(5, 0, product2);
        }

        return { productsWithSponsor: copyOfProducts, totalProductsWithSponsor: 0 };
    }

    if (sponsorProducts.length === 1) {
        if (copyOfProducts.length > 10) {
            // Back fill sponsor positions 5
            // from product in position 9
            const product1 = copyOfProducts[fallbackPositionOne];
            copyOfProducts.splice(9, 1);
            copyOfProducts.splice(2, 0, sponsorProducts[0]);
            copyOfProducts.splice(5, 0, product1);
        }

        return { productsWithSponsor: copyOfProducts, totalProductsWithSponsor: 1 };
    }

    let productIndex = 0;
    let sponsorIndex = 0;

    while (copyOfProducts[productIndex]) {
        if (reservedSponsorPositions.includes(productIndex)) {
            if (sponsorProducts[sponsorIndex]) {
                copyOfProducts.splice(productIndex, 0, sponsorProducts[sponsorIndex]);
                sponsorIndex++;
            }
        }

        productIndex++;
    }

    return { productsWithSponsor: copyOfProducts, totalProductsWithSponsor: sponsorIndex };
}

function getProductsWithSponsors(products, sponsorProducts, sponsorProductsLoaded, haveMiddleBanner) {
    if (sponsorProductsLoaded) {
        return fillWithSponsorProducts(products, sponsorProducts, haveMiddleBanner);
    } else {
        return fillWithSkeleton(products);
    }
}

const CatalogUtils = {
    catalogInstanceOptions: {
        [PageTemplateType.NthCategory]: {
            addCatalogOptions: addCategoryOptions,
            catalogApiCall: 'getNthLevelCategory',
            shouldAugmentCategories: false,
            isCollapseNth: true
        },
        [PageTemplateType.BrandNthCategory]: {
            addCatalogOptions: addBrandOptions,
            catalogApiCall: 'getNthLevelBrand',
            shouldAugmentCategories: true,
            isCollapseNth: false
        }
    },

    getCatalogName: function (path = '', pageUrl) {
        const parts = path.split(pageUrl);

        return parts.length >= 2 && parts[1].length > 0 ? parts[1] : null;
    },

    getPrevSelectedCategory: function (categories) {
        const prevSelectedCategory = getCategoryInfoFromCategories(categories, {
            parameter: 'isSelected',
            value: true
        });

        return prevSelectedCategory ? prevSelectedCategory : null;
    },

    createRequestOptions: function (displayOptions, restParams, location) {
        const {
            refinementValueIds, currentPage, pageSize, catalogId, node
        } = displayOptions;

        const queryParams = location?.queryParams || {};
        const responseType = restParams.template === PageTemplateType.Search ? 'search' : restParams.responseSource;
        const sortOptionCode = queryParams.sortBy ? queryParams.sortBy[0] : null;
        const sortBy = getSortByApiValue(responseType, sortOptionCode);

        let ref;

        if (refinementValueIds && refinementValueIds.length > 0) {
            ref = refinementValueIds.join(',');
        }

        return {
            catalogId: catalogId || restParams.catalogId,
            ref,
            sortBy,
            currentPage,
            pageSize,
            pl: queryParams.pl ? queryParams.pl[0] : undefined,
            ph: queryParams.ph ? queryParams.ph[0] : undefined,
            ptype: queryParams.ptype ? queryParams.ptype[0] : undefined,
            node: node !== null ? node : undefined,
            // Brand specific options
            brandId: restParams.brandId,
            // Content options
            content: true,
            includeRegionsMap: true
        };
    },

    getOptionsFromLocation: function (location, categoriesForSearching, restParams) {
        const { path, queryParams } = location;

        const catalog = restParams.isSaleResultsPage ? { catalogId: 'sale' } : getCatalogInfoByURL(path, categoriesForSearching);

        const displayOptions = {};
        const catalogOptions = {};

        // Same displayOption properties for all catalog pages
        if (queryParams.ref && Array.isArray(queryParams.ref)) {
            // remove duplicated values and transform to numbers
            displayOptions.refinementValueIds = queryParams.ref
                .filter((refinementId, index, arr) => arr.indexOf(refinementId) === index)
                .map(refinementId => (typeof refinementId === 'string' ? refinementId : parseInt(refinementId, 10)));
        } else {
            if (restParams.template === PageTemplateType.Search) {
                const refinementValueIds = [];
                Object.keys(queryParams).forEach(function (param) {
                    if (param.includes('ref')) {
                        const refimentsString = param.split('ref=')[1].split(',');

                        if (refimentsString) {
                            refimentsString.forEach(function (ref, refIndex) {
                                const refinementValueId = refIndex === refimentsString.length - 1 ? `${ref}=${queryParams[param][0]}` : ref;
                                refinementValueIds.push(refinementValueId);
                            });
                        }
                    }
                });
                displayOptions.refinementValueIds = refinementValueIds;
            } else {
                displayOptions.refinementValueIds = [];
            }
        }

        displayOptions.currentPage = queryParams.currentPage ? queryParams.currentPage[0] : 1;

        displayOptions.pageSize = queryParams.pageSize ? parseInt(queryParams.pageSize[0], 10) : restParams.pageSize;

        if (queryParams && queryParams.node) {
            displayOptions.node = queryParams.node;
        }

        // Sorting is needed to avoid optimizations for caching
        // in other places.
        displayOptions.refinementValueIds.sort();

        // Add catalog specific properties
        Object.assign(
            catalogOptions,
            CatalogUtils.catalogInstanceOptions[restParams.template].addCatalogOptions(displayOptions, catalog, restParams.isCollapseNth)
        );

        return catalogOptions;
    },

    addUpperFunnelParams: function (options, user) {
        if (Sephora.isNodeRender || Sephora.isSEO) {
            return options;
        }

        const { enablePickupSearchFilterInBrowse, enableSameDaySearchFilterInBrowse } = user;
        const refinements = (urlUtils.getParams() || {}).ref || [];
        let isPickupFilterApplied, isSameDayFilterApplied;
        refinements.forEach(ref => {
            if (ref.startsWith(PICKUP)) {
                isPickupFilterApplied = true;
            }

            if (ref.startsWith(SAME_DAY)) {
                isSameDayFilterApplied = true;
            }
        });

        if (enablePickupSearchFilterInBrowse && Sephora.configurationSettings.isBOPISEnabled) {
            options.pickupRampup = true;

            if (user.preferredStoreInfo?.storeId && !isPickupFilterApplied) {
                options.pickupStoreId = user.preferredStoreInfo?.storeId;
            }
        }

        if (enableSameDaySearchFilterInBrowse && Sephora.configurationSettings.isSameDayShippingEnabled) {
            options.sddRampup = true;

            if (user.preferredZipCode && !isSameDayFilterApplied) {
                options.sddZipcode = user.preferredZipCode;
            }
        }

        if (Sephora.configurationSettings.shipToHomeFilterEligibleInBrowse) {
            options.includeEDD = true;
        }

        return options;
    },

    isFilterSelected: function (selectedFilters, filterKey) {
        for (const filterName of Object.keys(selectedFilters)) {
            for (const filterValue of selectedFilters[filterName]) {
                if (filterValue.startsWith(filterKey)) {
                    return true;
                }
            }
        }

        return false;
    },

    refinementValueFromUrl: function (key) {
        const ref = urlUtils.getParams()?.ref || [];
        const filter = ref.find(r => r.startsWith(key));
        const value = filter ? filter.split('=')[1] : null;

        return value;
    },

    hasUpperFunnelParams: function () {
        const ref = urlUtils.getParams()?.ref || [];
        const result = ref.some(r => {
            const key = r.split('=')[0];
            const isInUrl = UPPER_FUNNEL_REFINEMENTS.includes(key);

            return isInUrl;
        });

        return result;
    },

    getPageProductsIds: function (pageData) {
        const products = pageData?.products || [];
        const productsIds = products.map(product => {
            return product?.productId;
        });

        return productsIds;
    },

    checkNullCaseForDerivedStateFromProps: function (catalog, prevContextId) {
        return !catalog || Object.keys(catalog).length === 0 || (catalog.contextId && catalog.contextId === prevContextId);
    },

    getTextSidebarTitle: function (isSearchPage, isSalePage, sidebarTitleState) {
        let sidebarTitle = '';

        if (isSearchPage) {
            sidebarTitle = 'searchResults';
        } else if (isSalePage) {
            sidebarTitle = 'sale';
        }

        return sidebarTitle.length > 0 ? sidebarTitle : sidebarTitleState;
    },

    isPXSSearchEnabled: function () {
        return Sephora.configurationSettings.isPXSSearchEnabled || false;
    },

    addLocalizedCurrencySign,
    getCategoryInfoFromCategories,
    isCustomRange,
    parseCustomRangeValues,
    emptyByPattern,
    createCustomRangeDisplayName,
    getSortByApiValue,
    getSelectedOrDefaultSortOption,
    createSortRefinement,
    createFiltersWithSortRefinements,
    addToSelection,
    removeValueFromSelection,
    resetSelection,
    createFiltersToApply,
    getCurrentCategoryById,
    getCategoryDisplayName,
    addNLPRequestOptions,
    mergeFulfillOptions,
    hasUpperFunnelRefinement,
    createContextId: () => Math.random().toString(36).substring(2),
    encodeDecodedParam: param => {
        try {
            if (typeof param === 'string' && param === decodeURIComponent(param)) {
                return encodeURIComponent(param);
            }
        } catch (e) {
            return encodeURIComponent(param);
        }

        return param;
    },
    isFiltered,
    getProductsWithSponsors,
    fillWithBanner,
    groupByFilterType: function ({ preferences, categorySpecificMasterList, filterLimit }) {
        const map = new Map();

        let limit = filterLimit;

        categorySpecificMasterList?.refinements.forEach(({ value, key }) => {
            const matchedInfo = preferences?.reduce(
                (acc, preference) => {
                    const keyToMatch = preference.refinementValue.match(/\[(.*?)\]/)?.[1];

                    if (key === keyToMatch) {
                        acc.preferences.push(preference);
                    }

                    return acc;
                },
                { groupKey: value, preferences: [] }
            );

            if (matchedInfo) {
                if (!map.has(matchedInfo.groupKey)) {
                    if (matchedInfo.preferences.length > limit) {
                        map.set(matchedInfo.groupKey, matchedInfo.preferences.slice(0, limit));
                    } else {
                        map.set(matchedInfo.groupKey, matchedInfo.preferences);
                    }

                    limit -= matchedInfo.preferences.length;
                }
            }
        });

        return map;
    },
    getFilterGroupingInfo: function ({ categorySpecificMasterList, isModal, filterLimit }) {
        return {
            getGroupedValues: filteredList => {
                return this.groupByFilterType({
                    preferences: filteredList,
                    categorySpecificMasterList,
                    filterLimit: isModal ? Infinity : filterLimit
                });
            }
        };
    },
    getBeautyPreferencesRefinementValues: function ({ userSavedBeautyPreferences = {}, constructorRefinements, categorySpecificMasterList }) {
        const worldPreferences = userSavedBeautyPreferences[categorySpecificMasterList?.key];

        if (!categorySpecificMasterList?.refinements || !worldPreferences) {
            return [];
        }

        const filteredBeautyPreferencesByRefinementKey = Object.entries(categorySpecificMasterList?.refinements).reduce((acc, [_, obj]) => {
            const { items, key } = obj;
            // Check every refinement in the master list against the user's saved BP and only keep master list items that match
            const userPrefs = worldPreferences[key];

            if (Array.isArray(userPrefs)) {
                const filteredItems = items.filter(item => item.filterable && userPrefs.includes(item.key));
                acc[key] = {
                    ...obj,
                    items: filteredItems
                };
            }

            if (typeof userPrefs === 'string') {
                const filteredItems = items.filter(item => item.filterable && userPrefs === item.key);
                acc[key] = {
                    ...obj,
                    items: filteredItems
                };
            }

            return acc;
        }, {});

        // Check every refinement from constructor in the BXS call, if it matches refinement from master list (filtered by user prefs) then we use that for checkbox state.
        return constructorRefinements.reduce((acc, refinement) => {
            if (filteredBeautyPreferencesByRefinementKey[refinement?.key]) {
                const { items } = filteredBeautyPreferencesByRefinementKey[refinement.key];

                acc.push(
                    ...refinement.values.filter(({ key }) =>
                        // Filter each value by parsing key out of query param ref
                        items.find(item => item.key === key)
                    )
                );
            }

            return acc;
        }, []);
    },
    getBeautyPreferencesSpokeValues: function ({ userSavedBeautyPreferences = {}, constructorRefinements, categorySpecificMasterList }) {
        const excludedKeys = ['ageRange', 'brands'];

        if (!categorySpecificMasterList?.refinements) {
            return {};
        }

        const worldPreferences = userSavedBeautyPreferences[categorySpecificMasterList?.key];

        // Filter unsaved beauty preferences
        const filteredUnsavedBeautyPreferences = Object.entries(categorySpecificMasterList?.refinements).reduce((acc, [_, { items, key }]) => {
            const userPrefs = worldPreferences?.[key] || [];

            const filteredItems = items.filter(item => !userPrefs.includes(item.key) && item.filterable);

            if (filteredItems.length) {
                acc[key] = { items: filteredItems, key };
            }

            return acc;
        }, {});

        // Build spoke refinements
        return constructorRefinements.reduce((acc, refinement) => {
            if (filteredUnsavedBeautyPreferences[refinement?.key]) {
                const { items, key } = filteredUnsavedBeautyPreferences[refinement.key];
                refinement.values?.forEach(({ refinementValue, refinementValueStatus }) => {
                    const refinementKey = refinementValue.split('=')[1];
                    const matchingItem = items.find(item => {
                        return item.key === refinementKey && refinementValueStatus === 2 && !excludedKeys.includes(key);
                    });

                    if (matchingItem) {
                        if (!acc[key]) {
                            acc[key] = [];
                        }

                        acc[key].push({ key: matchingItem.key, value: matchingItem.value });
                    }
                });
            }

            return acc;
        }, {});
    },
    extractSelectedFilters: function (selectedFilters) {
        let combinedFilters = [];

        for (const key in selectedFilters) {
            if (Array.isArray(selectedFilters[key])) {
                combinedFilters = [...combinedFilters, ...selectedFilters[key]];
            }
        }

        return combinedFilters;
    },
    getSelectedFiltersCount: function (refinements, selectedFilters) {
        if (!refinements || refinements?.length === 0) {
            return 0;
        }

        const extractedSelectedFilters = this.extractSelectedFilters(selectedFilters);

        return refinements
            .flatMap(refinement => refinement?.values)
            .filter(filter => extractedSelectedFilters.includes(filter?.refinementValue))
            .reduce((acc, value) => acc + (value?.count || 0), 0);
    }
};

export default CatalogUtils;
