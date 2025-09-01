import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import { userSelector } from 'selectors/user/userSelector';

const isBIUserSelector = createSelector(userSelector, () => userUtils.isBI());

export { isBIUserSelector };
