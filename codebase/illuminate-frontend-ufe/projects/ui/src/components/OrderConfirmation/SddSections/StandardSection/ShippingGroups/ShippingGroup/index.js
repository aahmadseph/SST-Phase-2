import ShippingGroup from 'components/OrderConfirmation/SddSections/StandardSection/ShippingGroups/ShippingGroup/ShippingGroup';
import { withShippingGroupProps } from 'viewModel/orderConfirmation/sddSections/standardSection/withShippingGroupProps';

const ConnectedShippingGroup = withShippingGroupProps(ShippingGroup);

export default ConnectedShippingGroup;
