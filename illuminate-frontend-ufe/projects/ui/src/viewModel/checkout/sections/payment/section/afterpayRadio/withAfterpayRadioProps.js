import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import afterpaySelector from 'selectors/afterpay/afterpaySelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import skuHelpers from 'utils/skuHelpers';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    afterpaySelector,
    orderItemsSelector,
    priceInfoSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (afterpay, orderItems, priceInfo, defaultPayment) => {
        const amount = priceInfo.creditCardAmount || priceInfo.paypalAmount;
        const [installmentValue] = skuHelpers.formatInstallmentValue(amount);

        return {
            paymentName: 'payWithAfterpay',
            defaultPayment,
            selected: afterpay.isSelected,
            errorMessage: afterpay.error?.errorMessage,
            checkoutEnabled: orderItems.isAfterpayCheckoutEnabled,
            installmentValue
        };
    }
);

const withAfterpayRadioProps = wrapHOC(connect(fields));

export { withAfterpayRadioProps };
