import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const preferredStoreIdSelector = createSelector(userSelector, user => user.preferredStore || Empty.String);

export { preferredStoreIdSelector };
