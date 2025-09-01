import { createSelector } from 'reselect';
import autoReplenishmentSelector from 'selectors/page/autoReplenishment/autoReplenishmentSelector';
import Empty from 'constants/empty';

const shippingAndPaymentInfoSelector = createSelector(
    autoReplenishmentSelector,
    autoReplenishment => autoReplenishment.shippingAndPaymentInfo || Empty.Object
);

export default { shippingAndPaymentInfoSelector };
