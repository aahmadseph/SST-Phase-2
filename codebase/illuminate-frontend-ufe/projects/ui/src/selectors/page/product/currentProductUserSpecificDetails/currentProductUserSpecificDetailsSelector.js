import { createSelector } from 'reselect';
import { productSelector } from 'selectors/page/product/productSelector';
import Empty from 'constants/empty';

const currentProductUserSpecificDetailsSelector = createSelector(
    productSelector,
    product => product.currentProductUserSpecificDetails || Empty.Object
);

export default { currentProductUserSpecificDetailsSelector };
