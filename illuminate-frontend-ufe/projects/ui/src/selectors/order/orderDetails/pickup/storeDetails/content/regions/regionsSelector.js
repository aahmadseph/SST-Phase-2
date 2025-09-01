import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import { contentSelector } from 'selectors/order/orderDetails/pickup/storeDetails/content/contentSelector';

const regionsSelector = createSelector(contentSelector, content => content.regions || Empty.Object);

export { regionsSelector };
