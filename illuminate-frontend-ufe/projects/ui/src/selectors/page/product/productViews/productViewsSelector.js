import { createSelector } from 'reselect';
import { productSelector } from 'selectors/page/product/productSelector';
import Empty from 'constants/empty';

const productViewsSelector = createSelector(productSelector, product => product.productViews || Empty.Object);

export { productViewsSelector };
