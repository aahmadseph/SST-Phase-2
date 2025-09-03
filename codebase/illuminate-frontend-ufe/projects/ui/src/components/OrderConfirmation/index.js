import OrderConfirmation from 'components/OrderConfirmation/OrderConfirmation';
import withOrderConfirmationProps from 'viewModel/orderConfirmation/withOrderConfirmationProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedOrderConfirmation = withGlobalModals(withOrderConfirmationProps(OrderConfirmation));

export default ConnectedOrderConfirmation;
