/* eslint max-len: [2, 200], object-curly-newline: [2, { minProperties: 1 } ] */
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';

import * as urlModule from 'url';
import os from 'os';

import {
    createRequire
} from 'module';
const require = createRequire(import.meta.url);

import {
    getDiffTime,
    safelyParse,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    AUTOMATION_TARGETS,
    BUILD_INFO,
    BUILD_MODE,
    ENABLE_COMPONENT_CACHING,
    ENABLE_SEO,
    IMAGE_HOST,
    UFE_ENV,
    MAX_COMPONENT_MEMORY_ITEMS,
    PURGE_ITEM_PERCENT,
    SHOW_ROOT_COMPS,
    ENABLE_CANARY_RELEASE,
    AGENT_AWARE_SITE_ENABLED,
    UI_HOME
} from '#server/config/envConfig.mjs';
import {
    ROUTER_SERVER_PORT,
    ROUTER_SERVER_NAME
} from '#server/config/envRouterConfig.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const serverSuffix = /\.bwi40g\.vzbi\.caas/,
    PAGE_RENDER_TIME_MATCH = /\\?\"\[\[TEMPLATE_RENDER_TIME\]\]\\?\"/,
    GENERATED_RENDER_MATCH = /\[+(__SEPHORA_GENERATED_CSS__|__SEPHORA_GENERATED_IDS__)\]+/gi,
    QUESTIONMARK = /\?/g;

const isFrontEnd = (BUILD_MODE === 'frontend');

if (ENABLE_COMPONENT_CACHING) {
    // this value is set in the master process so we just get the value
    // and use whatever the master process tells us
    global.ssrMaxMemoryItems = MAX_COMPONENT_MEMORY_ITEMS;
    global.ssrPurgeItemsCount = Math.ceil(global.ssrMaxMemoryItems * PURGE_ITEM_PERCENT / 100);
    global.ssrComponentCache = new Map();
}

// configure babel from webpack
import getBabelLoader from '../../../../config/loaders/BabelLoader.mjs';
const {
    loader
} = getBabelLoader({
    root: true,
    isomorphic: true
});
const babelRegisterConfig = Object.assign({}, {
    ast: false
}, loader.use.options);
require('@babel/register')(babelRegisterConfig);
require('node-jsx-babel').install({
    extension: '.jsx'
});

const {
    extractCritical
} = require('@emotion/server');

global.Sephora = global.Sephora || {};
Sephora.buildMode = BUILD_MODE;
Sephora.imageHost = IMAGE_HOST;
Sephora.debug = {
    dataAt: function (name) {
        return Sephora.debug.displayAutomationAttr ? name : null;
    }
};
Sephora.debug.displayAutomationAttr = AUTOMATION_TARGETS;
Sephora.debug.showRootComps = SHOW_ROOT_COMPS;
Sephora.targeterNames = [];
Sephora.buildInfo = BUILD_INFO;
Sephora.isSEO = ENABLE_SEO;

Sephora.isCanaryRelease = ENABLE_CANARY_RELEASE;

// only do this on local
if (UFE_ENV === Constants.UFE_ENV_LOCAL) {
    if (ROUTER_SERVER_NAME && ROUTER_SERVER_PORT && ROUTER_SERVER_PORT !== 443) {
        logger.info(`Running local, so client side API calls will use host: ${ROUTER_SERVER_NAME} on port: ${ROUTER_SERVER_PORT}`);
        Sephora.host = ROUTER_SERVER_NAME;
        Sephora.sslPort = ROUTER_SERVER_PORT;
    }
}

const buildManifest = AGENT_AWARE_SITE_ENABLED ?
    require(`${UI_HOME}/dist/cjs/agent/manifest.json`) :
    require(`${UI_HOME}/dist/cjs/isomorphic/manifest.json`);
