import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const searchSelector = createSelector(pageSelector, page => page.search || Empty.Object);

export default { searchSelector };
