import { gqlClient } from 'services/api/gql/gqlClient';
import { ReservationSensitiveDetails } from 'constants/gql/queries/happening/reservationSensitiveDetails.gql';

const reservationSensitiveDetails = async confirmationId => {
    const options = {
        headers: { 'x-source': 'ufe' },
        operationName: 'ReservationSensitiveDetails',
        query: ReservationSensitiveDetails,
        variables: { confirmationId: confirmationId }
    };

    const response = await gqlClient.query(options);

    return response || null;
};

export default reservationSensitiveDetails;
