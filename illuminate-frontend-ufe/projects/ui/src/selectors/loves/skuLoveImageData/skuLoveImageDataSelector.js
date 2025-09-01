import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import Empty from 'constants/empty';

const skuLoveImageDataSelector = createSelector(lovesSelector, loves => loves.skuLoveImageData || Empty.Object);

export default { skuLoveImageDataSelector };
