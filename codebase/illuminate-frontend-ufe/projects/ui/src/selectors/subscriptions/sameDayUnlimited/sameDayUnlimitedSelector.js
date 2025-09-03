import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';

const sameDayUnlimitedSelector = createSelector(pageSelector, page => page.sameDayUnlimited);

export default { sameDayUnlimitedSelector };
