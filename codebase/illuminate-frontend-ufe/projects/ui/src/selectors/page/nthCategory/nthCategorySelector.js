import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const nthCategorySelector = createSelector(pageSelector, page => page.nthCategory || Empty.Object);

export { nthCategorySelector };
