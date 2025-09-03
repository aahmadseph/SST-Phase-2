// import { GetErrorResponse } from 'constants/gql/queries/tests.gql';
import { GetAllStoresIds } from 'constants/gql/queries/tests.gql';
import { gqlClient } from 'services/api/gql/gqlClient';

const getAllStoresIds = async () => {
    let result = [];

    try {
        const options = {
            query: GetAllStoresIds,
            variables: {
                // Arguments for the query goes in this object
            },
            context: {
                // Headers specific only for this API call
                // should be defined like in this example
                headers: {
                    'X-Custom-Header': 'CustomHeaderValue'
                }
            }
        };
        result = await gqlClient.query(options);

        return result;
    } catch {
        return result;
    }
};

export default getAllStoresIds;
