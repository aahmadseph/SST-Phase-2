import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { CACHE_TWENTY_FOUR_HOURS } from '#server/services/utils/cacheTimes.mjs';

function getBrands(options) {
    const url = '/v2/profile/catalog/brands';
    const cacheOptions = Object.assign({}, options, {
        cacheKey: url,
        cacheTime: CACHE_TWENTY_FOUR_HOURS
    });

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', cacheOptions);
}

export default logAPICheck(getBrands);
