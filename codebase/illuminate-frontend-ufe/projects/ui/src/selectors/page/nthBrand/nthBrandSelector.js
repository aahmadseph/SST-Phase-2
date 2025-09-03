import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const nthBrandSelector = createSelector(pageSelector, page => page.nthBrand || Empty.Object);

export default { nthBrandSelector };
