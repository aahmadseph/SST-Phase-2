import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FOUR_HOURS
} from '#server/services/utils/cacheTimes.mjs';

export default function buyPage(options = {
    country: 'US'
}) {

    // figure out the SEO name
    // if the last index of / returns -1 then we start at 0 :)
    const seoNameStart = options.buyPageUrl.lastIndexOf('/'),
        seoName = options.buyPageUrl.substring(seoNameStart + 1);

    // four hours cache
    const cacheOptions = Object.assign({}, options, {
        cacheTime: CACHE_FOUR_HOURS
    });

    return ufeGet(`/v1/util/buyPages/${seoName}/seoName`,
        options.headers,
        cacheOptions);
}
