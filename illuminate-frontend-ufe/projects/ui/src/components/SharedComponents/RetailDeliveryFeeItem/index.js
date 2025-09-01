import RetailDeliveryFeeItem from 'components/SharedComponents/RetailDeliveryFeeItem/RetailDeliveryFeeItem';
import { withRetailDeliveryFeeItemProps } from 'viewModel/sharedComponents/retailDeliveryFeeItem/withRetailDeliveryFeeItemProps';
import withGlobalModals from 'hocs/withGlobalModals';

const WrappedRetailDeliveryFeeItem = withGlobalModals(withRetailDeliveryFeeItemProps(RetailDeliveryFeeItem));

export default WrappedRetailDeliveryFeeItem;
