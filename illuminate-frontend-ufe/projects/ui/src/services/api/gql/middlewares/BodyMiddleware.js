/* eslint-disable class-methods-use-this */

class BodyMiddleware {
    async request(context, next) {
        const { query: sha256Hash, operationName, variables = false } = context.options;
        const version = 1;
        // https://jira.sephora.com/browse/UA-2242
        context.body = {
            ...context.body,
            operationName,
            extensions: {
                persistedQuery: {
                    version,
                    sha256Hash
                }
            }
        };

        if (variables && typeof variables === 'object' && Object.keys(variables).length) {
            context.body = {
                ...context.body,
                variables
            };
        }

        return await next();
    }
}

export default BodyMiddleware;
