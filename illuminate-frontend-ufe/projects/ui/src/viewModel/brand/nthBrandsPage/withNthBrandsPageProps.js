import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import NthBrandSelector from 'selectors/page/nthBrand/nthBrandSelector';
import { isStoreIdAndZipCodeReadySelector } from 'viewModel/selectors/user/isStoreIdAndZipCodeReadySelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import catalogActions from 'actions/CatalogActions';
import categoryActions from 'actions/CategoryActions';
import userActions from 'actions/UserActions';
import { showUpdateDefaultSortSelector } from 'viewModel/selectors/testTarget/showUpdateDefaultSortSelector';
import { showDynamicStickyFilterSelector } from 'viewModel/selectors/testTarget/showDynamicStickyFilterSelector';
import { showNthCategoryChicletsInFilterSelector } from 'viewModel/selectors/testTarget/showNthCategoryChicletsInFilterSelector';
import { filterBarHiddenSelector } from 'selectors/catalog/filterBarHidden/filterBarHiddenSelector';

const { nthBrandSelector } = NthBrandSelector;

export default connect(
    createStructuredSelector({
        catalog: nthBrandSelector,
        isStoreIdAndZipCodeReady: isStoreIdAndZipCodeReadySelector,
        isAnonymous: isAnonymousSelector,
        showUpdateDefaultSort: showUpdateDefaultSortSelector,
        showDynamicStickyFilter: showDynamicStickyFilterSelector,
        filterBarHidden: filterBarHiddenSelector,
        showNthCategoryChicletsInFilter: showNthCategoryChicletsInFilterSelector
    }),
    {
        applyFilters: catalogActions.applyFilters,
        validateUpperFunnelParams: categoryActions.validateUpperFunnelParams,
        getFulfillmentOptions: categoryActions.getFulfillmentOptions,
        onStoreChangedFromHeader: userActions.onStoreChangedFromHeader,
        onZipCodeChangedFromHeader: userActions.onZipCodeChangedFromHeader,
        dispatchMarketingParams: catalogActions.dispatchMarketingParams,
        setFilterBarVisibility: catalogActions.setFilterBarVisibility
    }
);
