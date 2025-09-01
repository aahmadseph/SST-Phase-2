import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const customerPreferenceSelector = createSelector(userSelector, user => user.customerPreference || Empty.Object);

export { customerPreferenceSelector };
