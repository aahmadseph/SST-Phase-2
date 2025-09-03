import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const buySelector = createSelector(pageSelector, page => page.buy || Empty.Object);

export default { buySelector };
