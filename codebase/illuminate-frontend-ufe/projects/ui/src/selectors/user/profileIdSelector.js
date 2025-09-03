import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

export default createSelector(userSelector, user => user.profileId);
