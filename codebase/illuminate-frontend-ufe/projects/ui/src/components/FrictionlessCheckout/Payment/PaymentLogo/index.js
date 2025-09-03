import PaymentLogo from 'components/RwdCheckout/PaymentLogo/PaymentLogo';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import RwdCheckoutActions from 'actions/RwdCheckoutActions';

const { wrapHOC } = FrameworkUtils;

const fields = null;

const functions = {
    paymentNumberUpdated: RwdCheckoutActions.paymentNumberUpdated
};

const withPaymentLogoProps = wrapHOC(connect(fields, functions));

export default withPaymentLogoProps(PaymentLogo);
