import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const defaultSAZipCodeSelector = createSelector(userSelector, user => user.defaultSAZipCode || Empty.String);

export default defaultSAZipCodeSelector;
