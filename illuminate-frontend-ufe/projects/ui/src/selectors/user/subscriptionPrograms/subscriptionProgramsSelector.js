import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import Empty from 'constants/empty';

const subscriptionProgramsSelector = createSelector(userSelector, user => user.subscriptionPrograms || Empty.Object);

export default { subscriptionProgramsSelector };
