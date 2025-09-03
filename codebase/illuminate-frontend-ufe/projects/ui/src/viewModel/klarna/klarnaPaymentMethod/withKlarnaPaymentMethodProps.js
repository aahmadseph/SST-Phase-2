import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import UserActions from 'actions/UserActions';

const { wrapHOC } = FrameworkUtils;
const { toggleSelectAsDefaultPayment } = UserActions;
const fields = createSelector(userSelector, orderDetailsSelector, isAnonymousSelector, (user, orderDetails, isAnonymous) => {
    const amount = orderDetails?.priceInfo?.creditCardAmount || orderDetails?.priceInfo?.paypalAmount;
    const checked = user.selectedAsDefaultPaymentName === 'klarna';

    return {
        amount,
        checked,
        isAnonymous
    };
});

const functions = {
    toggleSelectAsDefaultPayment
};

const withKlarnaPaymentMethodProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withKlarnaPaymentMethodProps
};
