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

export default function getStoreDetailsPageData(options) {
    const {
        country = 'US',
        channel = 'RWD',
        language = 'en',
        sdnAccessToken,
        activityId = '',
        isRedesignEDPEnabled = true
    } = options;

    const endpoint = `/v1/happening/stores/${activityId}?channel=${channel}&locale=${language}-${country}&country=${country}&isRedesignEDPEnabled=${isRedesignEDPEnabled}`;

    const apiOptions = {
        ...options,
        cacheKey: endpoint,
        cacheTime: CACHE_THIRTY_MINUTES
    };
    const headers = {
        authorization: `Bearer ${sdnAccessToken}`
    };

    logger.debug(`Fetching store details with following data: ${stringifyMsg({
        endpoint,
        apiOptions,
        headers
    })}`);

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, endpoint, 'GET', apiOptions, {}, headers);
}
