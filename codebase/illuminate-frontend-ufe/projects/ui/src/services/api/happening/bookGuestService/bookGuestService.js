import { gqlClient } from 'services/api/gql/gqlClient';
import { guestBookingService } from 'constants/gql/mutations/happening/guestBookingService.gql';

const bookGuestServiceMutation = async variables => {
    const options = {
        headers: { 'x-source': 'ufe' },
        operationName: 'guestBookingService',
        query: guestBookingService,
        variables: {
            guestBookingServiceInput: variables
        }
    };

    const response = await gqlClient.query(options);

    return response || null;
};

export default bookGuestServiceMutation;
