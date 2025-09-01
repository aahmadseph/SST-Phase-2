import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const myCustomListSelector = createSelector(pageSelector, page => page?.myCustomList || Empty.Object);

export { myCustomListSelector };
