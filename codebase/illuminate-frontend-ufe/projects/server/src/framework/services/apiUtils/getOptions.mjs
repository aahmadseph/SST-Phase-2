import {
    cookiesToString
} from '#server/services/utils/urlUtils.mjs';
import {
    getHeader
} from '#server/utils/responseHeaders.mjs';

import {
    API_REQUEST_TIMEOUT
} from '#server/config/envRouterConfig.mjs';

import {
    isUfeEnvLocal
} from '#server/config/envConfig.mjs';

function getApiOptions(host, port, urlPath, method = 'GET', apiOptions = {}, headersIn = {}) {

    const {
        headers,
        abTest,
        cacheKey,
        cacheTime,
        retryCount,
        retryResponseCodes,
        keepalive,
        maxRequestSize
    } = apiOptions;

    // delete the host header also
    delete headers?.host;

    const httpsHeaders = Object.assign({}, headers, headersIn);
    // overwrite the cookie header
    const cookieString = cookiesToString(getHeader(httpsHeaders, 'Cookie'), httpsHeaders['cookies-as-string']);
    httpsHeaders.cookie = cookieString;
    delete httpsHeaders['cookies-as-string'];
    delete httpsHeaders.Cookie;

    const options = {
        abTest: abTest,
        headers: httpsHeaders,
        host: host,
        hostname: host,
        port: port,
        method: method,
        path: urlPath,
        cacheKey: cacheKey,
        cacheTime: cacheTime,
        retryCount,
        retryResponseCodes,
        maxRequestSize,
        keepalive
    };

    if (isUfeEnvLocal) {
        if (apiOptions.ciphers) {
            // sometimes needed to specify ciphers as 'DEFAULT:@SECLEVEL=0';
            options['ciphers'] = apiOptions.ciphers;
        }

        if (typeof apiOptions.rejectUnauthorized !== 'undefined') {
            // default value is true so if you don't want this don't set it
            options['rejectUnauthorized'] = false;
        }
    }

    if (apiOptions.timeout && apiOptions.timeout > 0) {
        options['timeout'] = apiOptions.timeout;
    } else if (API_REQUEST_TIMEOUT > 0) {
        options['timeout'] = API_REQUEST_TIMEOUT;
    }

    return options;
}

export {
    getApiOptions
};
