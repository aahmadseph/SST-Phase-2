import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const beautyPreferenceSelector = createSelector(userSelector, user => user.beautyPreference || Empty.Object);

export default { beautyPreferenceSelector };
