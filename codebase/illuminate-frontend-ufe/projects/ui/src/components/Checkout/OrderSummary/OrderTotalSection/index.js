import OrderTotalSection from 'components/Checkout/OrderSummary/OrderTotalSection/OrderTotalSection';
import { withOrderTotalSectionProps } from 'viewModel/checkout/orderSummary/orderTotalSection/withOrderTotalSectionProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedOrderTotalSection = withGlobalModals(withOrderTotalSectionProps(OrderTotalSection));

export default ConnectedOrderTotalSection;
