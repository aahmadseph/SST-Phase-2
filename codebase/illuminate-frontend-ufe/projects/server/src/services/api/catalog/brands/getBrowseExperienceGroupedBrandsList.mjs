/* eslint-disable object-curly-newline */
import {
    httpRequest,
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FIVE_MINUTES
} from '#server/services/utils/cacheTimes.mjs';
import {
    BROWSE_EXPERIENCE_HOST,
    BROWSE_EXPERIENCE_PORT
} from '#server/config/apiConfig.mjs';
import {
    ENABLE_HTTPS_FOR_BXS
} from '#server/config/envRouterConfig.mjs';

export default function getGroupedBrandsList(options) {

    const locale = `${options.language}-${options.country}`;

    const channel = options.channel;
    const paramsString = `?ch=${channel}&loc=${locale}`;

    const apiEndpoint = `/browseexpservice/v2/catalog/groupedBrandsList${paramsString}`;

    const cacheOptions = Object.assign({}, options, {
        cacheKey: apiEndpoint,
        cacheTime: CACHE_FIVE_MINUTES
    });

    if (ENABLE_HTTPS_FOR_BXS) {
        return httpsRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', cacheOptions);
    }
    return httpRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', cacheOptions);
}
