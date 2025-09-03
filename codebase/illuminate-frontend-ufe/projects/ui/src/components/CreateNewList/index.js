import CreateNewListModal from 'components/CreateNewList/CreateNewListModal';
import { withCreateNewListModalProps } from 'viewModel/createNewList/withCreateNewListModalProps';

const ConnectedCreateNewListModalProps = withCreateNewListModalProps(CreateNewListModal);

export default ConnectedCreateNewListModalProps;
