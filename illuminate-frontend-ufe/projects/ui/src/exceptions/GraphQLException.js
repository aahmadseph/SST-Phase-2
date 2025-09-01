import ApplicationException from 'exceptions/ApplicationException';

/**
 * @description Generic exception for any GraphQL API calls
 *
 * @class GraphQLException
 *
 * @extends {ApplicationException}
 */
class GraphQLException extends ApplicationException {
    constructor(exception) {
        super('An error has occurred while executing the GraphQL query or mutation. For details see the inner exception.', {
            cause: exception
        });

        this.name = 'GraphQLException';
    }
}

export default GraphQLException;
