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

export default function getCategory(options) {

    const apiEndpoint = `/browseexpservice/v2/catalog/categories/${options.categoryId}?countryCode=${options.country}${options.params ? '&' + options.params: ''}`;

    const cacheOptions = Object.assign({}, options, {
        cacheKey: apiEndpoint,
        cacheTime: CACHE_FIVE_MINUTES
    });

    if (ENABLE_HTTPS_FOR_BXS) {
        return httpsRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', cacheOptions);
    }
    return httpRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', cacheOptions);
}
