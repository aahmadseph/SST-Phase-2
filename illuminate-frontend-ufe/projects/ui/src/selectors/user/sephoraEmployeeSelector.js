import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const sephoraEmployeeSelector = createSelector(userSelector, user => user.sephoraEmployee);

export { sephoraEmployeeSelector };
