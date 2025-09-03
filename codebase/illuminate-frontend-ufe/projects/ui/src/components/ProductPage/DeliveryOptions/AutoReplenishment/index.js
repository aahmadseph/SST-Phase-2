import { withAutoReplenishmentProps } from 'viewModel/productPage/deliveryOptions/autoReplenishment/withAutoReplenishmentProps';
import AutoReplenishment from 'components/ProductPage/DeliveryOptions/AutoReplenishment/AutoReplenishment';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withAutoReplenishmentProps(AutoReplenishment));
