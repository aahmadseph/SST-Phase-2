import { gqlClient } from 'services/api/gql/gqlClient';
import { GuestBookingClientDetails } from 'constants/gql/queries/happening/guestBookingClientDetails.gql';

const guestBookingClientDetails = async confirmationId => {
    const options = {
        headers: { 'x-source': 'ufe' },
        operationName: 'GuestBookingClientDetails',
        query: GuestBookingClientDetails,
        variables: {
            guestBookingClientDetailsInput: {
                confirmationId: confirmationId
            }
        }
    };

    const response = await gqlClient.query(options);

    return response || null;
};

export default guestBookingClientDetails;
