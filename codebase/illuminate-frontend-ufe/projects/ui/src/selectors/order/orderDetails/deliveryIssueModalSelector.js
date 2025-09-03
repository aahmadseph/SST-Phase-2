import { createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import Empty from 'constants/empty';

const deliveryIssueModalSelector = createSelector(orderDetailsSelector, orderDetails => ({
    deliveryIssues: orderDetails.deliveryIssues || Empty.Array,
    selectedDeliveryIssue: orderDetails.selectedDeliveryIssue || Empty.Object,
    deliveryIssueModalScreen: orderDetails.deliveryIssueModalScreen || Empty.String,
    returnEligibility: orderDetails.returnEligibility || Empty.Object,
    isDeliveryIssueError: orderDetails.isDeliveryIssueError || Empty.Boolean
}));

export default { deliveryIssueModalSelector };
