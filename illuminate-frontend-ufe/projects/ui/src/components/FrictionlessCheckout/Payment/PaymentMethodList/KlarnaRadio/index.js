import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import skuHelpers from 'utils/skuHelpers';
import PaymentRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PaymentRadio';
import { PAYMENT_TYPES } from 'constants/RwdBasket';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    klarnaSelector,
    orderItemsSelector,
    priceInfoSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (klarna, orderItems, priceInfo, defaultPayment) => {
        const amount = priceInfo.creditCardAmount || priceInfo.paypalAmount;
        const [installmentValue] = skuHelpers.formatInstallmentValue(amount);

        return {
            paymentName: PAYMENT_TYPES.PAY_KLARNA,
            defaultPayment,
            selected: klarna.isSelected,
            errorMessage: klarna.error?.errorMessage,
            checkoutEnabled: orderItems.isKlarnaCheckoutEnabled,
            installmentValue
        };
    }
);

const withKlarnaRadioProps = wrapHOC(connect(fields));

export default withKlarnaRadioProps(PaymentRadio);
