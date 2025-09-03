/* eslint-disable object-curly-newline */
import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    SHORT_CACHE
} from '#server/services/utils/cacheTimes.mjs';

export default function seo(options = {
    country: 'US'
}) {

    // figure out the SEO name
    // if the last index of / returns -1 then we start at 0 :)
    const seoNameStart = options.seoName.lastIndexOf('/'),
        seoName = options.seoName.substring(seoNameStart + 1);

    // 5 second cache
    const cacheOptions = Object.assign({}, options, {
        cacheTime: SHORT_CACHE
    });

    return ufeGet(`/v1/util/seo/${seoName}?countryCode=${options.country}`,
        options.headers,
        cacheOptions);
}
