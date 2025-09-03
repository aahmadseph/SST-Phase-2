import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const shopSameDaySelector = createSelector(pageSelector, page => page.shopSameDay || Empty.Object);

export { shopSameDaySelector };
