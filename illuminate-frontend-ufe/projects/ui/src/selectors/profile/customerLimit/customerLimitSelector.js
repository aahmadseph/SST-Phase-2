import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import profileSelector from 'selectors/profile/profileSelector';

// Selector for customer limit data from profile
const customerLimitSelector = createSelector(profileSelector, profile => profile.customerLimit || Empty.Object);

export { customerLimitSelector };
