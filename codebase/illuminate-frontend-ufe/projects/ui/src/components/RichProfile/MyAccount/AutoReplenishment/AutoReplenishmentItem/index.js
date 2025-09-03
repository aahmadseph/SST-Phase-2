import AutoReplenishmentItem from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishmentItem/AutoReplenishmentItem';
import { withAutoReplenishItemProps } from 'viewModel/richProfile/myAccount/autoReplenishment/autoReplenishItem/withAutoReplenishItemProps';

const ConnectedAutoReplenishItem = withAutoReplenishItemProps(AutoReplenishmentItem);

export default ConnectedAutoReplenishItem;
