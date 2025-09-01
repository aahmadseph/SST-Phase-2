/* eslint-disable class-methods-use-this */
import { GraphQLException } from 'exceptions';
import Empty from 'constants/empty';
import stringUtils from 'utils/String';

const ERROR_MESSAGE = '{0} [GraphQL] API call returned error: {1}';
const NO_ERROR_MESSAGE = 'Error message was not provided for the error';

// This middleware exists for the sole purpose of throwing an exception when an error is returned from the API.
// GraphQL backend errors are returned in the `errors` array of the response object with HTTP response code 200.
class ErrorsMiddleware {
    async request(_context, next) {
        const result = await next();
        const { errors = Empty.Array } = result;

        if (errors.length) {
            const firstError = errors[0];
            const errorMessage = stringUtils.format(ERROR_MESSAGE, performance.now(), firstError.message || NO_ERROR_MESSAGE);

            throw new GraphQLException(errorMessage);
        }

        return result;
    }
}

export default ErrorsMiddleware;
