/* eslint-disable object-curly-newline */
import {
    httpRequest,
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FOUR_HOURS
} from '#server/services/utils/cacheTimes.mjs';
import {
    BROWSE_EXPERIENCE_HOST,
    BROWSE_EXPERIENCE_PORT
} from '#server/config/apiConfig.mjs';
import {
    ENABLE_HTTPS_FOR_BXS
} from '#server/config/envRouterConfig.mjs';

export default function getSiteMapDepartments(options = {
    country: 'US'
}) {

    // cache data for 4 hours
    const addCaching = Object.assign({}, options, {
        cacheTime: CACHE_FOUR_HOURS
    });
    const apiEndpoint = '/browseexpservice/v2/catalog/categories/all';

    if (ENABLE_HTTPS_FOR_BXS) {
        return httpsRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', addCaching);
    }
    return httpRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', addCaching);

}
