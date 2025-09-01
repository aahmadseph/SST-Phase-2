import { createSelector } from 'reselect';
import { dataSelector } from 'selectors/page/headerFooterTemplate/data/dataSelector';
import Empty from 'constants/empty';

const globalModalsSelector = createSelector(dataSelector, data => data.globalModals || Empty.Object);

export { globalModalsSelector };
