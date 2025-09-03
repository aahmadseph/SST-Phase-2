import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import catalogActions from 'actions/CatalogActions';
import categoryActions from 'actions/CategoryActions';
import { nthCategorySelector } from 'selectors/page/nthCategory/nthCategorySelector';
import { userSelector } from 'selectors/user/userSelector';
import { isStoreIdAndZipCodeReadySelector } from 'viewModel/selectors/user/isStoreIdAndZipCodeReadySelector';
import userActions from 'actions/UserActions';
import sponsorProductsActions from 'actions/SponsorProductsActions';
import BeautyPreferencesWorldActions from 'actions/BeautyPreferencesWorldActions';
import SponsoredProductsSelector from 'selectors/sponsoredProducts/sponsoredProductsSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import basketSelector from 'selectors/basket/basketSelector';
import basketUtils from 'utils/Basket';
import { cmsRMNBannerSelector } from 'selectors/rmnBanners';
import { showUpdateDefaultSortSelector } from 'viewModel/selectors/testTarget/showUpdateDefaultSortSelector';
import { showDynamicStickyFilterSelector } from 'viewModel/selectors/testTarget/showDynamicStickyFilterSelector';
import { showNthCategoryChicletsInFilterSelector } from 'viewModel/selectors/testTarget/showNthCategoryChicletsInFilterSelector';
import { filterBarHiddenSelector } from 'selectors/catalog/filterBarHidden/filterBarHiddenSelector';
import localeUtils from 'utils/LanguageLocale';
import { customerPreferenceSelector } from 'selectors/user/customerPreferenceSelector';

const { sponsoredProductsSelector } = SponsoredProductsSelector;
const { updateCustomerPreference } = BeautyPreferencesWorldActions;
const { isCanada } = localeUtils;

export default connect(
    createSelector(
        nthCategorySelector,
        isStoreIdAndZipCodeReadySelector,
        sponsoredProductsSelector,
        isAnonymousSelector,
        basketSelector,
        userSelector,
        cmsRMNBannerSelector,
        showUpdateDefaultSortSelector,
        showDynamicStickyFilterSelector,
        showNthCategoryChicletsInFilterSelector,
        filterBarHiddenSelector,
        customerPreferenceSelector,
        (
            catalog,
            isStoreIdAndZipCodeReady,
            sponsoredProducts,
            isAnonymous,
            basket,
            user,
            cmsRMNBanner,
            showUpdateDefaultSort,
            showDynamicStickyFilter,
            showNthCategoryChicletsInFilter,
            filterBarHidden,
            customerPreference
        ) => {
            const plaEnabled = Sephora.configurationSettings.RMNEnablePLA && !Sephora.Util.firstSpaDataLoaded;
            const totalBasketCount = basketUtils.getTotalCount(basket);
            const isCAUnreleasedPlacementsVisible = Sephora.configurationSettings?.isCAUnreleasedPlacementsVisible;
            const showMidPageBanner = isCanada() ? isCAUnreleasedPlacementsVisible : true;
            const bannerData = cmsRMNBanner;

            let isPaginationFirstPage = false;

            if (!Sephora.isNodeRender) {
                if (digitalData.lastRefresh !== 'soft' && !new URLSearchParams(global.window.location.search).get('currentPage')) {
                    isPaginationFirstPage = true;
                }
            } else {
                isPaginationFirstPage = !Object.prototype.hasOwnProperty.call(Sephora.renderQueryParams, 'cachedQueryParams');
            }

            const userInfo = {
                isAnonymous,
                profileId: user?.profileId,
                customerPreference
            };

            return {
                catalog,
                isStoreIdAndZipCodeReady,
                sponsoredProducts,
                userInfo,
                plaEnabled,
                isPaginationFirstPage,
                totalBasketCount,
                showMidPageBanner,
                bannerData,
                showUpdateDefaultSort,
                showDynamicStickyFilter,
                showNthCategoryChicletsInFilter,
                filterBarHidden,
                customerPreference
            };
        }
    ),
    {
        applyFilters: catalogActions.applyFilters,
        validateUpperFunnelParams: categoryActions.validateUpperFunnelParams,
        getFulfillmentOptions: categoryActions.getFulfillmentOptions,
        onStoreChangedFromHeader: userActions.onStoreChangedFromHeader,
        onZipCodeChangedFromHeader: userActions.onZipCodeChangedFromHeader,
        getSponsorProducts: sponsorProductsActions.getSponsorProducts,
        dispatchMarketingParams: catalogActions.dispatchMarketingParams,
        resetSponsorProducts: sponsorProductsActions.resetSponsorProducts,
        updateCustomerPreference,
        setFilterBarVisibility: catalogActions.setFilterBarVisibility
    }
);
