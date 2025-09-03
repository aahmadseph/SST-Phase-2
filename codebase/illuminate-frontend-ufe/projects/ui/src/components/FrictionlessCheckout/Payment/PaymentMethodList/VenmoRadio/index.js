import PaymentRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaymentRadio';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import venmoSelector from 'selectors/venmo/venmoSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import { PAYMENT_TYPES } from 'constants/RwdBasket';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    venmoSelector,
    orderItemsSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (_state, ownProps) => ownProps.disabled,
    (venmo, orderItems, defaultPayment, disabled) => {
        return {
            paymentName: PAYMENT_TYPES.PAY_VENMO,
            defaultPayment,
            selected: venmo.isSelected,
            errorMessage: venmo.error?.errorMessage,
            checkoutEnabled: orderItems.isVenmoEligible && !disabled
        };
    }
);

const withVenmoRadioProps = wrapHOC(connect(fields));

export default withVenmoRadioProps(PaymentRadio);
