import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import Empty from 'constants/empty';

const userSubscriptionsSelector = createSelector(userSelector, user => user.userSubscriptions || Empty.Array);

export default { userSubscriptionsSelector };
