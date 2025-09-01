/* eslint-disable object-curly-newline */
import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_THIRTY_MINUTES
} from '#server/services/utils/cacheTimes.mjs';

export default function getCategory(options = {
    country: 'US'
}) {

    // cache data for 4 hours
    const addCaching = Object.assign({}, options, {
        cacheTime: CACHE_THIRTY_MINUTES
    });

    return ufeGet(`/v1/catalog/media/${options.mediaId}?countryCode=${options.country}&includeRegionsMap=true`,
        options.headers,
        addCaching);
}
