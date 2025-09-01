import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const isSDUFeatureDownSelector = createSelector(userSelector, user => user.isSDUFeatureDown);

export { isSDUFeatureDownSelector };
