import {
    resolve,
    basename
} from 'node:path';

import {
    getDiffTime,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    isCacheableRequest
} from '#server/framework/ufe/ufeUtils.mjs';
import {
    getMemoryCache
} from '#server/libs/memoryCache.mjs';
import {
    findWorker,
    initializeWorkers
} from '#server/framework/ufe/ufeWorkers.mjs';
import {
    emitter
} from '#server/framework/ufe/UFEEventEmitter.mjs';
import {
    updateErrors,
    updateMaxTimeInRequestQueue,
    updateMaxPayloadSinceLastCall
} from '#server/framework/ufe/status.mjs';
import {
    SUCCESS
} from '#server/framework/ufe/Constants.mjs';
import Constants from '#server/shared/Constants.mjs';
import {
    getRequestQueue
} from '#server/framework/ufe/ufeWorkers.mjs';
import processQueue from '#server/framework/ufe/processQueue.mjs';

const {
    EMPTY_DOCUMENT
} = Constants;
const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export async function setupWorkers() {

    // Initialize workers
    initializeWorkers(emitter);

    emitter.on('restarted', (data) => {
        if (getRequestQueue().length > 0) {
            logger.debug('Processing queue, after crashed worker restart.');
            processQueue(data.childIndex);
        }
    });
}

export async function sendToRenderWorker(options, data) {

    return new Promise((resolvePromise, reject) => {

        const {
            path: urlPath,
            headers
        } = options;

        headers['request-start-time'] = process.hrtime();
        headers.uniqueID = headers['request-id'];

        const cacheRequest = isCacheableRequest(urlPath);

        // data in memory return to caller
        const memCacheHit = (cacheRequest ? getMemoryCache(urlPath) : undefined);

        if (memCacheHit && memCacheHit.html) {
            logger.debug('Memory cache hit!');
            resolvePromise({
                data: memCacheHit.html,
                headers,
                statusCode: 200,
                requestCallTime: 0.0,
                compressionError: false
            });

            return;
        }

        emitter.addOneListener();
        emitter.autoAdjustListenerCount();
        emitter.once(urlPath, msg => {
            const queueTime = getDiffTime(headers['queue-entry-time']);

            logger.debug('In the emitter callback!');
            updateMaxTimeInRequestQueue(queueTime);
            headers['queue-time'] = queueTime;
            emitter.subtractOneListener();

            if (msg.type === SUCCESS) {
                logger.debug('Success in rendering HTML page!');
                resolvePromise({
                    data: msg.html,
                    headers,
                    statusCode: 200,
                    requestCallTime: 0.0,
                    compressionError: false
                });
            } else {
                updateErrors('response_422');
                const err = new Error(`Failed to render HTML for: ${urlPath}`);
                logger.debug(`ERROR in rendering HTML page! ${stringifyMsg}`);
                reject({   /* eslint-disable-line */
                    err: err,
                    data: EMPTY_DOCUMENT,
                    headers,
                    statusCode: 422,
                    requestCallTime: 0.0,
                    compressionError: false,
                    message: msg
                });
            }
        });

        const payload = [Buffer.from(data)];
        updateMaxPayloadSinceLastCall(payload.length);
        logger.debug(`POST data length = ${payload.length} for URL: ${urlPath} .`);
        findWorker(urlPath, headers, cacheRequest, payload, emitter);
    });
}

