/* eslint-disable object-curly-newline */
import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_ONE_HOUR
} from '#server/services/utils/cacheTimes.mjs';

export default function urlMapping(options = {
    country: 'US'
}) {

    // 5 second cache
    const cacheOptions = Object.assign({}, options, {
        cacheTime: CACHE_ONE_HOUR
    });

    // NOTE in case of redirect the response is supplied with the following headers
    // Cache-Control: no-cache, no-store, must-revalidate
    // Pragma: no-cache
    // Expires: 0
    return ufeGet(`/v1/util/urlMapping?seoName=${options.pathname}`,
        options.headers,
        cacheOptions);
}
