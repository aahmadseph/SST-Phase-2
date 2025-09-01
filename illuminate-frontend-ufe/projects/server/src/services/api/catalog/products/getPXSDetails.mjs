/* eslint-disable object-curly-newline */
import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_FIVE_MINUTES
} from '#server/services/utils/cacheTimes.mjs';
import {
    PRODUCT_EXPERIENCE_HOST,
    PRODUCT_EXPERIENCE_PORT
} from '#server/config/apiConfig.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

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
    const useSEOName = SEO_NAME_RE.test(options.productUrl);

    let apiArgs = `countryCode=${options.country}`;

    if (options.preferedSku && parseInt(options.preferedSku) > 0) {
        apiArgs += `&preferedSku=${parseInt(options.preferedSku)}`;
    }

    if (options.includeCacheTag) {
        apiArgs += `&includeCacheTag=${options.includeCacheTag}`;
    }

    if (options.paramsString) {
        apiArgs += `&${options.paramsString}`;
    }

    const ch = options.channel ? options.channel : CHANNELS.RWD;
    const locAndCh = `&loc=${options.language}-${options.country}&ch=${ch}`;
    const includeRnR = '&includeRnR=true';
    const url = `/productgraph/v3/catalog/products/${options.productUrl}${useSEOName ? '/seoName' : ''}?${apiArgs}&${STATIC_QUERY_PARAMS}${locAndCh}${includeRnR}`.replace(/\/\//g, '/');
    const headers = {
        'x-ufe-request': true,
        'x-requested-source': CHANNELS.RWD
    };

    const addCaching = Object.assign({}, options, {
        cacheKey: url,
        cacheTime: CACHE_FIVE_MINUTES
    });


    return httpsRequest(PRODUCT_EXPERIENCE_HOST, PRODUCT_EXPERIENCE_PORT, url, 'GET', addCaching, {}, headers);
}
