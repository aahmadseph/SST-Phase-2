import PaymentRadio from 'components/RwdCheckout/Sections/Payment/Section/PaymentRadio';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import pazeSelector from 'selectors/paze/pazeSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    pazeSelector,
    orderItemsSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (paze, orderItems, defaultPayment) => {
        return {
            paymentName: 'payWithPaze',
            defaultPayment,
            selected: paze.isSelected,
            errorMessage: paze.error?.errorMessage,
            checkoutEnabled: orderItems.isPazeCheckoutEnabled
        };
    }
);

const withPazeRadioProps = wrapHOC(connect(fields));

export default withPazeRadioProps(PaymentRadio);
