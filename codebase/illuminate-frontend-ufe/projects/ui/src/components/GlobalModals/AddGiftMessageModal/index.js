import AddGiftMessageModal from 'components/GlobalModals/AddGiftMessageModal/AddGiftMessageModal';
import { withAddGiftMessageModalProps } from 'viewModel/globalModals/addGiftMessageModal/withAddGiftMessageModalProps';

const ConnectedAddGiftMessageModal = withAddGiftMessageModalProps(AddGiftMessageModal);

export default ConnectedAddGiftMessageModal;
