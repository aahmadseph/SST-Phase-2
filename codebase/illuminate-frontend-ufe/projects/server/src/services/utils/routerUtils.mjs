import fs from 'fs';
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';

import proxyRequest from '#server/services/utils/proxyRequest.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    APPLICATION_NAME,
    UI_HOME
} from '#server/config/envConfig.mjs';
import {
    PROXY_HOST,
    PROXY_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    JERRI_APPLICATION_NAME,
    JERRI_APPLICATION_CHANNELS,
    JERRI_NONE_PAGE_ROUTES,
    WOODY_NONE_PAGE_ROUTES,
    WOODY_APPLICATION_CHANNELS,
    STATIC_ASSETS
} from '#server/config/Constants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const baseDir = process.cwd();

const HEALTHCHECK_URLS = /^\/(status|metrics|healthcheck|health)$/;
const ACTUATOR_CHECKS = /actuator\/health/;

const CA_EN_BASE_URL_RE = /^\/ca\/(en|fr)/,
    TRAILING_SLASH_RE = /\\/g;

const NONE_PAGE_ROUTES = (JERRI_APPLICATION_NAME === APPLICATION_NAME ?
    JERRI_NONE_PAGE_ROUTES : WOODY_NONE_PAGE_ROUTES);

const APPLICATION_CHANNELS = APPLICATION_NAME === JERRI_APPLICATION_NAME ?
    JERRI_APPLICATION_CHANNELS : WOODY_APPLICATION_CHANNELS;

function cleanRequestPath(pathIn) {
    try {
        const results = decodeURIComponent(pathIn)
            .replace(CA_EN_BASE_URL_RE, '')
            .replace(TRAILING_SLASH_RE, '');

        return (results.length > 0 ? results : '/');
    } catch (e) {
        logger.error(stringifyMsg(e));

        return pathIn;
    }
}

function filterHeaders(headersIn) {
    const headersOut = Object.assign({}, headersIn);
    delete headersOut['server'];
    delete headersOut['transfer-encoding'];
    delete headersOut['date'];

    return headersOut;
}

function inputHeaderFilter(headersIn) {
    const headersOut = Object.assign({}, headersIn);
    delete headersOut['pragma'];
    delete headersOut['cache-control'];
    delete headersOut['esconder-pragma'];
    delete headersOut['x-im-imagemanagerrequired'];
    delete headersOut['request-start-time'];
    delete headersOut['origin'];
    delete headersOut['referer'];
    delete headersOut['host'];
    Object.keys(headersOut).forEach(key => {
        if (key.startsWith('sec-')) {
            delete headersOut[key];
        }
    });

    return headersOut;
}

function sendLocalFile(request, response, contentType, options = {}) {
    if (contentType) {
        response.setHeader('Content-Type', contentType);
    }

    response.setHeader('status', 200);
    let filepath = request.path;

    if (filepath.indexOf('js/ufe') > -1) {
        filepath = `${UI_HOME}/${filepath.replace(/\/js\/ufe/, 'dist/cjs')}`;
    } else if (filepath.indexOf('img/ufe') > -1) {
        filepath = `${UI_HOME}/${filepath.replace(/\/img\/ufe/, 'img')}`;
    } else if (options.fileLocation) {
        filepath = `${baseDir}/${options.fileLocation}`;
    }

    fs.createReadStream(filepath)
        .on('error', (err) => {
            // we don't need to log shape
            if (request.path.indexOf('sephora_common.js') < 0) {
                logger.warn(`${request.path}=> ${err}`);
            }

            proxyRequest(PROXY_HOST, PROXY_PORT, request, response, request.url, {
                rejectUnauthorized: options.rejectUnauthorized,
                removeCookies: true
            });
        })
        .pipe(response);
}

function isHealthcheckURL(url) {
    return url.match(HEALTHCHECK_URLS) || url.match(ACTUATOR_CHECKS);
}

function isNonePageRoute(url) {
    return url.match(NONE_PAGE_ROUTES) || url.match(STATIC_ASSETS);
}

function getApplicationChannels() {
    return APPLICATION_CHANNELS;
}

export {
    isNonePageRoute,
    getApplicationChannels,
    sendLocalFile,
    filterHeaders,
    inputHeaderFilter,
    isHealthcheckURL,
    cleanRequestPath
};
