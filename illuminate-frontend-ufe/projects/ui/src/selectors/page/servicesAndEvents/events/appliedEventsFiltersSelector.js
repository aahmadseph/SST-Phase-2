import { createSelector } from 'reselect';
import { eventsSelector } from 'selectors/page/servicesAndEvents/eventsSelector';
import Empty from 'constants/empty';

const appliedEventsFiltersSelector = createSelector(eventsSelector, events => events.appliedEventsFilters || Empty.Object);

export default { appliedEventsFiltersSelector };
