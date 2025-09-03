import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const preferredZipCodeSelector = createSelector(userSelector, user => user.preferredZipCode || Empty.String);

export default { preferredZipCodeSelector };
