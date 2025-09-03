import Empty from 'constants/empty';
import { userSelector } from 'selectors/user/userSelector';
import { createSelector } from 'reselect';

const passkeysSelector = createSelector(userSelector, user => (user.passkeys ? user.passkeys : Empty.Array));

export { passkeysSelector };
