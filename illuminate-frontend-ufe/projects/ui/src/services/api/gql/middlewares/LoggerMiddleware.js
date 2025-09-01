/* eslint-disable class-methods-use-this */
import { GraphQLException } from 'exceptions';
import { isUfeEnvQA } from 'utils/Env';
import stringUtils from 'utils/String';

const API_CALL_DATA_DUMP = '{0} [GraphQL] Data dump for {1} operation:\n';
const API_CALL_END = '{0} [GraphQL] API request execution time for operation {1}: {2}ms';
const API_CALL_ERROR = '{0} [GraphQL] API call {1} failed with error:\n';
const API_CALL_START = '{0} [GraphQL] Starting API request for {1} ...';

class LoggerMiddleware {
    async request(context, next) {
        if (isUfeEnvQA || Sephora.logger.isVerbose) {
            const { operationName } = context.options;
            try {
                const startTime = performance.now();
                Sephora.logger.info(stringUtils.format(API_CALL_START, startTime, operationName));

                const result = await next();

                const duration = performance.now() - startTime;
                Sephora.logger.info(stringUtils.format(API_CALL_END, performance.now(), operationName, duration));
                Sephora.logger.info(stringUtils.format(API_CALL_DATA_DUMP, performance.now(), operationName), result);

                return result;
            } catch (exception) {
                if (exception instanceof GraphQLException) {
                    Sephora.logger.info(`${exception.cause}\n`, exception);
                } else {
                    Sephora.logger.info(stringUtils.format(API_CALL_ERROR, performance.now(), operationName), exception);
                }

                throw exception;
            }
        } else {
            return await next();
        }
    }
}

export default LoggerMiddleware;
