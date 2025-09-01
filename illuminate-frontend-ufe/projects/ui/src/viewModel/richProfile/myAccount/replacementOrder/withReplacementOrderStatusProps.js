import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import ReplacementOrderActions from 'actions/ReplacementOrderActions';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(
    orderDetailsSelector,
    createStructuredSelector({
        user: userSelector
    }),
    (orderDetails, textResources) => ({
        ...textResources,
        orderDetails,
        replacementOrderId: ReplacementOrderActions.getQueryParam('replacementOrderId'),
        orderId: ReplacementOrderActions.getQueryParam('orderId'),
        error: ReplacementOrderActions.getQueryParam('error'),
        success: ReplacementOrderActions.getQueryParam('success')
    })
);
const functions = {};
const withReplacementOrderStatusProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withReplacementOrderStatusProps
};
