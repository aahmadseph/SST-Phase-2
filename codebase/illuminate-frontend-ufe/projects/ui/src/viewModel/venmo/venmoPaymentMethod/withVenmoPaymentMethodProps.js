import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(userSelector, orderDetailsSelector, isAnonymousSelector, (user, orderDetails, isAnonymous) => {
    const amount = orderDetails?.priceInfo?.creditCardAmount || orderDetails?.priceInfo?.paypalAmount;
    const checked = user.selectedAsDefaultPaymentName === 'venmo';

    return {
        amount,
        checked,
        isAnonymous
    };
});

const withVenmoPaymentMethodProps = wrapHOC(connect(fields));

export {
    fields, withVenmoPaymentMethodProps
};
