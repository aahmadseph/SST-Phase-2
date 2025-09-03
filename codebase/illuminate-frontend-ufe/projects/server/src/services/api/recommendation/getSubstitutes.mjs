import { httpsRequest } from '#server/services/utils/apiRequest.mjs';
import {
    SDN_API_HOST, SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
// import { CACHE_FIVE_MINUTES } from '#server/services/utils/cacheTimes.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

import {
    resolve,
    basename
} from 'path';

import Logger from '#server/libs/Logger.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Recommendation+Service

function getSubstitutes(options) {
    const {
        parseQuery, language, country, productId
    } = options;
    const url = `/v1/recommendation/substitution/${productId}`;
    let params = `?loc=${language}-${country}`;

    if (parseQuery.fulfillmentType) {
        params += `&fulfillmentType=${parseQuery.fulfillmentType}`;
    }

    if (parseQuery.storeId) {
        params += `&storeId=${parseQuery.storeId}`;
    }

    if (parseQuery.zipCode) {
        params += `&zipCode=${encodeURIComponent(parseQuery.zipCode)}`;
    }

    const endpoint = url + params;

    const logMsg = {
        description: 'Prepare Reco svc request',
        hostname: SDN_API_HOST,
        url: endpoint,
        'request-id': options.headers['request-id']
    };

    logger.info(stringifyMsg(logMsg));

    // const addCaching = Object.assign({}, options, {
    //     cacheKey: endpoint,
    //     cacheTime: CACHE_FIVE_MINUTES
    // });

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, endpoint, 'GET', options);
}

export default logAPICheck(getSubstitutes);
