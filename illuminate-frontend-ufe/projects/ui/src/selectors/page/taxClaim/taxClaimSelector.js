import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const taxClaimSelector = createSelector(pageSelector, page => page.taxClaim || Empty.Object);

export default taxClaimSelector;
