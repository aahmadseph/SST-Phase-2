import {
    request
} from 'https';
import {
    resolve,
    basename
} from 'path';

import {
    getBodyBuffer,
    cookiesToString
} from '#server/services/utils/urlUtils.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    ERROR_404
} from '#server/services/utils/Constants.mjs';
import {
    ROUTER_SERVER_PORT,
    ROUTER_SERVER_NAME
} from '#server/config/envRouterConfig.mjs';
import {
    isUfeEnvLocal
} from '#server/config/envConfig.mjs';
import {
    getError
} from '#server/utils/serverUtils.mjs';
import {
    getHeader,
    removeHeader
} from '#server/utils/responseHeaders.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

function filterHeaders(headersIn) {
    const headersOut = Object.assign({}, headersIn);
    delete headersOut['server'];
    delete headersOut['transfer-encoding'];
    delete headersOut['date'];

    return headersOut;
}

export default function proxyRequest(proxyHost, proxyPort, req, response, requestUrl, options = {}) {

    if (!isUfeEnvLocal) {
        sendTempRedirect(response, undefined, ERROR_404);

        return;
    }

    const parsedUrl = new URL(`https://${proxyHost}${requestUrl}`);
    const urlPath = `${parsedUrl.pathname}${parsedUrl.search}`;

    // since this is a proxy, some API are picky :/
    // so we want to fake some headers
    const headers = Object.assign({}, req.headers, {
        host: proxyHost,
        hostname: proxyHost,
        referer: `https://${proxyHost}`,
        origin: `https://${proxyHost}`
    });

    // proxy options
    const xoptions = {
        host: proxyHost,
        hostname: proxyHost,
        port: proxyPort,
        method: req.method,
        path: urlPath,
        headers: headers
    };

    // put the right cookies in the headers
    xoptions.headers.cookie = cookiesToString(req.apiOptions.headers['Cookie'], req.apiOptions.headers['cookies-as-string']);

    // our cookies are so big they are causing issues :)
    // for images we can remove cookies
    if (options.removeCookies) {
        const cookieHeaders = getHeader(xoptions.headers, 'Cookie');
        if (cookieHeaders) {
            removeHeader(xoptions.headers, 'Cookie');
        }
    }

    const connection = getHeader(xoptions.headers, 'Connection');
    if (connection && connection.toLowerCase() === 'keep-alive') {
        removeHeader(xoptions.headers, 'Connection');
    }

    // caller can choose to NOT reject unauthorized
    if (typeof options.rejectUnauthorized !== 'undefined') {
        xoptions.rejectUnauthorized = false;
    }

    if (typeof options.ciphers !== 'undefined') {
        xoptions.ciphers = options.ciphers;
    }

    // in the event the port is different
    if (options.port) {
        xoptions.port = options.port;
    }

    // proxy requests
    logger.verbose(`Proxy URL: ${req.url} <=> host: ${proxyHost} port: ${xoptions.port} path: ${urlPath} method: ${xoptions.method}`);
    const proxy = request(xoptions, httpResponse => {

        // replace the header for location :/
        const proxiedHeaders = filterHeaders(httpResponse.headers);

        if (httpResponse.headers['location']) {
            const futureLocation = (httpResponse.headers['location'].startsWith('http:') ||
                httpResponse.headers['location'].startsWith('https:') ?
                httpResponse.headers['location'] :
                `https://${ROUTER_SERVER_NAME}:${ROUTER_SERVER_PORT}${httpResponse.headers['location']}`);
            proxiedHeaders['location'] = futureLocation;
            logger.verbose(`HTTP location: ${proxiedHeaders['location']}.`);
        }

        logger.debug(`HTTP Status code: ${httpResponse.statusCode} for URL: ${req.url}.`);
        response.writeHead(httpResponse.statusCode, proxiedHeaders);
        httpResponse.on('data', piece => {
            response.write(piece);
            logger.debug('Chunk received!');
        });
        httpResponse.on('error', e => {
            logger.error(`Proxy response URL: ${urlPath} => error: ${getError(e)}`);
            sendTempRedirect(response, undefined, ERROR_404);
        });
        httpResponse.on('end', () => {
            logger.debug('Sending results!');
            response.end();
        });
    });

    // basic error handling
    proxy.on('error', e => {
        logger.error(`Proxy URL: ${urlPath} => error: ${getError(e)}`);
        sendTempRedirect(response, undefined, ERROR_404);
    });

    // POST or PUT need the body
    if (req.method === 'POST' || req.method === 'PUT') {
        const data = getBodyBuffer(req);
        logger.verbose(`Data sent is: ${data}`);
        proxy.end(data);
    } else {
        proxy.end();
    }
}
