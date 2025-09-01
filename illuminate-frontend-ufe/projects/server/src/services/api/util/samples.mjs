import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    SHORT_CACHE
} from '#server/services/utils/cacheTimes.mjs';

export default function samples(options = {
    country: 'US'
}) {

    const cacheOptions = Object.assign({}, options, {
        cacheTime: SHORT_CACHE
    });

    return ufeGet(`/v1/util/samples?countryCode=${options.country}`,
        options.headers,
        cacheOptions);
}
