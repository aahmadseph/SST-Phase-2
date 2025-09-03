/* eslint-disable object-curly-newline */
import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FOUR_HOURS
} from '#server/services/utils/cacheTimes.mjs';

export default function getBIOptions(options = {
    country: 'US'
}) {

    // 5 second cache
    const cacheOptions = Object.assign({}, options, {
        cacheTime: CACHE_FOUR_HOURS
    });

    return ufeGet(`/v1/util/biOptions?countryCode=${options.country}`,
        options.headers,
        cacheOptions);
}
