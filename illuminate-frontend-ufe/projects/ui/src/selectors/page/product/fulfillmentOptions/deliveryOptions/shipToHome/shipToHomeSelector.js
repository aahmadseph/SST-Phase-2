import { createSelector } from 'reselect';
import { deliveryOptionsSelector } from 'selectors/page/product/fulfillmentOptions/deliveryOptions/deliveryOptionsSelector';
import Empty from 'constants/empty';

const shipToHomeSelector = createSelector(deliveryOptionsSelector, deliveryOption => deliveryOption.shipToHome || Empty.Object);

export { shipToHomeSelector };
