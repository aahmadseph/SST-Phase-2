import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import pazeSelector from 'selectors/paze/pazeSelector';
import orderItemsSelector from 'selectors/order/orderDetails/items/orderItemsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    pazeSelector,
    orderItemsSelector,
    priceInfoSelector,
    (_state, ownProps) => ownProps.defaultPayment,
    (paze, orderItems, priceInfo, defaultPayment) => {
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

export { withPazeRadioProps };
