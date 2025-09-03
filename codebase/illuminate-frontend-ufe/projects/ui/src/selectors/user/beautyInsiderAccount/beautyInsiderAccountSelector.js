import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
const beautyInsiderAccountSelector = createSelector(userSelector, user => user.beautyInsiderAccount || Empty.Object);

export { beautyInsiderAccountSelector };
