import ShipMethodDescription from 'components/Checkout/Sections/ShipOptions/ShipMethodDescription/ShipMethodDescription';
import { withSplitEDDProps } from 'viewModel/sharedComponents/splitEDD/withSplitEDDProps';

import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedShipMethodDescription = withGlobalModals(withSplitEDDProps(ShipMethodDescription));

export default ConnectedShipMethodDescription;
