import { createSelector } from 'reselect';
import { authSelector } from 'selectors/auth/authSelector';
import authenticationUtils from 'utils/Authentication';

const hasIdentitySelector = createSelector(authSelector, auth => authenticationUtils.getHasIdentity(auth));

export { hasIdentitySelector };
