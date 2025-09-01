import SMSSignUp from 'components/SMSSignUp/SMSSignUp';
import { withSMSSignUpProps } from 'viewModel/SMSSignUp/withSMSSignUpProps';

const ConnectedSMSSignUp = withSMSSignUpProps(SMSSignUp);

export default ConnectedSMSSignUp;
