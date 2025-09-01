import OrderSummary from 'components/Checkout/OrderSummary/OrderSummary';
import withOrderSummaryProps from 'viewModel/checkout/orderSummary/withOrderSummaryProps';

const ConnectedOrderSummary = withOrderSummaryProps(OrderSummary);

export default ConnectedOrderSummary;
