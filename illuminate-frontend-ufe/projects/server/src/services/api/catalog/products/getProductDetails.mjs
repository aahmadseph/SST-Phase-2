/* eslint-disable object-curly-newline */
import {
    ufeGet
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FIVE_MINUTES
} from '#server/services/utils/cacheTimes.mjs';

const SEO_NAME_RE = /\w-[P]\d*/;

const STATIC_API_ARGS = {
    'includeRegionsMap': true,
    'showContent': true,
    'includeConfigurableSku': true,
    'sentiments': 6,
    'includeReviewFilters': true,
    'includeReviewImages': true
};
const STATIC_QUERY_PARAMS = Object.keys(STATIC_API_ARGS)
    .map(key => `${key}=${STATIC_API_ARGS[key]}`).join('&');

export default function getProductDetails(options = {
    country: 'US'
}) {

    const addCaching = Object.assign({}, options, {
        cacheTime: CACHE_FIVE_MINUTES
    });

    const useSEOName = SEO_NAME_RE.test(options.productUrl);

    let apiArgs = `countryCode=${options.country}`;

    if (options.includeCacheTag) {
        apiArgs += `&includeCacheTag=${options.includeCacheTag}`;
    }

    if (options.paramsString) {
        apiArgs += `&${options.paramsString}`;
    }

    const url = `/v2/catalog/products/${options.productUrl}${useSEOName ? '/seoName' : ''}?${apiArgs}&${STATIC_QUERY_PARAMS}`.replace(/\/\//g, '/');

    return ufeGet(url, options.headers, addCaching);
}
