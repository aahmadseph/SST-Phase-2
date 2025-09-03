import { createSelector } from 'reselect';
import { dataSelector } from 'selectors/page/headerFooterTemplate/data/dataSelector';
import Empty from 'constants/empty';

const megaNavSelector = createSelector(dataSelector, data => data.megaNav || Empty.Object);

export { megaNavSelector };
