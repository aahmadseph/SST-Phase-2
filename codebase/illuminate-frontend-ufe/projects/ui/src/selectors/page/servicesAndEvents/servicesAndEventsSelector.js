import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const servicesAndEventsSelector = createSelector(pageSelector, page => page.servicesAndEvents || Empty.Object);

export default { servicesAndEventsSelector };
