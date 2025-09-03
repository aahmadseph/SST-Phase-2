import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_THIRTY_MINUTES
} from '#server/services/utils/cacheTimes.mjs';
import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    resolve,
    basename
} from 'path';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

// Logger
const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function getServicesEDPData(options) {
    const {
        language = 'en',
        country = 'US',
        channel = 'RWD',
        sdnAccessToken,
        activityId
    } = options;

    const locale = `${language.toLowerCase()}-${country}`;

    const endpoint = `/v2/happening/services/${activityId}?locale=${locale}&channel=${channel}&country=${country}`;

    const apiOptions = {
        ...options,
        cacheKey: endpoint,
        cacheTime: CACHE_THIRTY_MINUTES
    };
    const headers = {
        authorization: `Bearer ${sdnAccessToken}`
    };

    logger.debug(`Fetching Services EDP with following data: ${stringifyMsg({
        sdnAccessToken,
        endpoint,
        apiOptions,
        headers
    })}`);

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, endpoint, 'GET', apiOptions, {}, headers);
}
