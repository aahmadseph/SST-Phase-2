import OrderActions from 'actions/OrderActions';
import checkoutApi from 'services/api/checkout';
import store from 'store/Store';
import ErrorsUtils from 'utils/Errors';
import Location from 'utils/Location';
import InflatorComps from 'utils/framework/InflateComponents';
import framework from 'utils/framework';
import {
    EventType, OrderInfo, OrderInfoLoaded, UserInfoLoaded
} from 'constants/events';
import UtilActions from 'utils/redux/Actions';

const { Application } = framework;

export default (function () {
    /* User Info Service */
    Application.events.onLastLoadEvent(window, [OrderInfoLoaded, UserInfoLoaded], () => {
        function getShippingMethods(orderId, shippingGroupId) {
            return checkoutApi
                .getAvailableShippingMethods(orderId, shippingGroupId)
                .then(shippingData => store.dispatch(OrderActions.updateShippingMethods(shippingData.shippingMethods, shippingGroupId)))
                .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData));
        }

        const orderInfo = InflatorComps.services.OrderInfo;
        const orderInfoData = orderInfo.data;
        let physicalGiftCardShippingGroup;
        let hardGoodShippingGroup;
        let sameDayShippingGroup;
        const isPlayOrder = orderInfoData.header.isPlaySubscriptionOrder;
        orderInfoData.isInitialized = true;

        (orderInfoData.shippingGroups.shippingGroupsEntries || []).forEach(shipGroupsEntry => {
            if (shipGroupsEntry.shippingGroupType === 'HardGoodShippingGroup') {
                hardGoodShippingGroup = shipGroupsEntry.shippingGroup;
            }

            if (shipGroupsEntry.shippingGroupType === 'GiftCardShippingGroup') {
                physicalGiftCardShippingGroup = shipGroupsEntry.shippingGroup;
            }

            if (shipGroupsEntry.shippingGroupType === 'SameDayShippingGroup') {
                sameDayShippingGroup = shipGroupsEntry.shippingGroup;
            }
        });
        const orderId = orderInfoData.header.orderId;
        const promises = [];

        if (hardGoodShippingGroup && !isPlayOrder && !Location.isOrderConfirmationPage()) {
            promises.push(getShippingMethods(orderId, hardGoodShippingGroup.shippingGroupId));
        }

        if (physicalGiftCardShippingGroup && !Location.isOrderConfirmationPage()) {
            promises.push(getShippingMethods(orderId, physicalGiftCardShippingGroup.shippingGroupId));
        }

        if (sameDayShippingGroup && !Location.isOrderConfirmationPage()) {
            promises.push(getShippingMethods(orderId, sameDayShippingGroup.shippingGroupId));
        }

        if (Location.isCheckout() && !Location.isOrderConfirmationPage()) {
            const paymentOptionsPromise = checkoutApi
                .getCreditCards(orderId)
                .then(payments => store.dispatch(UtilActions.merge('order', 'paymentOptions', payments)))
                .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData));
            promises.push(paymentOptionsPromise);
        }

        Promise.all(promises).then(() => {
            store.dispatch(OrderActions.updateOrder(orderInfoData));
            Application.events.dispatchServiceEvent(OrderInfo, EventType.Ready);
            Application.events.dispatchServiceEvent(OrderInfo, EventType.ServiceCtrlrsApplied, true);
        });
    });

    return null;
}());
