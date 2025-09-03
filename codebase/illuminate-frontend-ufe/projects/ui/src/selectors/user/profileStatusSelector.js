import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const profileStatusSelector = createSelector(userSelector, user => user.profileStatus || 0);

export default { profileStatusSelector };
