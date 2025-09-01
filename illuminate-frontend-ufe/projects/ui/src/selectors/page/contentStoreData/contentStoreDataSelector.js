import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const contentStoreDataSelector = createSelector(pageSelector, page => page.contentStoreData || Empty.Object);

export default { contentStoreDataSelector };
