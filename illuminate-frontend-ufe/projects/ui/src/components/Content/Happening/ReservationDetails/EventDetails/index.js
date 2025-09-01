import EventReservationDetails from 'components/Content/Happening/ReservationDetails/EventDetails/EventDetails';
import { withHappeningUserProps } from 'viewModel/happening/withHappeningUserProps';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

export default withEnsureUserIsSignedIn(withHappeningUserProps(EventReservationDetails));
