import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const checkoutPageSelector = createSelector(pageSelector, page => page.checkoutPage || Empty.Object);

export { checkoutPageSelector };
