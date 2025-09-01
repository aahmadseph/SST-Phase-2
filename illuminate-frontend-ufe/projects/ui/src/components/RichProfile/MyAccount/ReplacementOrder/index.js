import ReplacementOrder from 'components/RichProfile/MyAccount/ReplacementOrder/ReplacementOrder';
import { withReplacementOrderProps } from 'viewModel/richProfile/myAccount/replacementOrder/withReplacementOrderProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withReplacementOrderProps(ReplacementOrder));
