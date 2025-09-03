import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import venmoSelector from 'selectors/venmo/venmoSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    venmoSelector,
    orderItemsSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (venmo, orderItems, defaultPayment) => {
        return {
            paymentName: 'payWithVenmo',
            defaultPayment,
            selected: venmo.isSelected,
            errorMessage: venmo.error?.errorMessage,
            checkoutEnabled: orderItems.isVenmoEligible
        };
    }
);

const withVenmoRadioProps = wrapHOC(connect(fields));

export { withVenmoRadioProps };
