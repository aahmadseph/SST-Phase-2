import { createSelector } from 'reselect';
import autoReplenishmentSelector from 'selectors/page/autoReplenishment/autoReplenishmentSelector';

const subscriptionsSelector = createSelector(autoReplenishmentSelector, autoReplenishment => autoReplenishment.subscriptions);

export default subscriptionsSelector;
