import SameDayUnlimited from 'components/RichProfile/MyAccount/Subscriptions/SameDayUnlimited/SameDayUnlimited';
import { withSameDayUnlimitedProps } from 'viewModel/richProfile/myAccount/subscriptions/sameDayUnlimited/withSameDayUnlimitedProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedSameDayUnlimited = withGlobalModals(withSameDayUnlimitedProps(SameDayUnlimited));

export default ConnectedSameDayUnlimited;
