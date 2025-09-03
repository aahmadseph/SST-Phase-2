import DeliveryInstructions from 'components/Checkout/Sections/SddSections/SddSection/DeliveryInstructions/DeliveryInstructions';
import { withDeliveryInstructionsProps } from 'viewModel/checkout/sections/sddSections/sddSection/deliveryInstructions/withDeliveryInstructionsProps';

const ConnectedDeliveryInstructions = withDeliveryInstructionsProps(DeliveryInstructions);

export default ConnectedDeliveryInstructions;
