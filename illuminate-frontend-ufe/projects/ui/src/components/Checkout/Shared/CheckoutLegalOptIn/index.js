import CheckoutLegalOptIn from 'components/Checkout/Shared/CheckoutLegalOptIn/CheckoutLegalOptIn';
import { withCheckoutLegalOptInProps } from 'viewModel/checkout/shared/checkoutLegalOptIn/withCheckoutLegalOptInProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedCheckoutLegalOptIn = withGlobalModals(withCheckoutLegalOptInProps(CheckoutLegalOptIn));

export default ConnectedCheckoutLegalOptIn;
