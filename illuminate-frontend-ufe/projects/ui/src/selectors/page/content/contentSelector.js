import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const contentSelector = createSelector(pageSelector, page => page.content || Empty.Object);

export default { contentSelector };
