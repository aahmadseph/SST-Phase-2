/* eslint-disable object-curly-newline */
import {
    httpRequest,
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    CACHE_THIRTY_MINUTES
} from '#server/services/utils/cacheTimes.mjs';
import {
    CONTENTFUL_HOST,
    CONTENTFUL_PORT
} from '#server/config/apiConfig.mjs';
import {
    SDN_API_HOST,
    SDN_API_PORT,
    ENABLE_HTTPS_FOR_CXS
} from '#server/config/envRouterConfig.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

const apiSEOPathMap = {
    '/': '/home/',
    '/creditcard-apply': '/creditcard/apply',
    '/profile/creditcard': '/creditcard',
    '/profile/beautyinsider': '/beautyinsider',
    '/beautyinsider': '/beautyinsider'
};

function getCMSPageData(options) {

    const {
        country = 'US',
        channel = 'RWD',
        language = 'en',
        apiPath,
        useSDN,
        sdnAccessToken
    } = options;

    const seoPath = apiSEOPathMap[apiPath.toLowerCase()] || apiPath;

    const prefix = useSDN ? '' : '/content-page-exp';
    // &env=ufe-dev

    const apiEndpoint = `${prefix}/v1/content${seoPath}?ch=${channel}&loc=${language}-${country?.toUpperCase()}`;

    const apiOptions = Object.assign({}, options, {
        cacheKey: apiEndpoint,
        cacheTime: CACHE_THIRTY_MINUTES
    });

    if (useSDN) {
        const headers = {
            authorization: `Bearer ${sdnAccessToken}`
        };

        return httpsRequest(SDN_API_HOST, SDN_API_PORT, apiEndpoint, 'GET', apiOptions, {}, headers);
    }

    if (ENABLE_HTTPS_FOR_CXS) {
        return httpsRequest(CONTENTFUL_HOST, CONTENTFUL_PORT, apiEndpoint, 'GET', apiOptions);
    }
    return httpRequest(CONTENTFUL_HOST, CONTENTFUL_PORT, apiEndpoint, 'GET', apiOptions);
}

export default logAPICheck(getCMSPageData);