Sephora.mainBundlePath = buildManifest['main.js'];
Sephora.priorityChunkPath = buildManifest['priority.js'];
Sephora.componentsChunkPath = buildManifest['components.js'];
Sephora.commonsChunkPath = buildManifest['commons.js'];
Sephora.postloadChunkPath = buildManifest['postload.js'];

function mapTargeter(targeter) {
    return targeter.match(Constants.TARGETER_NAME_GROUPS)[2];
}

// node does not optimize code within a try catch
// by spliting this out into a function, node can now optimize this function
// by optimizing this function we can see what the slowdowns are in the code and clean them up
// however since this code can throw an error
// the processMessage still contains the try catch block
function renderContent(msg, InflatorRoot) {
    // parse this out into a more UI friendly version with protocol, path, query and so on
    let html = '';
    const now = process.hrtime();
    const location = urlModule.parse(msg.url, true);

    // for silly logging lets track the hash as well
    logger.silly(`Full post payload for ${location && location.query ? location.query.hash : ''} = ${msg.data}`);

    let serverSentURL = location.query.urlPath;

    if (!serverSentURL) {
        throw `Missing urlPath in ${msg.url} from ${msg.remoteHost}!`;
    }

    // do we have cachedQueryParams?  if so the URL then becomes the combo of the 2.
    if (location.query.cachedQueryParams) {
        serverSentURL = `${location.query.urlPath}?${location.query.cachedQueryParams.replace(QUESTIONMARK, '')}`;
    }

    if (msg['cat_or_mouse'] !== 'mouse') {
        logger.info(`It's a cat or undefined for cat or mouse: ${msg['cat_or_mouse']} and host: ${msg.remoteHost} for URL: ${location.query.urlPath}`);
    }

    serverSentURL = urlModule.parse(decodeURIComponent(serverSentURL));

    if (!isFrontEnd) {
        // find the targeters in the string as it is faster
        // than traversing a JSON tree
        let targeterNames = [];
        const targeterNamesRawData = msg?.data.match(Constants.TARGETER_NAMES);

        if (Array.isArray(targeterNamesRawData) && targeterNamesRawData.length > 0) {
            targeterNames = targeterNamesRawData.map(mapTargeter);
        }

        const childMemoryUsage = process.memoryUsage();

        const htmlStyleObj = extractCritical(InflatorRoot.inflate(safelyParse(msg?.data), Constants.INDEX_INJECTION, {
            hostname: (msg.hostname ? msg.hostname : '').replace(serverSuffix, ''),
            hash: location.query.hash,
            remoteHost: (msg.remoteHost ? msg.remoteHost : '').replace(serverSuffix, ''),
            renderQueryParams: location.query,
            location: serverSentURL,
            'cat_or_mouse': msg['cat_or_mouse'],
            logger: logger,
            stats: `PID:${process.pid},Memory:${stringifyMsg(childMemoryUsage)},LoadAverage:${stringifyMsg(os.loadavg())}`,
            targeterNames
        }));

        html = htmlStyleObj.html;

        const replacements = {
            '[[__SEPHORA_GENERATED_CSS__]]': htmlStyleObj.css,
            '[[__SEPHORA_GENERATED_IDS__]]': htmlStyleObj.ids
        };

        // always replace this even if it is not used :/
        html = html.replace(GENERATED_RENDER_MATCH, match => replacements[match]);

    } else {
        html = InflatorRoot.inflate(msg, location, Sephora, process, serverSentURL);
    }

    const renderTime = getDiffTime(now);
    html = html.replace(PAGE_RENDER_TIME_MATCH, renderTime * 1000);

    // only log this in verbose mode, but embed the data in the page regardless
    logger.verbose(`Template render time = ${renderTime} seconds. By worker pid ${process.pid}. For url ${msg.url}.`);

    // only log HTML if data has changed
    logger.silly(`Rendered HTML ${html}`);

    return {
        html,
        renderTime
    };
}

export default renderContent;
