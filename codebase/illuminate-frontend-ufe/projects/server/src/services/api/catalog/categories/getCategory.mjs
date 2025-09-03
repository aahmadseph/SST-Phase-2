/* eslint-disable object-curly-newline */
import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FIVE_MINUTES
} from '#server/services/utils/cacheTimes.mjs';

export default function getCategory(options = {
    country: 'US'
}) {

    // cache data for 4 hours
    const addCaching = Object.assign({}, options, {
        cacheTime: CACHE_FIVE_MINUTES
    });

    return ufeGet(`/v1/catalog/categories/${options.categoryId}?countryCode=${options.country}${options.params ? '&' + options.params: ''}`,
        options.headers,
        addCaching);
}
