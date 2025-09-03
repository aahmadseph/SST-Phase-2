import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const productSelector = createSelector(pageSelector, page => page.product || Empty.Object);

export { productSelector };
