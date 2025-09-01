import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import { authSelector } from 'selectors/auth/authSelector';

const isAnonymousSelector = createSelector(authSelector, auth => userUtils.isAnonymous(auth));

export { isAnonymousSelector };
