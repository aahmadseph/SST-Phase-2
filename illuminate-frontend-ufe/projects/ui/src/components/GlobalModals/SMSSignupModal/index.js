import SMSSignupModal from 'components/GlobalModals/SMSSignupModal/SMSSignupModal';
import { withSMSSignupModalProps } from 'viewModel/globalModals/smsSignupModal/withSMSSignupModalProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedSMSSignupModal = withGlobalModals(withSMSSignupModalProps(SMSSignupModal));

export default ConnectedSMSSignupModal;
