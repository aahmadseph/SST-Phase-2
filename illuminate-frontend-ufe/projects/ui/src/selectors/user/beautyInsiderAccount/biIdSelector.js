import { createSelector } from 'reselect';
import { beautyInsiderAccountSelector } from 'selectors/user/beautyInsiderAccount/beautyInsiderAccountSelector';

export default createSelector(beautyInsiderAccountSelector, account => account.biAccountId);
