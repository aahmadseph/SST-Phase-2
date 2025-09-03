import SDUAgreement from 'components/Checkout/OrderSummary/OrderTotalSection/SDUAgreement/SDUAgreement';
import { withSDUAgreementProps } from 'viewModel/checkout/orderSummary/orderTotalSection/sduAgreement/withSDUAgreementProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withSDUAgreementProps(SDUAgreement));
