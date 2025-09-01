import localeUtils from 'utils/LanguageLocale';
import { REFINEMENT_TYPES, REFINEMENT_STATES } from 'utils/CatalogConstants';
import Empty from 'constants/empty';

const getText = localeUtils.getLocaleResourceFile('utils/locales/Filters', 'HappeningFilters');

const FILTERS_KEY = {
    CATEGORY: getText('category'),
    LOCATION_AND_STORES: getText('locationAndStores'),
    DATE: getText('date'),
    SORT: getText('sort')
};

const dateRefinements = {
    displayName: getText('date'),
    type: 'radios',
    subType: 'radios_custom',
    isExpanded: true,
    values: [
        {
            isDefault: true,
            refinementValue: 'byDate=2M',
            refinementValueDisplayName: getText('next2Month')
        },
        {
            refinementValue: 'byDate=1M',
            refinementValueDisplayName: getText('nextMonth')
        },
        {
            refinementValue: 'byDate=2W',
            refinementValueDisplayName: getText('next2Weeks')
        },
        {
            refinementValue: 'byDate=1W',
            refinementValueDisplayName: getText('next7Days')
        }
    ]
};

const sortRefinements = {
    displayName: getText('sort'),
    type: 'sort',
    subType: 'radios_custom',
    values: [
        {
            isDefault: true,
            refinementValue: 'sortBy=closest',
            refinementValueDisplayName: getText('closestDistance')
        },
        {
            refinementValue: 'sortBy=soonest',
            refinementValueDisplayName: getText('soonestDate')
        }
    ]
};

const defaultFilters = {
    [FILTERS_KEY.DATE]: ['byDate=2M'],
    [FILTERS_KEY.SORT]: ['sortBy=closest'],
    [FILTERS_KEY.LOCATION_AND_STORES]: [],
    [FILTERS_KEY.CATEGORY]: []
};

const emptyFilters = {
    [FILTERS_KEY.DATE]: [],
    [FILTERS_KEY.SORT]: [],
    [FILTERS_KEY.LOCATION_AND_STORES]: [],
    [FILTERS_KEY.CATEGORY]: []
};

const sortOptions = [
    { children: getText('closestDistance'), isActive: true },
    { children: getText('soonestDate'), isActive: false }
];

const getCategoryRefinements = (refinements = Empty.Array) => {
    return {
        displayName: getText('category'),
        type: 'checkboxes',
        withSearch: false,
        isExpanded: true,
        withoutAtoZ: true,
        filterLimit: 5,
        values: (refinements[0]?.values || Empty.Array).map(item => ({
            refinementValue: item.refinementValue,
            refinementValueDisplayName: item.refinementValueDisplayName,
            count: item.count,
            refinementValueStatus: item.count === 0 ? REFINEMENT_STATES.IMPLICIT : REFINEMENT_STATES.INACTIVE
        }))
    };
};

const getLocationRefinements = (storeList, storeZipCode, subTitleHandler) => {
    return {
        displayName: getText('locationAndStores'),
        subTitle: storeZipCode,
        subTitleHandler,
        pillHandler: subTitleHandler,
        showMoreHandler: subTitleHandler,
        isExpanded: true,
        type: 'checkboxes',
        subType: 'checkboxes_custom',
        withSearch: false,
        withoutAtoZ: true,
        filterLimit: 5,
        values: storeList.map(item => {
            return {
                refinementValue: item.storeId,
                refinementValueDisplayName: item.displayName
            };
        })
    };
};

const getFiltersQueryString = filters => {
    const stores = filters[FILTERS_KEY.LOCATION_AND_STORES].join(',');
    const categories = filters[FILTERS_KEY.CATEGORY].join(',');

    const storeQueryString = stores ? `storeIds=${stores}` : '';
    const categoryQueryString = categories ? `categoryIds=${categories}` : '';

    return [...filters[FILTERS_KEY.DATE], ...filters[FILTERS_KEY.SORT], storeQueryString, categoryQueryString].filter(Boolean).join('&');
};

const clearFiltersGroupByKey = (currentSelectedFilters, filterKey) => {
    const newSelectedFilters = { ...currentSelectedFilters };
    newSelectedFilters[filterKey] = [];

    return newSelectedFilters;
};

const getAppliedFilterGroupByKey = (appliedFilters, filterKeys) => {
    const filterGroups = {};

    filterKeys.forEach(key => {
        if (appliedFilters[key]) {
            filterGroups[key] = appliedFilters[key];
        }
    });

    return filterGroups;
};

const getAppliedSortOptionName = (appliedFilters, refinements) => {
    const appliedSortOption = appliedFilters[FILTERS_KEY.SORT][0];
    const defaultValue = refinements.values.find(item => item.isDefault).refinementValue;
    const optionValue = appliedSortOption || defaultValue;

    return refinements.values.find(item => item.refinementValue === optionValue).refinementValueDisplayName;
};

const resetSelection = (currentSelectedFilters, resetSortToDefault) => {
    const sortName = getText('sort');
    const dateName = getText('date');
    const newSelectedFilters = { ...currentSelectedFilters };
    Object.keys(newSelectedFilters).forEach(filterKey => {
        newSelectedFilters[filterKey] =
            (filterKey === sortName || filterKey === dateName) && !resetSortToDefault ? currentSelectedFilters[filterKey] : [];
    });

    return newSelectedFilters;
};

const getSelectedOrDefaultSortOptionValue = (refinementValues, selectedValue) => {
    return selectedValue || refinementValues.find(item => item.isDefault).refinementValue;
};

const getSelectedOrDefaultRefinement = (refinements, key, selectedValue) => {
    const values = refinements.find(x => x.displayName === key)?.values;

    return values.find(x => x.refinementValue === selectedValue) || values.find(x => x.isDefault);
};

const getIsValueCheckboxOrNonDefault = (selectedValue, refinement) => {
    if (refinement?.subType !== REFINEMENT_TYPES.RADIOS_CUSTOM) {
        return true;
    }

    let isCustomNonDefault = true;

    refinement.values.forEach(x => {
        if (x.refinementValue === selectedValue[0] && x.isDefault) {
            isCustomNonDefault = false;
        }
    });

    return isCustomNonDefault;
};

export default {
    sortRefinements,
    dateRefinements,
    defaultFilters,
    emptyFilters,
    sortOptions,
    getLocationRefinements,
    getCategoryRefinements,
    getFiltersQueryString,
    clearFiltersGroupByKey,
    getAppliedFilterGroupByKey,
    getAppliedSortOptionName,
    resetSelection,
    getSelectedOrDefaultSortOptionValue,
    getSelectedOrDefaultRefinement,
    getIsValueCheckboxOrNonDefault,
    FILTERS_KEY
};
