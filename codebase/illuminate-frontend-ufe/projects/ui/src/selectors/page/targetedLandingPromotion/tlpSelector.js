import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const tlpSelector = createSelector(pageSelector, page => page.tlpPage || Empty.Object);

export default { tlpSelector };
