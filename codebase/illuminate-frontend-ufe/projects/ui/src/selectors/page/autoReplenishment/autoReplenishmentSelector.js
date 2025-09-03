import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';

const autoReplenishmentSelector = createSelector(pageSelector, page => page.autoReplenishment);

export default autoReplenishmentSelector;
