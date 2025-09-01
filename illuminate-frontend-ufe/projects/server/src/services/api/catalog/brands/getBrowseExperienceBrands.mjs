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

export default function getBrowseExperienceBrands(options) {

    const locale = `${options.language}-${options.country}`;
    const channel = options.channel;
    let paramString = options.paramsString ? '&' + options.paramsString : '';
    const catSEOName = options.catSEOName ? '&categorySeoName=' + options.catSEOName : '';
    paramString += `&ch=${channel}&loc=${locale}`;

    const apiEndpoint = `/browseexpservice/v2/catalog/brands/${options.seoBrandUrl}?countryCode=${options.country}&includeRegionsMap=true${catSEOName}${paramString}&content=true`;

    const cacheOptions = Object.assign({}, options, {
        cacheKey: apiEndpoint,
        cacheTime: CACHE_FIVE_MINUTES
    });

    if (ENABLE_HTTPS_FOR_BXS) {
        return httpsRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', cacheOptions);
    }
    return httpRequest(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiEndpoint, 'GET', cacheOptions);
}
