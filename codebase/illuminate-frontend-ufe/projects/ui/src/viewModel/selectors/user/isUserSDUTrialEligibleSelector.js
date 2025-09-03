import { createSelector } from 'reselect';
import Empty from 'constants/empty';

import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
const { userSubscriptionsSelector } = UserSubscriptionsSelector;

const isUserSDUTrialEligibleSelector = createSelector(userSubscriptionsSelector, userSubscriptions => {
    // User is anonymous
    if (!userSubscriptions.length) {
        return true;
    }

    const sduSubscription = userSubscriptions.find(subscription => subscription.type === 'SDU') || Empty.Object;
    const isTrialEligible = !!sduSubscription.isTrialEligible;

    return isTrialEligible;
});

export { isUserSDUTrialEligibleSelector };
