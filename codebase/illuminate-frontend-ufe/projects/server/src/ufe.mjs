/* eslint no-shadow: 0 */
/*
 * WORKERS=1 node ufe.js
 *
 * - Set uncaught exceptions to log....? or restart
 * - Wrap template assembly in try.. catch..? does this have performance implications?
 */
import http from 'http';
import os from 'os';
import zlib from 'zlib';
import crypto from 'node:crypto';
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';

import {
    getMemoryCache,
    dumpMemoryCache,
    getPurgeItemsCount
} from '#server/libs/memoryCache.mjs';
import {
    initPrometheusClient,
    getPrometheusMetrics,
    setupHistogram,
    setupCounter,
    simplifyRoute
} from '#server/libs/prometheusMetrics.mjs';
import {
    WritableStream
} from '#server/libs/WritableStream.mjs';
import DevNull from '#server/libs/NullStream.mjs';
import {
    sendOKResponse
} from '#server/utils/sendOKResponse.mjs';
import {
    AGENT_AWARE_SITE_ENABLED,
    BUILD_MODE,
    DISABLE_COMPRESSION,
    ENABLE_GC_COLLECTION,
    ENABLE_SEO,
    ENABLE_PREVIEW,
    HOSTNAME,
    IMAGE_HOST,
    LOG_GC_PROFILE,
    MAX_REQUEST_SIZE,
    MAX_MEMORY_ITEMS,
    MEMOIZE,
    NODE_ENV,
    PURGE_ITEM_PERCENT,
    REQUEST_COUNT_TO_LOG,
    SERVER_PORT,
    SERVER_IP_ADDR,
    STATUS_LOG_TIME,
    UFE_ENV,
    WORKERS,
    UFE_SLOW_TIME
} from '#server/config/envConfig.mjs';
import {
    getDiffTime,
    gcLogging,
    memoryUsageLogging,
    getBuildInfo,
    getError,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    emitter
} from '#server/framework/ufe/UFEEventEmitter.mjs';
import {
    JSON_CONTENT_TYPE,
    PROMETHEUS_APP_NAME
} from '#server/framework/ufe/Constants.mjs';
import {
    formatBuildInfo,
    logResponseFinish,
    isCacheableRequest
} from '#server/framework/ufe/ufeUtils.mjs';
import {
    addResponseListener,
    getWorkerBeeKeys,
    findWorker,
    getRequestQueue,
    initializeWorkers,
    deleteListenerMapItem,
    getListenerMap,
    findWorkerByUniqueId
} from '#server/framework/ufe/ufeWorkers.mjs';
import {
    getServerStatus,
    getLastStatusCalledTime,
    updateErrors,
    updateRequestProcessingTime,
    updateMaxPayloadSinceLastCall
} from '#server/framework/ufe/status.mjs';
import processQueue from '#server/framework/ufe/processQueue.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const baseDir = process.cwd();

initPrometheusClient(PROMETHEUS_APP_NAME);

const httpRequestDurationMicroseconds = setupHistogram('http_server_requests_seconds', 'Duration of HTTP requests in microseconds'),
    httpRequestCounts = setupCounter('http_post_request_counts', 'Counter for HTTP POST requests to either render or not render');

const buildInfo = getBuildInfo();

// must have ascii art :P
logger.info(`${os.EOL}
 _   _ _____ _____
| | | | ____| ____|
| | | |  _| |  _|
| |_| | |   | |___
|_____|_|   |_____|
`, {
    'noJSONParse': true
});

const buildData = formatBuildInfo(buildInfo);

// es6 template strings are delicious!
logger.info(`Start cluster with: ${WORKERS} workers on Server Port: ${SERVER_PORT} with hostname: ${HOSTNAME}.
    Build Mode: ${BUILD_MODE}
    MEMOIZE: ${MEMOIZE}
    Disable Compression: ${DISABLE_COMPRESSION}
    Max Request Size: ${MAX_REQUEST_SIZE}
    LOG_GC_PROFILE: ${LOG_GC_PROFILE}
    ENABLE_GC_COLLECTION: ${ENABLE_GC_COLLECTION}
    LOG_LEVEL: ${logger.level}
    IMAGE_HOST: ${IMAGE_HOST}
    NODE_ENV: ${NODE_ENV}
    UFE Environment: ${UFE_ENV}
    CWD: ${baseDir}
    ${buildData}
    Agent Aware Site Enable: ${AGENT_AWARE_SITE_ENABLED}
    SEO Enable: ${ENABLE_SEO}
    Preview Enable: ${ENABLE_PREVIEW}
    Request Count to Log: ${REQUEST_COUNT_TO_LOG}
    Max memory key size: ${MAX_MEMORY_ITEMS}
    Percent of items to purge ${PURGE_ITEM_PERCENT} vs count ${getPurgeItemsCount()}`);

