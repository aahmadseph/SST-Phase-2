import WelcomeMatModal from 'components/GlobalModals/WelcomeMatModal/WelcomeMatModal';
import { withWelcomeMatModalProps } from 'viewModel/globalModals/welcomeMatModal/withWelcomeMatModalProps';

const ConnectedWelcomeMatModal = withWelcomeMatModalProps(WelcomeMatModal);

export default ConnectedWelcomeMatModal;
