import ServiceReservationDetails from 'components/Content/Happening/ReservationDetails/ServiceDetails/ServiceDetails';
import { withHappeningUserProps } from 'viewModel/happening/withHappeningUserProps';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

export default withEnsureUserIsSignedIn(withHappeningUserProps(ServiceReservationDetails));
