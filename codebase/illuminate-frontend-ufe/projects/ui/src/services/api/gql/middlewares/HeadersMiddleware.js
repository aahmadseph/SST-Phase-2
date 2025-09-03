/* eslint-disable class-methods-use-this */
import { GraphQLException } from 'exceptions';
import { isUfeEnvLocal } from 'utils/Env';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import stringUtils from 'utils/String';

const ERROR_MESSAGE = '{0} [GraphQL] Unable to make GraphQL API call without a valid JWT token';
const AUTHRIZATION_HEADER_MASK = 'Bearer {0}';
const HttpHeader = {
    ContentType: 'Content-Type',
    GraphQLClientName: 'Apollographql-Client-Name',
    GraphQLClientVersion: 'Apollographql-Client-Version',
    Authorization: 'Authorization',
    XAPIKey: 'X-Api-Key'
};
const CLIENT_NAME = 'UFE_CLIENT';
let { BUILD_NUMBER = 1 } = Sephora.buildInfo;

if (isUfeEnvLocal) {
    BUILD_NUMBER = 1;
}

class HeadersMiddleware {
    async request(context, next) {
        const jwt = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

        if (!jwt) {
            throw new GraphQLException(stringUtils.format(ERROR_MESSAGE, performance.now()));
        }

        const headers = {
            [HttpHeader.ContentType]: 'application/json',
            // https://jira.sephora.com/browse/UA-2241
            [HttpHeader.GraphQLClientName]: CLIENT_NAME,
            [HttpHeader.GraphQLClientVersion]: BUILD_NUMBER,
            // https://jira.sephora.com/browse/SBR-271
            [HttpHeader.Authorization]: stringUtils.format(AUTHRIZATION_HEADER_MASK, jwt),
            // Unconditionally in projects/ui/src/services/api/ufeApi.js => makeSingleRequest
            // we send only these 2 headers: X-Api-Key and Seph-Access-Token
            // Seph-Access-Token is not used here as we already send JWT in Authorization header
            [HttpHeader.XAPIKey]: Sephora.configurationSettings.sdnUfeAPIUserKey
        };

        // New custom/conditional logic goes here...

        context.headers = {
            ...headers,
            ...context.options.headers
        };

        return await next();
    }
}

export default HeadersMiddleware;
