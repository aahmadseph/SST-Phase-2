import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import Empty from 'constants/empty';

const preferredStoreInfoSelector = createSelector(userSelector, user => user?.preferredStoreInfo || Empty.Object);

export default preferredStoreInfoSelector;
