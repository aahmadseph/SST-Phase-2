/* eslint-disable object-curly-newline */
import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FOUR_HOURS
} from '#server/services/utils/cacheTimes.mjs';
import {
    SEO_SERVICE_HOST,
    SEO_SERVICE_PORT
} from '#server/config/apiConfig.mjs';

// This will provide the SEO information for Buy Pages from SEO Service
export default function newSeoBuyPage(options) {
    // figure out the SEO name
    // if the last index of / returns -1 then we start at 0 :)

    const seoNameStart = options.buyPageUrl.lastIndexOf('/'),
        seoName = options.buyPageUrl.substring(seoNameStart + 1);
    const apiEndpoint = `/seo-service/util/v2/buyPages/${seoName}/seoName?loc=${options.language?.toLowerCase()}-${options.country}`;

    const apiOptions = Object.assign({}, options, {
        cacheKey: apiEndpoint,
        cacheTime: CACHE_FOUR_HOURS
    });


    return httpsRequest(SEO_SERVICE_HOST, SEO_SERVICE_PORT, apiEndpoint, 'GET', apiOptions);
}
