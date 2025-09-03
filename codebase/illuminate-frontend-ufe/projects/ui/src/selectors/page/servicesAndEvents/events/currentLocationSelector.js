import { createSelector } from 'reselect';
import { eventsSelector } from 'selectors/page/servicesAndEvents/eventsSelector';
import Empty from 'constants/empty';

const currentLocationSelector = createSelector(eventsSelector, events => events.currentLocation || Empty.Object);

export default { currentLocationSelector };
