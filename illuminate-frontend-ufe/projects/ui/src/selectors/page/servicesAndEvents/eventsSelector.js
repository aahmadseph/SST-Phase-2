import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const eventsSelector = createSelector(pageSelector, page => page.events || Empty.Object);

export { eventsSelector };
