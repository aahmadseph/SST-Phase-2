import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { itemSubstitutionSelector } from 'selectors/itemSubstitution/itemSubstitutionSelector';
import preferredStoreSelector from 'selectors/user/preferredStoreSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
const { preferredZipCodeSelector } = PreferredZipCodeSelector;

import ItemSubstitutionActions from 'actions/ItemSubstitutionActions';
import { PRODUCT_SALE_DATA } from 'constants/ItemSubstitution';
import skuUtils from 'utils/Sku';
import ItemSubstitutionModalBindings from 'analytics/bindingMethods/components/globalModals/itemSubstitutionModal/ItemSubstitutionModalBindings';

const fields = createSelector(
    (_state, ownProps) => ownProps.productRec,
    itemSubstitutionSelector,
    preferredStoreSelector,
    preferredZipCodeSelector,
    (productRec, itemSubstitution, preferredStore, preferredZipCode) => {
        const availableOptionsCount = productRec?.moreColors || 1;
        const isSelected = itemSubstitution?.selectedProductId === productRec.productId;
        const showAvailableOptionsButton = !isSelected;
        const showFooter = productRec.isMultiSku;
        const isLoading = isSelected && showFooter && !productRec?.productPage;
        const hasVariation = Boolean(
            productRec.currentSku.variationValue &&
                productRec.currentSku.variationType &&
                productRec.currentSku.variationType !== skuUtils.skuVariationType.NONE
        );
        const isPartialSaleData = productRec?.onSaleData === PRODUCT_SALE_DATA.PARTIAL;
        const showSize = productRec?.currentSku?.size && productRec?.currentSku?.variationType !== skuUtils.skuVariationType.SIZE;
        const storeId = preferredStore.preferredStoreInfo?.storeId;
        const zipCode = preferredZipCode;

        return {
            availableOptionsCount,
            showAvailableOptionsButton,
            showFooter,
            isSelected,
            isLoading,
            hasVariation,
            isPartialSaleData,
            showSize,
            storeId,
            zipCode
        };
    }
);

const functions = {
    selectProductRec: ItemSubstitutionActions.selectProductRec,
    updateCurrentSku: ItemSubstitutionActions.updateCurrentSku,
    availableOptionsAnalytics: ItemSubstitutionModalBindings.availableOptionsLoad
};

const withItemSubstitutionRecommendationProps = wrapHOC(connect(fields, functions));

export {
    fields, withItemSubstitutionRecommendationProps
};
