import ShipToAccessPoint from 'components/Checkout/Sections/ShipToAccessPoint/ShipToAccessPoint';
import withShipToAccessPointProps from 'components/Checkout/Sections/ShipToAccessPoint/withShipToAccessPointProps';

const ConnectedShipToAccessPoint = withShipToAccessPointProps(ShipToAccessPoint);
ConnectedShipToAccessPoint.displayName = 'ConnectedShipToAccessPoint';

export default ConnectedShipToAccessPoint;
