import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';

const isSDDRougeFreeShipEligibleSelector = createSelector(userSelector, () => userUtils.isSDDRougeFreeShipEligible());

export { isSDDRougeFreeShipEligibleSelector };
