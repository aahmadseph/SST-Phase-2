import { createSelector } from 'reselect';
import { fulfillmentOptionsSelector } from 'selectors/page/product/fulfillmentOptions/fulfillmentOptionsSelector';
import Empty from 'constants/empty';

const deliveryOptionsSelector = createSelector(fulfillmentOptionsSelector, fulfillmentOptions => fulfillmentOptions.deliveryOptions || Empty.Object);

export { deliveryOptionsSelector };
