import AutoReplenishment from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishment';
import { withAutoReplenishmentProps } from 'viewModel/richProfile/myAccount/autoReplenishment/withAutoReplenishmentProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedAutoReplenishment = withGlobalModals(withAutoReplenishmentProps(AutoReplenishment));

export default ConnectedAutoReplenishment;
