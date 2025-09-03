import CreditCardRewards from 'components/Content/CreditCards/CreditCardRewards/CreditCardRewards';
import { withCreditCardRewardsProps } from 'viewModel/content/creditCards/creditCardRewards/withCreditCardRewardsProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withCreditCardRewardsProps(CreditCardRewards));
