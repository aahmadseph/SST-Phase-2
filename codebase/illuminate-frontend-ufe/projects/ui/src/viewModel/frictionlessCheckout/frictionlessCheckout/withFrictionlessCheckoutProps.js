import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';

import Actions from 'Actions';

import { orderSelector } from 'selectors/order/orderSelector';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import pazeSelector from 'selectors/paze/pazeSelector';
import afterpaySelector from 'selectors/afterpay/afterpaySelector';
import { checkoutPageSelector } from 'selectors/page/checkout/checkoutPageSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import historyLocationSelector from 'selectors/historyLocation/historyLocationSelector';

import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;

const fields = createSelector(
    orderSelector,
    klarnaSelector,
    pazeSelector,
    afterpaySelector,
    checkoutPageSelector,
    userSubscriptionsSelector,
    (_state, ownProps) => ownProps.isBopis,
    historyLocationSelector,
    (order, klarna, paze, afterpay, checkoutPage, userSubscriptions, isBopis, historyLocation) => {
        const orderShippingMethods = order.orderShippingMethods || Empty.Array;
        const addressList = order.addressList || Empty.Array;
        const isApplePayFlow = order.isApplePayFlow || false;
        const bankRewardsValidPaymentsMessage = order.bankRewardsValidPaymentsMessage || Empty.Object;
        const paymentOptions = order.paymentOptions || Empty.Object;

        const isKlarnaSelected = klarna.isSelected || false;
        const isAfterpaySelected = afterpay.isSelected || false;
        const isPazeSelected = paze.isSelected || false;
        const currentPath = historyLocation.path;

        return {
            order,
            orderShippingMethods,
            addressList,
            isApplePayFlow,
            bankRewardsValidPaymentsMessage,
            paymentOptions,
            klarna,
            paze,
            afterpay,
            checkoutPage,
            userSubscriptions,
            isBopis,
            isKlarnaSelected,
            isAfterpaySelected,
            isPazeSelected,
            currentPath
        };
    }
);

const functions = {
    showMediaModal: Actions.showMediaModal,
    showContentModal: Actions.showContentModal
};

const withFrictionlessCheckoutProps = wrapHOC(connect(fields, functions));

export {
    withFrictionlessCheckoutProps, fields, functions
};
