import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import itemSubstitutionUtils from 'utils/ItemSubstitution';
const { findBasketTypeByCommerceId } = itemSubstitutionUtils;
import * as RwdBasketConst from 'constants/RwdBasket';
import { ITEM_SUBSTITUTION_BASKET_MAP } from 'constants/ItemSubstitution';

import basketSelector from 'selectors/basket/basketSelector';
import preferredStoreSelector from 'selectors/user/preferredStoreSelector';
import { itemSubstitutionSelector } from 'selectors/itemSubstitution/itemSubstitutionSelector';
import { showItemSubstitutionSelector } from 'viewModel/selectors/testTarget/showItemSubstitutionSelector';

import ItemSubstitutionActions from 'actions/ItemSubstitutionActions';
import ItemSubstitutionModalBindings from 'analytics/bindingMethods/components/globalModals/itemSubstitutionModal/ItemSubstitutionModalBindings';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
const { preferredZipCodeSelector } = PreferredZipCodeSelector;

const {
    BASKET_TYPES: { BOPIS_BASKET, SAMEDAY_BASKET }
} = RwdBasketConst;

const fields = createSelector(
    basketSelector,
    preferredStoreSelector,
    preferredZipCodeSelector,
    itemSubstitutionSelector,
    (_state, ownProps) => ownProps.item,
    showItemSubstitutionSelector,
    (basket, preferredStore, preferredZipCode, itemSubstitution, item, showItemSubstitution) => {
        const basketType = findBasketTypeByCommerceId(item.commerceId, basket);
        const shouldRenderItemSubstitution =
            showItemSubstitution && (basketType === SAMEDAY_BASKET || basketType === BOPIS_BASKET) && item.itemEligibleForSubstitute;
        const storeId = preferredStore?.preferredStoreInfo?.storeId;
        const fulfillmentType = ITEM_SUBSTITUTION_BASKET_MAP[basketType];
        const doNotSubstitute = !item.substituteSku;
        const { removeItemErrorMessage } = itemSubstitution;

        return {
            shouldRenderItemSubstitution,
            storeId,
            fulfillmentType,
            preferredZipCode,
            doNotSubstitute,
            removeItemErrorMessage
        };
    }
);

const functions = {
    getProductRecs: ItemSubstitutionActions.getProductRecs,
    addOrRemoveSubstituteItem: ItemSubstitutionActions.addOrRemoveSubstituteItem,
    showContentModal: Actions.showContentModal,
    editSubstituteItemAnalytics: ItemSubstitutionModalBindings.editSubstituteItem,
    removeSubstituteItemAnalytics: ItemSubstitutionModalBindings.removeSubstituteItem
};

const withItemSubstitutionRootProps = wrapHOC(connect(fields, functions));

export {
    fields, withItemSubstitutionRootProps
};
