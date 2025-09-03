import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';

const isAnonymousSelector = createSelector(userSelector, user => userUtils.isAnonymous(user));

export { isAnonymousSelector };
