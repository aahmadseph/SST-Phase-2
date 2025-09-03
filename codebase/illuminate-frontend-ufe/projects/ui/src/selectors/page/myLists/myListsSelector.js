import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const myListsSelector = createSelector(pageSelector, page => page?.myLists || Empty.Object);

export { myListsSelector };
