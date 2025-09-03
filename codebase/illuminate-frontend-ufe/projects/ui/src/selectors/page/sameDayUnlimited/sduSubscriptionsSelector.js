import { createSelector } from 'reselect';
import sameDayUnlimitedSelector from 'selectors/page/sameDayUnlimited/sameDayUnlimitedSelector';
import Empty from 'constants/empty';

const sduSubscriptionsSelector = createSelector(sameDayUnlimitedSelector, sameDayUnlimited => {
    const subscriptions = sameDayUnlimited.SDUsubscription.subscriptions;

    return subscriptions?.filter(subscription => subscription.type === 'SDU')[0] || Empty.Object;
});

export default sduSubscriptionsSelector;
