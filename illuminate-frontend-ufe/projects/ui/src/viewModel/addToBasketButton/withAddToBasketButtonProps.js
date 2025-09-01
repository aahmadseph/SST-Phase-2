import { createStructuredSelector, createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import {
    basketItemsSelector,
    basketPendingBasketSkusSelector,
    basketItemCountSelector,
    basketPickupBasketItemsSelector,
    isFromBazaarSelector,
    isFromChooseOptionsModalSelector,
    isBIPointsAvailableSelector,
    basketSelector
} from 'selectors/basket';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import { userSelector } from 'selectors/user/userSelector';
import preferredStoreSelector from 'selectors/user/preferredStoreSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { rewardFulfillmentConfigurationSelector } from 'viewModel/selectors/basket/rewardFulfillmentConfiguration/rewardFulfillmentConfigurationSelector';
import { isOmniRewardEnabledSelector } from 'viewModel/selectors/basket/isOmniRewardEnabled/isOmniRewardEnabledSelector';
import actions from 'actions/Actions';
import addToBasketActions from 'actions/AddToBasketActions';
import promoActions from 'actions/PromoActions';
import ReplacementOrderActions from 'actions/ReplacementOrderActions';
import RewardFulfillmentActions from 'actions/RewardFulfillmentActions';
import chooseOptionsActions from 'actions/ChooseOptionsActions';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    (_state, ownProps) => ownProps.basketType,
    createStructuredSelector({
        basketItems: basketItemsSelector,
        pendingBasketSkus: basketPendingBasketSkusSelector,
        itemCount: basketItemCountSelector,
        pickupBasketItems: basketPickupBasketItemsSelector,
        preferredStore: preferredStoreSelector,
        isTestTargetReady: isTestTargetReadySelector,
        isBIPointsAvailable: isBIPointsAvailableSelector,
        fromBazaar: isFromBazaarSelector,
        fromChooseOptionsModal: isFromChooseOptionsModalSelector,
        itemsByBasket: itemsByBasketSelector,
        rewardFulfillmentConfiguration: rewardFulfillmentConfigurationSelector,
        user: userSelector,
        isOmniRewardEnabled: isOmniRewardEnabledSelector,
        basket: basketSelector
    }),
    (basketType, restProps) => {
        return {
            basketType: basketType || null,
            ...restProps
        };
    }
);

const functions = {
    setBasketType: addToBasketActions.setBasketType,
    addToBasket: addToBasketActions.addToBasket,
    showAddToBasketModal: actions.showAddToBasketModal,
    showRougeRewardCardModal: actions.showRougeRewardCardModal,
    updateMsgPromo: promoActions.updateMsgPromo,
    addMultipleSkusToBasket: addToBasketActions.addMultipleSkusToBasket,
    clearPendingProductList: addToBasketActions.clearPendingProductList,
    addRemoveSample: ReplacementOrderActions.addRemoveSample,
    showRewardFulfillmentMethodModal: RewardFulfillmentActions.showRewardFulfillmentMethodModal,
    showChooseOptionsModal: chooseOptionsActions.showChooseOptionsModal
};

const withAddToBasketButtonProps = wrapHOC(connect(fields, functions));

export {
    withAddToBasketButtonProps, fields, functions
};
