import CreditCardRewards from 'components/Content/BeautyInsider/BeautyInsiderModules/CreditCardRewards/CreditCardRewards';
import { withCreditCardRewardsProps } from 'viewModel/content/BeautyInsider/BeautyInsiderModules/CreditCardRewards/withCreditCardRewardsProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withCreditCardRewardsProps(CreditCardRewards));
