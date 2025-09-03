import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const preferredStoreSelector = createSelector(userSelector, user => ({
    preferredStoreInfo: user.preferredStoreInfo,
    preferredStoreName: user.preferredStoreName
}));

export default preferredStoreSelector;
