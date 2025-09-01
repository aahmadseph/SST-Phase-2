import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const sameDayUnlimitedSelector = createSelector(pageSelector, page => page.sameDayUnlimited || Empty.Object);

export default sameDayUnlimitedSelector;
