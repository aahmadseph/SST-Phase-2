import PauseAutoReplenModal from 'components/GlobalModals/PauseAutoReplenModal/PauseAutoReplenModal';
import { withPauseAutoReplenModalProps } from 'viewModel/globalModals/pauseAutoReplenModal/withPauseAutoReplenModalProps';

const ConnectedPauseAutoReplenModal = withPauseAutoReplenModalProps(PauseAutoReplenModal);

export default ConnectedPauseAutoReplenModal;
