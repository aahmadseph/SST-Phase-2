import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_THIRTY_MINUTES
} from '#server/services/utils/cacheTimes.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    SEO_SERVICE_HOST,
    SEO_SERVICE_PORT
} from '#server/config/apiConfig.mjs';

function getSEOMetadata(params) {
    return stringifyMsg({
        'query': `query SEOMetadata($url: String, $locale: String, $channel: String) {
        redirect(url: $url, locale: $locale, channel: $channel) {
        url
        type
    }
    seo(url: $url, locale: $locale)
    }`,
        'variables': {
            'url': `${params.url}`,
            'locale': `${params.locale}`,
            'channel': `${params.channel}`
        },
        'operationName': 'SEOMetadata'
    });
}

export default function getSEOPageData(options) {
    const params = {
        url: options.seoURL,
        locale: `${options.language.toLowerCase()}-${options.country.toUpperCase()}`,
        channel: options.channel
    };
    const postData = getSEOMetadata(params);
    const endpoint = '/seo-service/graphql';
    const cacheKey = `${endpoint}?seoUrl=${params.url}&ch=${params.channel}&loc=${params.locale}`;
    const apiOptions = Object.assign({}, options, {
        cacheKey: cacheKey,
        cacheTime: CACHE_THIRTY_MINUTES,
        isCacheablePost: true
    });

    return httpsRequest(SEO_SERVICE_HOST, SEO_SERVICE_PORT, endpoint, 'POST', apiOptions, postData);
}
