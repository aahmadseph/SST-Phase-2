import { createSelector } from 'reselect';
import { productSelector } from 'selectors/page/product/productSelector';
import Empty from 'constants/empty';

const currentSkuSelector = createSelector(productSelector, product => product.currentSku || Empty.Object);

export { currentSkuSelector };
