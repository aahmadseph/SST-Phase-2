import AddPaymentMethodModal from 'components/GlobalModals/AddPaymentMethodModal/AddPaymentMethodModal';
import { withAddPaymentMethodModalProps } from 'viewModel/globalModals/addPaymentMethodModal/withAddPaymentMethodModalProps';

const ConnectedAddPaymentMethodModal = withAddPaymentMethodModalProps(AddPaymentMethodModal);

export default ConnectedAddPaymentMethodModal;
