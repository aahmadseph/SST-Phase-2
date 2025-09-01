import { GraphQLException } from 'exceptions';
// prettier-ignore
import {
    BodyMiddleware,
    CacheMiddleware,
    ErrorsMiddleware,
    FetchMiddleware,
    HeadersMiddleware,
    LoggerMiddleware
} from 'services/api/gql/middlewares';

class GraphQLClient {
    constructor() {
        // prettier-ignore
        this.middlewares = [
            new LoggerMiddleware(),
            new CacheMiddleware(),
            new ErrorsMiddleware(),
            new HeadersMiddleware(),
            new BodyMiddleware(),
            new FetchMiddleware()
        ];
    }

    async executePersistentOperation(options) {
        const context = { headers: [], body: {}, options };
        const _middlewares = this.middlewares;
        let index = 0;

        async function next() {
            if (index < _middlewares.length) {
                const currentMiddleware = _middlewares[index];
                index++;

                return await currentMiddleware.request(context, next);
            }

            return null;
        }

        return await next();
    }

    async query(options) {
        try {
            if (!options.operationName) {
                throw new GraphQLException('"operationName" field is required');
            }

            if (!options.query) {
                throw new GraphQLException('"query" field is required');
            }

            const response = await this.executePersistentOperation(options);
            const { data } = response;

            return data;
        } catch (exception) {
            if (exception instanceof GraphQLException) {
                throw exception;
            } else {
                throw new GraphQLException(exception);
            }
        }
    }
}

export const gqlClient = new GraphQLClient();
