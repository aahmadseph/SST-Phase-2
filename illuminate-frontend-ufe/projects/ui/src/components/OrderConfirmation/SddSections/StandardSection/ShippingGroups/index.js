import ShippingGroups from 'components/OrderConfirmation/SddSections/StandardSection/ShippingGroups/ShippingGroups';
import withShippingGroupsProps from 'viewModel/orderConfirmation/sddSections/standardSection/withShippingGroupsProps';

const ConnectedShippingGroups = withShippingGroupsProps(ShippingGroups);

export default ConnectedShippingGroups;
