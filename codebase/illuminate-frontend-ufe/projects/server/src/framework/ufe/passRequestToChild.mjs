import {
    resolve,
    basename
} from 'path';
import {
    StringDecoder
} from 'string_decoder';

import {
    setMemoryCache,
    getMemoryCache,
    MEMORY_SET_SUCCESSFULLY
} from '#server/libs/memoryCache.mjs';
import {
    FRAMEWORK_CONSTANTS
} from '#server/config/envConfig.mjs';
import {
    getMax,
    getDiffTime
} from '#server/utils/serverUtils.mjs';
import {
    sendToWorker
} from '#server/framework/ufe/ufeUtils.mjs';
import {
    SUCCESS,
    DEFAULT_ENCODING
} from '#server/framework/ufe/Constants.mjs';
import {
    HOSTNAME
} from '#server/config/envConfig.mjs';
import {
    ERROR
} from '#server/framework/ufe/Constants.mjs';
import {
    getWorkerBees
} from '#server/framework/ufe/ufeWorkers.mjs';
import {
    updateMaxTimeInRequestQueue
} from '#server/framework/ufe/status.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const decoder = new StringDecoder(DEFAULT_ENCODING);

let maxTimeToIPC = 0,
    rendersSinceLastCall = 0;

function updateWorkerQueueData(workerBees, childIndex) {

    workerBees[childIndex].queue.forEach(item => {
        // these items spent 0 time rendering and 0 ipc time
        // however they spend more time in queue
        item.requestData.headers['render-time'] = 0.0;
        item.requestData.headers['ipc-time'] = 0.0;

        // they spent all their time in the queue waiting
        const queueTime = getDiffTime(item.requestData.headers['queue-entry-time']);
        updateMaxTimeInRequestQueue(queueTime);
        item.requestData.headers['queue-time'] = queueTime;

        // this is total time to IPC, but they did not render as that was handled by another job
        const timeToIPCDiff = getDiffTime(item.requestData.headers['request-start-time']);
        maxTimeToIPC = getMax(timeToIPCDiff, maxTimeToIPC);
        item.requestData.headers['to-ipc-time'] = timeToIPCDiff;
    });
}

export async function passRequestToChild(childIndex, requestData, cacheAbleRequest, queryData, emitter) {

    const workerBees = getWorkerBees();
    const {
        url: requestUrl,
        headers
    } = requestData;

    // use this if we are sending a hash
    // if the memory item is uncompressed we can send it and even if we have
    // a gzip header it will get compressed,
    // however if the item is compressed and the gzip header does not match
    // then we need to not send this item
    const memCacheHit = (cacheAbleRequest ? getMemoryCache(requestUrl) : undefined);

    if (memCacheHit && memCacheHit['html']) {
        const queueTime = getDiffTime(headers['queue-entry-time']);
        updateMaxTimeInRequestQueue(queueTime);
        headers['queue-time'] = queueTime;

        // this should include time in the queue
        const timeToIPC = getDiffTime(headers['request-start-time']);
        maxTimeToIPC = getMax(timeToIPC, maxTimeToIPC);
        headers['to-ipc-time'] = timeToIPC;

        logger.debug(`Another worker has already done this work! ${requestUrl}`);
        emitter.emit(requestUrl, {
            headers: headers,
            type: SUCCESS,
            html: memCacheHit['html'],
            compressed: memCacheHit['compressed'],
            cacheRequest: cacheAbleRequest
        });

        return Promise.resolve(childIndex);
    }

    logger.debug(`Worker at index "${childIndex}" is busy? ${workerBees[childIndex].busy}. Doing work on ${requestUrl} .`);

    const queueTime = getDiffTime(headers['queue-entry-time']);
    updateMaxTimeInRequestQueue(queueTime);
    headers['queue-time'] = queueTime;

    // this may include time in the queue
    const timeToIPCDiff = getDiffTime(headers['request-start-time']);
    maxTimeToIPC = getMax(timeToIPCDiff, maxTimeToIPC);
    headers['to-ipc-time'] = timeToIPCDiff;

    workerBees[childIndex].busy = true;
    workerBees[childIndex].requestUrl = requestUrl;

    workerBees[childIndex].sendStartTime = process.hrtime();

    const postData = {
        url: requestUrl,
        data: decoder.write(Buffer.concat(queryData)),
        hostname: HOSTNAME,
        encoding: (headers['accept-encoding'] || headers['Accept-Encoding']),
        remoteHost: (headers['ufe_data_host'] || headers['UFE_DATA_HOST']),
        'cat_or_mouse': (headers['cat_or_mouse'] || headers['CAT_OR_MOUSE'] || 'cat')
    };

    return sendToWorker(postData, childIndex, requestUrl)
        .then((message) => {
            const {
                html,
                renderTime,
                ipcTime
            } = message;

            // don't cache results from this
            if (cacheAbleRequest && !message.headers && message.compressed) {
                const setMemorySuccess = setMemoryCache(requestUrl, html);

                if (MEMORY_SET_SUCCESSFULLY === setMemorySuccess) {
                    logger.debug(`Template rendered ${childIndex}. Setting memory cache ${requestUrl}.`);
                } else {
                    logger.debug(`Duplicate template rendered occured ${childIndex} ${requestUrl}.`);
                }
            }

            headers['render-time'] = renderTime;
            headers['ipc-time'] = ipcTime;
            rendersSinceLastCall++;

            updateWorkerQueueData(workerBees, childIndex);

            emitter.emit(requestUrl, {
                headers: headers,
                type: SUCCESS,
                html: html,
                responseOptions: message.headers,
                compressed: message.compressed,
                cacheRequest: cacheAbleRequest
            });
            workerBees[childIndex].queue = [];

            return childIndex;

        }, (message) => {

            headers['render-time'] = message.renderTime;
            headers['ipc-time'] = message.ipcTime;

            updateWorkerQueueData(workerBees, childIndex);

            // If rendering this data caused the child to blow up
            // assume all requests in queue will have same issue so reject ALL
            emitter.emit(requestUrl, {
                headers: headers,
                type: ERROR,
                html: FRAMEWORK_CONSTANTS.EMPTY_DOCUMENT
            });

            workerBees[childIndex].queue = [];

            if (message.exception) {
                logger.verbose(`Err 422: ${message.exception}`);

                return Promise.reject(message.exception);
            } else {
                return childIndex;
            }
        });
}

export const getMaxTimeToIPC = () => maxTimeToIPC;

export const getRendersSinceLastCall = () => rendersSinceLastCall;

export const resetMaxTimeCounters = () => {
    maxTimeToIPC = 0;
    rendersSinceLastCall = 0;
};
