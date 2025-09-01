import PleaseSignIn from 'components/RichProfile/MyAccount/PleaseSignIn/PleaseSignIn';
import { withPleaseSignInProps } from 'viewModel/richProfile/myAccount/pleaseSignIn/withPleaseSignInProps';

const ConnectedPleaseSignIn = withPleaseSignInProps(PleaseSignIn);

export default ConnectedPleaseSignIn;
