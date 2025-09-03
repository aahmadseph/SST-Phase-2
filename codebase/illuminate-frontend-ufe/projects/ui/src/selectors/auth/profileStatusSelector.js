import { createSelector } from 'reselect';
import { authSelector } from 'selectors/auth/authSelector';

const profileStatusSelector = createSelector(authSelector, auth => auth.profileStatus || 0);

export default { profileStatusSelector };
