import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import { DELIVERY_METHOD_TYPES } from 'constants/RwdBasket';

import { rewardFulfillmentSelector } from 'selectors/rewardFulfillment/rewardFulfillmentSelector';
import BasketUserDataSelector from 'selectors/page/rwdBasket/basketUserDataSelector';
const { basketUserDataSelector } = BasketUserDataSelector;
import { basketSelector } from 'selectors/basket';

import RewardFulfillmentActions from 'actions/RewardFulfillmentActions';
import AddToBasketActions from 'actions/AddToBasketActions';
import RewardFulfillmentMethodModalBindings from 'analytics/bindingMethods/components/globalModals/rewardFulfillmentMethodModal/RewardFulfillmentMethodModalBindings';

const fields = createSelector(rewardFulfillmentSelector, basketUserDataSelector, basketSelector, (rewardFulfillment, user, basket) => {
    return {
        isRewardFulfillmentVariant: true,
        isFromRewardsModal: true,
        isOpen: rewardFulfillment.showRewardFulfillmentMethodModal,
        item: rewardFulfillment.currentReward,
        preferredStoreInfo: user.preferredStoreInfo,
        preferredZipCode: user.preferredZipCode,
        itemDeliveryMethod: DELIVERY_METHOD_TYPES.STANDARD,
        basket
    };
});

const functions = {
    closeChangeMethodModal: () => RewardFulfillmentActions.showRewardFulfillmentMethodModal(false),
    addRewardToBasket: AddToBasketActions.addToBasket,
    pageLoadAnalytics: RewardFulfillmentMethodModalBindings.pageLoad,
    confirmAnalytics: RewardFulfillmentMethodModalBindings.confirmMethodModal
};

const withRewardFulfillmentMethodModalProps = wrapHOC(connect(fields, functions));

export {
    fields, withRewardFulfillmentMethodModalProps
};
