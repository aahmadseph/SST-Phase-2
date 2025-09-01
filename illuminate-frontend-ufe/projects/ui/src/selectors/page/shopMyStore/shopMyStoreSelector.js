import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const shopMyStoreSelector = createSelector(pageSelector, page => page.shopMyStore || Empty.Object);

export { shopMyStoreSelector };