// memory debug logging for memory leak checking
if (ENABLE_GC_COLLECTION) {
    gcLogging(logger, ENABLE_GC_COLLECTION);
} else if (LOG_GC_PROFILE) {
    memoryUsageLogging(logger, LOG_GC_PROFILE);
}

// Initialize workers
initializeWorkers(emitter);

// so sometimes when a worker crashes or all the workers crash we end up not processing the queue
// while a new request could come in, there would be a bunch of requests stuck in the queue
// this ensures that we process the queue through the rest of the workers
emitter.on('restarted', (data) => {
    if (getRequestQueue().length > 0) {
        logger.debug('Processing queue, after crashed worker restart.');
        processQueue(data.childIndex);
    }
});

function dumpData(request, response, memCacheHit, cacheRequest) {

    const {
        headers,
        url
    } = request;

    // so it turns out we HAVE to read in the request, but in tloggerhis case
    // we can pump to dev null and not reatain anything in memory
    // if we DON'T do this then the client may receive an error
    // like EPIPE or ECONNRESET
    request.pipe(new DevNull())
        .once('error', () => {
            logger.error(`Hash cache key resulted in server error for URL: ${url}.`);
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.end();
        })
        .once('finish', () => {
            request.headers['data-read-time'] = getDiffTime(request.headers['request-start-time']);
            sendOKResponse(headers, url, response, memCacheHit['html'], cacheRequest, true);
        });
    logger.debug(`Hash cache key HIT for URL: ${url} from ${(headers['ufe_data_host'] || headers['UFE_DATA_HOST'])}.`);

}

function processPost(request, response) {

    const {
        headers,
        url
    } = request;

    // for each request we can do this check once instead of multiple times and then pass it around
    const cacheRequest = isCacheableRequest(url);

    // use this if we are sending a hash
    // if the memory item is uncompressed we can send it and even if we have
    // a gzip header it will get compressed,
    // however if the item is compressed and the gzip header does not match
    // then we need to not send this item
    const memCacheHit = (cacheRequest ? getMemoryCache(url) : undefined);

    if (memCacheHit && memCacheHit['html']) {
        dumpData(request, response, memCacheHit, cacheRequest);
    } else {

        // use a writable stream to collect the data
        const PostCollector = new WritableStream();

        // check to see if the data being sent is compressed
        const isCompressed = (headers[Constants.CONTENT_ENCODING_HEADER_LC]?.includes('gzip') ||
            headers[Constants.CONTENT_ENCODING_HEADER]?.includes('gzip')) || false;

        // if data is compressed we can pipe to gunzip
        const pipes = (isCompressed ? request.pipe(zlib.createGunzip()).pipe(PostCollector) :
            request.pipe(PostCollector));

        // the advantage of streams is pipes :)
        // the stream will emit an error event if too much data is sent to it
        // it will emit that event with the length of the data that it received before stopping
        pipes.once('error', (err) => {
            logger.warn(`Error occured while reading in POST data: ${getError(err)} for URL: ${url}. Request not being processed.`);
            response.writeHead(413, {
                'Content-Type': 'text/plain'
            });
            response.end();
            request.connection.destroy();
            updateErrors('response_413');
        }).once('finish', () => {
            headers['data-read-time'] = getDiffTime(headers['request-start-time']);

            // queryData is finished loadin
            const queryData = PostCollector.getBuffers();
            const payloadLength = PostCollector.getLength();
            updateMaxPayloadSinceLastCall(payloadLength);
            logger.debug(`POST data length = ${payloadLength} for URL: ${url} .`);

            addResponseListener(response, headers, url, emitter);
            findWorker(url, headers, cacheRequest, queryData, emitter);
        });
    }
}

