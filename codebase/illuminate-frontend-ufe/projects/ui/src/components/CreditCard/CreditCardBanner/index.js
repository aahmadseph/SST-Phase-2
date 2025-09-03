import CreditCardBanner from 'components/CreditCard/CreditCardBanner/CreditCardBanner';
import { withCreditCardBannerProps } from 'viewModel/content/creditCards/creditCardBanner/withCreditCardBannerProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withCreditCardBannerProps(CreditCardBanner));
