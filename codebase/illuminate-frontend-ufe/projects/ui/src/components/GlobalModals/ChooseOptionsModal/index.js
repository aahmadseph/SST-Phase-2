import { withChooseOptionsModalProps } from 'viewModel/globalModals/chooseOptionsModal/withChooseOptionsModalProps';
import ChooseOptionsModal from 'components/GlobalModals/ChooseOptionsModal/ChooseOptionsModal';

const ConnectedChooseOptionsModal = withChooseOptionsModalProps(ChooseOptionsModal);

export default ConnectedChooseOptionsModal;
