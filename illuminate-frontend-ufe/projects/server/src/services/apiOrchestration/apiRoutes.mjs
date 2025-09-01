import {
    resolve,
    basename
} from 'path';

import {
    filterHeaders,
    inputHeaderFilter
} from '#server/services/utils/routerUtils.mjs';
import {
    httpRequest,
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';

import proxyRequest from '#server/services/utils/proxyRequest.mjs';
import {
    getBodyBuffer
} from '#server/services/utils/urlUtils.mjs';
import {
    BROWSE_EXPERIENCE_HOST,
    BROWSE_EXPERIENCE_PORT,
    CONTENTFUL_HOST,
    CONTENTFUL_PORT,
    SEARCH_EXPERIENCE_HOST,
    SEARCH_EXPERIENCE_PORT,
    AUTH_EXPERIENCE_HOST,
    AUTH_EXPERIENCE_PORT,
    PRODUCT_EXPERIENCE_HOST,
    PRODUCT_EXPERIENCE_PORT
} from '#server/config/apiConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    PROXY_HOST,
    PROXY_PORT,
    ENABLE_HTTPS_FOR_BXS,
    ENABLE_HTTPS_FOR_CXS
} from '#server/config/envRouterConfig.mjs';
import {
    isUfeEnvLocal
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const API_PREFIX = /^\/api/;

function getAPIURL(inurl, prefix) {
    return (inurl.match(API_PREFIX) ?
        inurl.replace(API_PREFIX, prefix) :
        `${prefix}${inurl}`).replace(/\/\//g, '/');
}

function callProxy(request, response, e = {}) {
    logger.error(`ERROR calling API: ${request.url}! Will try to proxy request. ERROR: ${stringifyMsg(e)}`);
    const originalURL = request.url.match(API_PREFIX) ? request.url : '/api' + request.url;
    proxyRequest(PROXY_HOST, PROXY_PORT, request, response, originalURL, {
        rejectUnauthorized: false
    });
}

function callBXSAPI(request, response) {
    const apiURL = getAPIURL(request.url, '/browseexpservice'),
        bodyData = getBodyBuffer(request);
    const apiCallFn = ENABLE_HTTPS_FOR_BXS ? httpsRequest : httpRequest;
    apiCallFn(BROWSE_EXPERIENCE_HOST, BROWSE_EXPERIENCE_PORT, apiURL, request.method,
        request.apiOptions, bodyData, inputHeaderFilter(request.headers)).then(results => {
        response.writeHead(200, filterHeaders(results.headers));
        response.end(results.data);
    }).catch(_e => {
        logger.error(`ERROR calling API: ${apiURL}! Will try to proxy request.`);
        proxyRequest(PROXY_HOST, PROXY_PORT, request, response, request.url, {
            rejectUnauthorized: false
        });
    });
}

function callCMSAPI(request, response) {
    const apiURL = getAPIURL(request.url, '/content-page-exp/v1'),
        bodyData = getBodyBuffer(request);
    const apiCallFn = ENABLE_HTTPS_FOR_CXS ? httpsRequest : httpRequest;
    apiCallFn(CONTENTFUL_HOST, CONTENTFUL_PORT, apiURL, request.method,
        request.apiOptions, bodyData, inputHeaderFilter(request.headers)).then(results => {
        response.writeHead(200, filterHeaders(results.headers));
        response.end(results.data);
    }).catch(e => {
        callProxy(request, response, e);
    });
}

function callAPIGet(request, response) {
    callProxy(request, response);
}

function callSearchAPI2Get(request, response) {
    const apiURL = getAPIURL(request.url, '/searchexpservice'),
        bodyData = getBodyBuffer(request);
    httpRequest(SEARCH_EXPERIENCE_HOST, SEARCH_EXPERIENCE_PORT, apiURL, request.method,
        request.apiOptions, bodyData, inputHeaderFilter(request.headers)).then(results => {
        response.writeHead(200, filterHeaders(results.headers));
        response.end(results.data);
    }).catch(e => {
        callProxy(request, response, e);
    });
}

function callProductAPIGet(request, response) {
    const apiURL = getAPIURL(request.url, '/productgraph'),
        bodyData = getBodyBuffer(request);

    httpRequest(PRODUCT_EXPERIENCE_HOST, PRODUCT_EXPERIENCE_PORT, apiURL, request.method,
        request.apiOptions, bodyData, inputHeaderFilter(request.headers)).then(results => {
        response.writeHead(200, filterHeaders(results.headers));
        response.end(results.data);
    }).catch(e => {
        callProxy(request, response, e);
    });
}

function callAuthAPIPost(request, response) {
    const apiURL = getAPIURL(request.url, '/').replace(/^\/auth/, '/authentication-service'),
        bodyData = getBodyBuffer(request);
    const options = Object.assign({}, request.apiOptions, {
        rejectUnauthorized: false
    });
    const headers = Object.assign({}, inputHeaderFilter(request.headers));
    headers['Content-Type'] = 'application/json';
    httpRequest(AUTH_EXPERIENCE_HOST, AUTH_EXPERIENCE_PORT, apiURL, request.method,
        options, bodyData, headers).then(results => {
        response.writeHead(200, filterHeaders(results.headers));
        response.end(results.data);
    }).catch(e => {
        callProxy(request, response, e);
    });
}

function callAPIPost(request, response) {
    callProxy(request, response);
}

function addAPIRoutes(app) {

    // api setups for simple api routes

    if (isUfeEnvLocal) {
        app.get('/api/util/location{*splat}', function (request, response) {
            // apiOptions.parseQuery is defaulted to empty object
            const params = Object.keys(request.apiOptions.parseQuery);

            if (params.length === 0) {
                // no parameters add location identifier for city
                request.url = `${request.url}?locationIdentifier=City`;
            } else if (!params['locationIdentifier']) {
                // parameters but no location identifier
                request.url = `${request.url}&locationIdentifier=City`;
            }

            // no edgescape header so add SF
            if (!request.headers['X-Akamai-Edgescape']) {
                request.headers['X-Akamai-Edgescape'] = 'City=SF';
            }

            callAPIGet(request, response);
        });
    }

    app.get('/api/v2/catalog/categories/{*splat}', callBXSAPI);

    app.get('/api/v2/catalog/brands/{*splat}', callBXSAPI);

    app.post('/api/auth/v1/{*splat}', callAuthAPIPost);

    app.get('/api/content/{*splat}', callCMSAPI);

    app.get('/api/v2/catalog/search/{*splat}', callSearchAPI2Get);

    app.get('/api/v3/catalog/products/{*splat}', callProductAPIGet);

    app.get('/api/{*splat}', callAPIGet);

    // everything other than GET
    app.all('/api/{*splat}', callAPIPost);
}

export {
    callAPIGet,
    callAPIPost,
    addAPIRoutes
};
