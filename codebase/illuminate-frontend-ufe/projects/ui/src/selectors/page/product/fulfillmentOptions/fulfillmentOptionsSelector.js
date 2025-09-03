import { createSelector } from 'reselect';
import { productSelector } from 'selectors/page/product/productSelector';
import Empty from 'constants/empty';

const fulfillmentOptionsSelector = createSelector(productSelector, product => product.fulfillmentOptions || Empty.Object);

export { fulfillmentOptionsSelector };
