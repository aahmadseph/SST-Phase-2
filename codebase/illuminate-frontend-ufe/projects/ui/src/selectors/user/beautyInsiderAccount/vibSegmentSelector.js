import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { beautyInsiderAccountSelector } from 'selectors/user/beautyInsiderAccount/beautyInsiderAccountSelector';

const vibSegmentSelector = createSelector(beautyInsiderAccountSelector, beautyInsiderAccount => beautyInsiderAccount.vibSegment || Empty.String);

export default { vibSegmentSelector };
