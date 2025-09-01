import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import ProductActions from 'actions/ProductActions';
import Actions from 'actions/Actions';
import { createSelector } from 'reselect';
import completePurchaseHistorySelector from 'selectors/completePurchaseHistory/completePurchaseHistorySelector';
import { showPurchasedFlagOnGridPagesSelector } from 'viewModel/selectors/testTarget/showPurchasedFlagOnGridPagesSelector';
import { showStarRatingOnCatalogSelector } from 'viewModel/selectors/testTarget/showStarRatingOnCatalogSelector';

const { wrapHOC } = FrameworkUtils;
const { showSimilarProductsModal } = Actions;

const { fireProductViewableImpressionTracking, fireSponsoredProductClickTracking } = ProductActions;

const fields = createSelector(
    completePurchaseHistorySelector,
    showPurchasedFlagOnGridPagesSelector,
    showStarRatingOnCatalogSelector,
    (completePurchaseHistory, showPurchasedFlagOnGridPages, showStarRatingOnCatalog) => {
        return {
            completePurchaseHistory,
            showPurchasedFlagOnGridPages,
            showStarRatingOnCatalog
        };
    }
);

const functions = {
    fireProductViewableImpressionTracking,
    fireSponsoredProductClickTracking,
    showSimilarProductsModal
};

const withProductTileProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withProductTileProps
};
