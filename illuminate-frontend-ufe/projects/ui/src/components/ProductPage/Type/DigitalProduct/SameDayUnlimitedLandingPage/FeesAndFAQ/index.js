import FeesAndFAQ from 'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/FeesAndFAQ/FeesAndFAQ';
import { withFeesAndFaqProps } from 'viewModel/productPage/type/digitalProduct/sameDayUnlimitedLandingPage/feesAndFaq/withFeesAndFaqProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withFeesAndFaqProps(FeesAndFAQ));
