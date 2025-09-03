import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';

export default createSelector(pageSelector, page => page.templateInformation);
