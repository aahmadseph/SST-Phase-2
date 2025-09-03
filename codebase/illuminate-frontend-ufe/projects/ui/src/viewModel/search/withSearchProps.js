import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';

import SearchSelector from 'selectors/page/search/searchSelector';
import historyLocationSelector from 'selectors/historyLocation/historyLocationSelector';

import catalogActions from 'actions/CatalogActions';
import searchActions from 'actions/SearchActions';
import userActions from 'actions/UserActions';
import { showDynamicStickyFilterSelector } from 'viewModel/selectors/testTarget/showDynamicStickyFilterSelector';
import { showNthCategoryChicletsInFilterSelector } from 'viewModel/selectors/testTarget/showNthCategoryChicletsInFilterSelector';
import { filterBarHiddenSelector } from 'selectors/catalog/filterBarHidden/filterBarHiddenSelector';
import localeUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { searchSelector } = SearchSelector;
const salePathRegExp = /^.*\/sale\?*$/i;
const searchPathRegExp = /^\/search*/;
const { isCanada } = localeUtils;

const fields = createSelector(
    searchSelector,
    historyLocationSelector,
    showDynamicStickyFilterSelector,
    showNthCategoryChicletsInFilterSelector,
    filterBarHiddenSelector,
    (catalog, { path, queryParams, prevPath }, showDynamicStickyFilter, showNthCategoryChicletsInFilter, filterBarHidden) => {
        let isSearchPage = path && path.match(searchPathRegExp) != null;
        const isSalePage = path && path.match(salePathRegExp) != null;
        const isCAUnreleasedPlacementsVisible = Sephora.configurationSettings?.isCAUnreleasedPlacementsVisible;
        const showMidPageBanner = isCanada() ? isCAUnreleasedPlacementsVisible : true;

        if (!isSearchPage && !isSalePage && prevPath && prevPath.match(searchPathRegExp)) {
            isSearchPage = true;
        }

        return {
            catalog,
            isSalePage,
            isSearchPage,
            queryParams,
            showMidPageBanner,
            showDynamicStickyFilter,
            showNthCategoryChicletsInFilter,
            filterBarHidden
        };
    }
);

const functions = {
    applyFilters: catalogActions.applyFilters,
    onStoreChangedFromHeader: userActions.onStoreChangedFromHeader,
    onZipCodeChangedFromHeader: userActions.onZipCodeChangedFromHeader,
    refreshSearchResults: searchActions.refreshSearchResults,
    dispatchMarketingParams: catalogActions.dispatchMarketingParams,
    setFilterBarVisibility: catalogActions.setFilterBarVisibility
};

const withSearchProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withSearchProps
};
