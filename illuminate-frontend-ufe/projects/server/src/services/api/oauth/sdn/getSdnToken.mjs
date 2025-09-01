import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    SDN_AUTH_CONFIG
} from '#server/config/sdnConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    resolve,
    basename
} from 'path';

// Logger
const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const getSdnToken = async function (options = {}) {
    const lookupKey = options.clientName ? options.clientName : options.channel;

    if (!lookupKey) {
        logger.error('getSdnToken: lookupKey is undefined. Aborting token request.');
        throw new Error('lookupKey is undefined. Aborting token request.');
    }

    const {
        authClientSecret,
        authClientId
    } = SDN_AUTH_CONFIG[lookupKey] || {};

    if (!authClientSecret || !authClientId) {
        logger.error(`getSdnToken: Missing auth credentials for lookupKey: ${lookupKey} | clientName: ${options.clientName} | channel: ${options.channel}`);
        throw new Error(`Missing auth credentials for lookupKey: ${lookupKey} | clientName: ${options.clientName} | channel: ${options.channel}`);
    }

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const data = `client_id=${authClientId}&client_secret=${authClientSecret}&grant_type=client_credentials`;

    logger.debug(`Fetching token from API /v1/oauth2/token with below POST data: ${stringifyMsg(data)}`);

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, '/v1/oauth2/token', 'POST', options, data, headers);
};

export default getSdnToken;
