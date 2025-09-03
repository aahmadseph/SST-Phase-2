import MyListsModal from 'components/GlobalModals/MyListsModal/MyListsModal';
import { withMyListsModalProps } from 'viewModel/globalModals/myListsModal/withMyListsModalProps';

const ConnectedMyListsModalProps = withMyListsModalProps(MyListsModal);

export default ConnectedMyListsModalProps;
