import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';

const showLoadSpaPageProgressSelector = createSelector(pageSelector, page => page.showLoadSpaPageProgress);

export { showLoadSpaPageProgressSelector };
