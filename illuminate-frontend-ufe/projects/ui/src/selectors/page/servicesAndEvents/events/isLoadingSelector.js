import { createSelector } from 'reselect';
import { eventsSelector } from 'selectors/page/servicesAndEvents/eventsSelector';

const isLoadingSelector = createSelector(eventsSelector, events => events.isLoading);

export default { isLoadingSelector };
