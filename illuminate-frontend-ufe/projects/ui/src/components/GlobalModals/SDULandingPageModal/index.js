import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal/SDULandingPageModal';
import { withSDULandingPageModalProps } from 'viewModel/globalModals/sduLandingPageModal/withSDULandingPageModalProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedSDULandingPageModal = withGlobalModals(withSDULandingPageModalProps(SDULandingPageModal));

export default ConnectedSDULandingPageModal;
