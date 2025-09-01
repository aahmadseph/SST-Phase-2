import { connect } from 'react-redux';
import SpaUtils from 'utils/Spa';
import catalogActions from 'actions/CatalogActions';
import UserActions from 'actions/UserActions';
import FrameworkUtils from 'utils/framework';
import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import SponsoredProductsSelector from 'selectors/sponsoredProducts/sponsoredProductsSelector';
import history from 'selectors/historyLocation/historyLocationSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { PAGE_ONE } from 'utils/CatalogConstants';
import rmnUtils from 'utils/rmn';
import { showPurchasedFlagOnGridPagesSelector } from 'viewModel/selectors/testTarget/showPurchasedFlagOnGridPagesSelector';
import { showUpdateDefaultSortSelector } from 'viewModel/selectors/testTarget/showUpdateDefaultSortSelector';
import { showAIBeautyChatSelector } from 'ai/selectors/testTarget/showAIBeautyChatSelector';
import { isAIBeautyChatEnabledPLP, isAIBeautyChatEnabledSRP, isAIBeautyGiftEnabled } from 'ai/utils/aiBeautyChat';

const { wrapHOC } = FrameworkUtils;
const { sponsoredProductsSelector } = SponsoredProductsSelector;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const { formatSponsoredProductsClickTracker } = rmnUtils;
import { isShowSMNEnabledSelector } from 'viewModel/selectors/testTarget/showSMNSelector';

const getText = getLocaleResourceFile('components/Catalog/locales', 'Catalog');

const fields = createSelector(
    pageSelector,
    sponsoredProductsSelector,
    history,
    showPurchasedFlagOnGridPagesSelector,
    showUpdateDefaultSortSelector,
    showAIBeautyChatSelector,
    isShowSMNEnabledSelector,
    (_state, ownProps) => ownProps.pageType,
    (_state, ownProps) => ownProps.categoryId,
    (
        page,
        sponsorProducts,
        historyLocation,
        showPurchasedFlagOnGridPages,
        showUpdateDefaultSort,
        showAIBeautyChat,
        showSMNEnabled,
        pageType,
        categoryId
    ) => {
        const { pageName } = SpaUtils.getSpaTemplateInfoByTemplate(page.templateInformation?.template) || {};
        const catalog = page[pageName];
        const totalProducts = catalog?.totalProducts || 0;
        const queryParams = Object.assign({}, historyLocation.queryParams);
        const pageParamURL = Number(queryParams?.currentPage?.[0]) || undefined;
        const currentPage = catalog?.currentPage || pageParamURL || 1;
        const pageSize = catalog?.pageSize || 60;
        const categoryName = catalog.displayName;
        const parentCategoryName = catalog.parentCategory?.displayName;
        let currentTotal = currentPage * pageSize;

        if (currentTotal > totalProducts) {
            currentTotal = totalProducts;
        }

        const dontShowMoreProducts = currentTotal === totalProducts;
        const resultsText = `${totalProducts} ${getText(totalProducts === 1 ? 'result' : 'results')}`;
        const currentTotalText = `${PAGE_ONE}-${currentTotal} ${getText('of')} ${resultsText}`;
        const rootCategory = catalog?.categories?.at()?.categoryId;
        const isGenAIChatPLPEnabled =
            showAIBeautyChat &&
            (isAIBeautyChatEnabledSRP(pageType) || isAIBeautyChatEnabledPLP(categoryId) || isAIBeautyChatEnabledPLP(rootCategory));

        let giftFinder = false;

        if (Sephora.configurationSettings.isGenAIGiftFinderEnabled) {
            giftFinder = isAIBeautyGiftEnabled(categoryId) || isAIBeautyGiftEnabled(rootCategory);
        }

        return {
            pageName,
            currentPage,
            products: catalog?.products?.map(product => {
                if (Sephora.configurationSettings.smnBrowseCombinedCallEnabled) {
                    return product;
                } else {
                    return formatSponsoredProductsClickTracker(product);
                }
            }),
            marketingTiles: catalog?.content?.marketingTiles || catalog?.specialSearchTermComponents || catalog?.marketingTiles,
            marketingTilePositions: catalog?.content?.marketingTilePositions,
            searchWarningMessages: catalog?.searchWarningMessages,
            searchQuery: catalog?.keyword,
            deliveryOptions: catalog?.deliveryOptions,
            sponsorProducts: showSMNEnabled && sponsorProducts?.products,
            sponsorProductsLoaded: sponsorProducts?.loaded,
            resultsText,
            dontShowMoreProducts,
            currentTotalText,
            categoryName,
            parentCategoryName,
            showPurchasedFlagOnGridPages,
            showUpdateDefaultSort,
            isGenAIChatPLPEnabled,
            giftFinder
        };
    }
);

const functions = {
    setPageNumber: catalogActions.setPageNumber,
    fetchCompletePurchaseHistory: UserActions.fetchCompletePurchaseHistory
};

const withProductGridProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withProductGridProps
};