// Create a server
function processRequest(request, response) {

    const {
        headers,
        method,
        url
    } = request;

    if (method === 'POST' && url.indexOf('/templateResolver?') === 0 && url.indexOf('urlPath') > -1) {
        headers['request-start-time'] = process.hrtime();
        const requestID = headers['request-id'] ? `-${headers['request-id']}`: '';
        headers.uniqueID = `${crypto.randomUUID()}${requestID}`;
        const end = httpRequestDurationMicroseconds.startTimer();
        logger.verbose(`Request processing time start ${headers['request-start-time']} seconds for ${url}.`);
        httpRequestCounts.inc();
        let isAlreadyFinished = false;
        const finishHandler = () => {

            const listenerMap = getListenerMap();
            const listener = listenerMap[headers.uniqueID];
            if (listener) {
                // if we are falling into this code
                // then it is likely that the finish event was not called
                // which means the event listener was never fired
                // so we need to clean up this listener
                const countBefore = emitter.listenerCount(listener.key);
                emitter.off(listener.key, listener.callback);
                deleteListenerMapItem(headers.uniqueID);
                const countAfter = emitter.listenerCount(listener.key);
                logger.warn(stringifyMsg({
                    msg: 'Event not fired! Attempting to remove event listener.',
                    countBefore,
                    countAfter,
                    'request-id': headers['request-id'] || 'no-id-cat',
                    'uniqueID': headers.uniqueID
                }));
                // if we are here then it is possible some data is in the queue
                // this function will find that worker and remove the data from
                // any queue
                findWorkerByUniqueId(headers.uniqueID);
            }

            if (isAlreadyFinished) {
                return;
            }
            isAlreadyFinished = true;
            const requestProcessingTime = getDiffTime(headers['request-start-time']);
            updateRequestProcessingTime(requestProcessingTime);
            const processingTimeData = {
                'Request-processing-time-took': requestProcessingTime,
                'url': url,
                'render-time': headers['render-time'] || 0.0,
                'queue-time': headers['queue-time'] || 0.0,
                'time-to-ipc': headers['to-ipc-time'] || 0.0,
                'ipc-time': headers['ipc-time'] || 0.0,
                'request-id': headers['request-id'] || 'no-id-cat',
                'data-read-time': headers['data-read-time'] || 0.0,
                'x-akamweb': headers['x-akamweb'] || 'no-cookie',
                'uniqueID': headers.uniqueID
            };

            if (requestProcessingTime > UFE_SLOW_TIME) {
                logger.warn(processingTimeData);
            }

            logResponseFinish();
            end({
                route: simplifyRoute(url),
                code: response.statusCode,
                method: method
            });
            request.destroy();
        };
        response.once('finish', finishHandler);
        response.once('close', finishHandler);
        processPost(request, response);
    } else if (method === 'GET' && url === '/status') {
        const statusData = getServerStatus(buildInfo);
        response.writeHead(200, {
            'Content-Type': JSON_CONTENT_TYPE
        });
        response.end(statusData);
    } else if (method === 'GET' && url === '/metrics') {
        getPrometheusMetrics(request, response);

        // for prometheus enabled system log status data every 5 minutes
        const logStatusData = (!!(!getLastStatusCalledTime() ||
            (new Date().getTime() - getLastStatusCalledTime().getTime() > STATUS_LOG_TIME)));

        if (logStatusData) {
            logger.info(getServerStatus(buildInfo));
        }
    } else if (method === 'GET' && url.toLowerCase() === '/healthcheck') {
        if (getWorkerBeeKeys().length === 0) {
            response.writeHead(500, {
                'Content-Type': JSON_CONTENT_TYPE
            });
            response.end('{"healthCheck":"ERROR","statusCode":500,"errorMessage":"No workers left!"}');
        } else {
            response.writeHead(200, {
                'Content-Type': JSON_CONTENT_TYPE
            });
            response.end('{"healthCheck":"OK","statusCode":200}');
        }

        logger.info('UFE /healthcheck called');
    } else if (UFE_ENV !== Constants.UFE_ENV_PRODUCTION && method === 'GET' && url === '/dumpMemoryItems') {
        const memoryItems = dumpMemoryCache(request);
        // not a cachable response
        response.writeHead(200, {
            'Content-Type': JSON_CONTENT_TYPE
        });
        response.end(memoryItems);
    } else {
        logger.verbose(`Request has invalid URL ${request.url}, sending 404 response.`);
        updateErrors('response_404');

        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.end();
    }
}

const server = http.createServer(processRequest);

if (SERVER_IP_ADDR) {
    server.listen(SERVER_PORT, SERVER_IP_ADDR);
} else {
    server.listen(SERVER_PORT);
}

// Handle uncaught Exceptions by closing the process and allowing kubernets to restart
process.on('uncaughtException', (err) => {
    logger.error(` uncaughtException: ${err.message}`);
    logger.error(err.stack);
    process.exit(1);
});

// for testing this we export the process post
export {
    server,
    process
};

logger.info(`Server listening on port ${SERVER_PORT}.`);
