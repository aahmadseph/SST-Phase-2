import DeleteListModal from 'components/GlobalModals/DeleteListModal/DeleteListModal';
import { withDeleteListModalProps } from 'viewModel/globalModals/deleteListModal/withDeleteListModalProps';

const ConnectedDeleteListModalProps = withDeleteListModalProps(DeleteListModal);

export default ConnectedDeleteListModalProps;
