import {
    cleanRequestPath
} from '#server/services/utils/routerUtils.mjs';
import {
    getHeader
} from '#server/utils/responseHeaders.mjs';
import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';
import {
    resolve,
    basename
} from 'path';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

function decodePath(urlIn) {
    try {
        return decodeURI(urlIn);
    } catch (e) {
        logger.warn(`Failed calling decodeURI ${urlIn}`);

        return urlIn;
    }
}

function getXAkamwebValue(request) {
    // if we get an x-akamweb header in the request then let's pass that around in apiOptions
    // if we do not and we have cookie then use cookie
    let xAkamwebValue = request.headers['x-akamweb'] || '';

    if (request.cookies) {
        if (xAkamwebValue && !request.cookies[COOKIES_NAMES.AKAMWEB]) {
            request.cookies[COOKIES_NAMES.AKAMWEB] = xAkamwebValue;
        } else if (request.cookies[COOKIES_NAMES.AKAMWEB]) {
            xAkamwebValue = request.cookies[COOKIES_NAMES.AKAMWEB];
        }
    }

    if (xAkamwebValue && xAkamwebValue.trim().length > 1) {
        xAkamwebValue = xAkamwebValue.trim().substring(0, 1);
    }

    return xAkamwebValue;
}

// allowed
// A-Za-z0123456789-._~:/?#[]@!$&'()*+,;=
const ALLOWED_URL_VALUES_RE = /[A-Za-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]/g;

// script in the URL path
// examples
//    /shop/lipstick<script>
//    /shop/lipstick<script....>
//    /shop/lipstick</script ...>
//    /shop/lipstick<script ....>
//    /shop/lipstick</script>
const SCRIPT_TAG_REDIRECT_RE = /<[\/]?script(.)*>/g;

export default function apiOptionsMiddleware(appName) {

    const DEFAULT_USER_AGENT = `Nodezilla/1.0 ${appName} app main`;

    return (request, response, next) => {

        const {
            cookies,
            query,
            headers,
            apiOptions: options
        } = request;

        // TODO channel, country and language parsing
        const deviceType = (cookies[COOKIES_NAMES.DEVICE_TYPE] &&
            cookies[COOKIES_NAMES.DEVICE_TYPE] === 'desktop' ? 'FS' : 'MW');

        const xAkamwebValue = getXAkamwebValue(request);

        const apiOptions = {
            channel: deviceType,
            url: request.url,
            apiPath: cleanRequestPath(request.path),
            isMockedResponse: false,
            isHealthcheck: false,
            referer: getHeader(headers, 'Referer'),
            headers: {
                'User-Agent': getHeader(headers, 'User-Agent') || DEFAULT_USER_AGENT,
                'host': getHeader(headers, 'Host') || 'localhost',
                'Accept': getHeader(headers, 'Accept') || 'text/plain, text/html;q=0.9, */*;q=0.1',
                'Accept-Encoding': getHeader(headers, 'Accept-Encoding') || 'identity',
                'Accept-Language': getHeader(headers, 'Accept-Language') || 'en_us',
                // treat cookies as object and serialize later when we need it as string
                'Cookie': cookies || {},
                'cookies-as-string': getHeader(headers, 'Cookie') || '',
                'request-id': getHeader(headers, 'request-id'),
                'x-akamweb': xAkamwebValue
            },
            parseQuery: query || {}
        };

        const apiOptionsPathParts = apiOptions.apiPath.split('/');

        if (apiOptionsPathParts.length === 0) {
            // we should not get here
            // if we do get here set page to homepage
            apiOptions.apiPath = '/';
        }

        request.apiOptions = Object.assign({}, options, apiOptions);

        // tackling <script> or <script> or </script> or </script> send to 404
        const decodeURLPath = decodePath(request.url);
        const isMatch = decodeURLPath.match(SCRIPT_TAG_REDIRECT_RE);

        if (isMatch && isMatch.length > 0) {
            // redirect to 404
            sendTempRedirect(response, `Incoming URL ${decodeURLPath} has invalid <script> or </script> tags character in the URL`);

            return;
        }

        const decodeURIPath = decodePath(apiOptions.apiPath),
            cleaneddecodeURIPath = decodeURIPath.match(ALLOWED_URL_VALUES_RE).join('');

        if (decodeURIPath !== cleaneddecodeURIPath) {
            // logging weird stuff
            // so far product URLs are the only ones they put a pipe in
            const isProductURL = apiOptions.apiPath.startsWith('/product/') && apiOptions.apiPath.includes('|');

            if (!isProductURL) {
                logger.warn(`Incoming URL: ${apiOptions.apiPath} has possible invalid URL characters, could cause API problems`);
            }
        }

        // properly encodeURI apiPath
        const encodeURIdUrl = encodeURI(apiOptions.apiPath),
            currentUrl = apiOptions.apiPath;
        request.apiOptions.apiPath = (decodeURIPath === currentUrl ? encodeURIdUrl : currentUrl);
        logger.debug(`Paths: decodeURId: ${decodeURIPath} Current: ${currentUrl} encodeURId: ${encodeURIdUrl} API Options: ${request.apiOptions.apiPath}`);

        // recommend not using request.url or request.path in code and using
        // request.apiOptions.apiPath
        // request.apiOptions.url
        // we clean these up and they can be made safe from hackers
        request.apiOptions.url = request.apiOptions.apiPath + request.url.substring(request.path.length);
        next();
    };
}
