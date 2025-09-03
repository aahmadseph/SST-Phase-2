import { createSelector } from 'reselect';
import { eventsSelector } from 'selectors/page/servicesAndEvents/eventsSelector';
import Empty from 'constants/empty';

const storesListSelector = createSelector(eventsSelector, events => events.storesList || Empty.Array);

export default { storesListSelector };
