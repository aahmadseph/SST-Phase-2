import { gqlClient } from 'services/api/gql/gqlClient';
import { CustomerLimitQuery } from 'constants/gql/queries/profile/customerLimit.gql';

const customerLimitQuery = async (loyaltyId, currency) => {
    const options = {
        headers: { 'x-source': 'ufe' },
        operationName: 'CustomerLimitQuery',
        query: CustomerLimitQuery,
        variables: { request: { loyaltyId, currency } }
    };

    const { customerLimit } = await gqlClient.query(options);

    return customerLimit || null;
};

export default customerLimitQuery;
