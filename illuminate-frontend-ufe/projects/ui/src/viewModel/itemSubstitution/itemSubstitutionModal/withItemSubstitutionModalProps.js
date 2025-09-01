import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { itemSubstitutionSelector } from 'selectors/itemSubstitution/itemSubstitutionSelector';
import basketSelector from 'selectors/basket/basketSelector';

import Actions from 'actions/Actions';
import ItemSubstitutionActions from 'actions/ItemSubstitutionActions';
import ItemSubstitutionModalBindings from 'analytics/bindingMethods/components/globalModals/itemSubstitutionModal/ItemSubstitutionModalBindings';

import { ITEM_SUBSTITUTION_BASKET_MAP } from 'constants/ItemSubstitution';
import itemSubstitutionUtils from 'utils/ItemSubstitution';
const { findBasketTypeByCommerceId } = itemSubstitutionUtils;
import LanguageLocale from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/ItemSubstitution/ItemSubstitutionModal/locales', 'ItemSubstitutionModal');

const localizationSelector = createStructuredSelector({
    confirm: getTextFromResource(getText, 'confirm'),
    outOfStock: getTextFromResource(getText, 'outOfStock')
});

const fields = createSelector(
    itemSubstitutionSelector,
    basketSelector,
    localizationSelector,
    (_state, ownProps) => ownProps.item,
    (itemSubstitution, basket, localization, item) => {
        const {
            selectedProductId, recoProducts, isLoadingProductRecs, errorMessage, addItemErrorMessage
        } = itemSubstitution;
        const selectedProduct = recoProducts.find(product => product.productId === selectedProductId) || {};
        const isOutOfStock = selectedProduct.currentSku?.isOutOfStock || selectedProduct.productPage?.currentSku?.isOutOfStock;
        const okBtnDisabled = !selectedProductId || isOutOfStock;
        const okBtnText = isOutOfStock ? localization.outOfStock : localization.confirm;
        const selectedSkuId = selectedProduct.currentSku?.skuId;
        const basketType = findBasketTypeByCommerceId(item.commerceId, basket);
        const fulfillmentType = ITEM_SUBSTITUTION_BASKET_MAP[basketType];

        return {
            recoProducts,
            selectedProductId,
            okBtnDisabled,
            okBtnText,
            isLoadingProductRecs,
            selectedSkuId,
            fulfillmentType,
            errorMessage,
            addItemErrorMessage,
            basket
        };
    }
);

const functions = dispatch => ({
    onDismiss: () => {
        dispatch(Actions.showItemSubstitutionModal({ isOpen: false }));
        dispatch(ItemSubstitutionActions.resetModal());
    },
    addOrRemoveSubstituteItem: (...args) => dispatch(ItemSubstitutionActions.addOrRemoveSubstituteItem(...args)),
    pageLoadAnalytics: ItemSubstitutionModalBindings.pageLoad,
    confirmSubstituteItemsAnalytics: ItemSubstitutionModalBindings.confirmSubstituteItems,
    closeModalTracking: ItemSubstitutionModalBindings.closeModalTracking
});

const withItemSubstitutionModalProps = wrapHOC(connect(fields, functions));

export {
    fields, withItemSubstitutionModalProps
};
