import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import Empty from 'constants/empty';

const skuLoveDataSelector = createSelector(lovesSelector, loves => loves.skuLoveData || Empty.Object);

export default { skuLoveDataSelector };
