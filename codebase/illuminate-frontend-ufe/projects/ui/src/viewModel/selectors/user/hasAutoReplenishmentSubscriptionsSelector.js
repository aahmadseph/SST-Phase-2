import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import SubscriptionTypes from 'constants/SubscriptionTypes';
const {
    SUBSCRIPTION_TYPES: { AUTO_REPLENISHMENT }
} = SubscriptionTypes;

const hasAutoReplenishmentSubscriptionsSelector = createSelector(userSelector, user => {
    const subscriptionSummary = user?.subscriptionSummary || [];
    const hasAutoReplenishmentSubscriptions = subscriptionSummary.some(
        subscription => subscription.type === AUTO_REPLENISHMENT && (subscription.active || subscription.paused || subscription.cancelled)
    );

    return hasAutoReplenishmentSubscriptions;
});

export { hasAutoReplenishmentSubscriptionsSelector };
