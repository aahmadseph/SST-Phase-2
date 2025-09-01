import WaitlistDetails from 'components/Content/Happening/ReservationDetails/WaitlistDetails/WaitlistDetails';
import { withHappeningUserProps } from 'viewModel/happening/withHappeningUserProps';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

export default withEnsureUserIsSignedIn(withHappeningUserProps(WaitlistDetails));
