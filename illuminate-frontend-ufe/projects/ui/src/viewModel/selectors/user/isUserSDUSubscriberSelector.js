import { createSelector } from 'reselect';
import Empty from 'constants/empty';

import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
const { userSubscriptionsSelector } = UserSubscriptionsSelector;

const isUserSDUSubscriberSelector = createSelector(userSubscriptionsSelector, userSubscriptions => {
    // User is anonymous
    if (!userSubscriptions.length) {
        return false;
    }

    const sduSubscription = userSubscriptions.find(subscription => subscription.type === 'SDU') || Empty.Object;
    const isActive = sduSubscription.status === 'ACTIVE';

    return isActive;
});

export { isUserSDUSubscriberSelector };
