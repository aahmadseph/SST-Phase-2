import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';

const isBirthdayGiftEligibleSelector = createSelector(userSelector, () => userUtils.isBirthdayGiftEligible());

export { isBirthdayGiftEligibleSelector };
