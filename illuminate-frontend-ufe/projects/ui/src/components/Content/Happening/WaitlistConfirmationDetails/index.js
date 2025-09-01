import WaitlistConfirmationDetails from 'components/Content/Happening/WaitlistConfirmationDetails/WaitlistConfirmationDetails';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';
import { withHappeningUserProps } from 'viewModel/happening/withHappeningUserProps';

export default withEnsureUserIsSignedIn(withHappeningUserProps(WaitlistConfirmationDetails));
