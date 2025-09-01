import PaymentRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaymentRadio';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import pazeSelector from 'selectors/paze/pazeSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import { PAYMENT_TYPES } from 'constants/RwdBasket';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    pazeSelector,
    orderItemsSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (paze, orderItems, defaultPayment) => {
        return {
            paymentName: PAYMENT_TYPES.PAY_PAZE,
            defaultPayment,
            selected: paze.isSelected,
            errorMessage: paze.error?.errorMessage,
            checkoutEnabled: orderItems.isPazeCheckoutEnabled
        };
    }
);

const withPazeRadioProps = wrapHOC(connect(fields));

export default withPazeRadioProps(PaymentRadio);
