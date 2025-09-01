import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';

const firstNameSelector = createSelector(userSelector, () => userUtils.getProfileFirstName());

export { firstNameSelector };
