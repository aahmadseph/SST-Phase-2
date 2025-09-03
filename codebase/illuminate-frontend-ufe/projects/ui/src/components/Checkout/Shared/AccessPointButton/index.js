import AccessPointButton from 'components/Checkout/Shared/AccessPointButton/AccessPointButton';
import withAccessPointProps from 'viewModel/checkout/shared/accessPointButton/withAccessPointProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedAccessPointButton = withGlobalModals(withAccessPointProps(AccessPointButton));
ConnectedAccessPointButton.displayName = 'ConnectedAccessPointButton';

export default ConnectedAccessPointButton;
