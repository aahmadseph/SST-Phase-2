import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const homeSelector = createSelector(pageSelector, page => page.home || Empty.Object);

export { homeSelector };
