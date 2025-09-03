import SMSSignInModal from 'components/GlobalModals/SMSSignInModal/SMSSignInModal';
import { withSMSSignInModalProps } from 'viewModel/globalModals/SMSSignInModal/withSMSSignInModalProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedSMSSignInModal = withGlobalModals(withSMSSignInModalProps(SMSSignInModal));

export default ConnectedSMSSignInModal;
