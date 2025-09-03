import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const happeningSelector = createSelector(pageSelector, page => page.happening || Empty.Object);

export default happeningSelector;
