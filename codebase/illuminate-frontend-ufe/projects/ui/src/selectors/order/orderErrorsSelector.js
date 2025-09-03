import { createSelector } from 'reselect';
import { orderSelector } from 'selectors/order/orderSelector';
import Empty from 'constants/empty';

const orderErrorsSelector = createSelector(orderSelector, order => order.sectionErrors || Empty.Object);

export default orderErrorsSelector;
