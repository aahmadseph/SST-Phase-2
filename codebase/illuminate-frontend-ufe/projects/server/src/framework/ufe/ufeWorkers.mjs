import * as childProcess from 'child_process';
import process from 'node:process';
import {
    resolve,
    basename
} from 'path';
import {
    SUCCESS,
    ALL_WORKERS_BUSY,
    ANOTHER_WORKER_PROCESSING_REQUEST,
    RESTART_SIGNALS
} from '#server/framework/ufe/Constants.mjs';
import {
    updateErrors
} from '#server/framework/ufe/status.mjs';
import {
    getBuildInfo
} from '#server/utils/serverUtils.mjs';
import {
    SERVER_HOME,
    WORKER_STAGGER_INTERVAL,
    WORKERS
} from '#server/config/envConfig.mjs';
import {
    passRequestToChild
} from '#server/framework/ufe/passRequestToChild.mjs';
import {
    logPromiseErrors,
    sendOKResponse
} from '#server/utils/sendOKResponse.mjs';
import processQueue from '#server/framework/ufe/processQueue.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';
import {
    setupCounter
} from '#server/libs/prometheusMetrics.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const workerBees = {};
let workerBeeKeys = [];
const requestQueue = [];
const listenerMap = {};

const childCrashes = setupCounter('template_child_crashes_counts', 'Counter for when the template child process restarts');

export const getListenerMap = () => listenerMap;
export const deleteListenerMapItem = item => {
    delete listenerMap[item];
};

export const getWorkerBees = () => workerBees;

export const getWorkerBeeKeys = () => workerBeeKeys;

const shuffleWorkerbeeKeys = () => {
    const firstKey = workerBeeKeys.shift();
    workerBeeKeys.push(firstKey);
};

export const getRequestQueue = () => requestQueue;

export const addToRequestQueue = item => {
    requestQueue.push(item);
};

export function addWorker(index, emitter, buildInfo) {

    let debug = false;

    if (process.execArgv.indexOf('--inspect') !== -1) {
        process.execArgv.push('--inspect=' + (10000 + index + 1));
        debug = true;
    }

    const srcBasePath = resolve(SERVER_HOME, 'src');

    workerBees[index] = childProcess.fork(`${srcBasePath}/template_child.mjs`, [index], {
        env: Object.assign({}, buildInfo, process.env),
        args: index
    });

    logger.info(`Forking worker with pid ${workerBees[index].pid}. Inspect = ${debug}.`);

    workerBees[index].queue = [];

    workerBees[index].once('exit', function (code, signal) {
        logger.error(`Worker Exited:: error:${code} signal:${signal} pid:${workerBees[index].pid}.`);

        // prometheus tracking of child process crashes
        childCrashes.inc();

        // we crashed we want to make sure no listeners are hanging around
        workerBees[index].removeAllListeners();

        delete workerBees[index];

        // SyntaxError, TypeError, RangeError and other errors like that
        // all fall into a error code of 1
        // one little drawback is that some stuff we do in babel for node target version
        // if we have a signal then it was killed intentionally
        // ONLY SIGHUP should still restart
        // also exits with status code 1 :(

        const shouldRestart = ((signal === null || code === null ||
            RESTART_SIGNALS.includes(signal)) && code !== 0);

        if (shouldRestart) {
            addWorker(index, emitter, buildInfo);
            logger.info(`Resuscitating dead worker @ ${index} from code ${code}`);
        }

        updateErrors('childExitErrorCount');

        // update reference if a worker dies
        workerBeeKeys = Object.keys(workerBees);

        if (workerBeeKeys.length === 0) {
            // if we are here then addWorker has not been called
            // and there are no more child worker process
            logger.error('All workers are dead! Parent process exiting!');
            throw ('No workers exception!');
        }

        // really it only makes sense to emit this if a worker is restarted
        if (shouldRestart && requestQueue.length > 0) {
            // let's fire an event for anyone who is listening
            // and let them know a worker has been restarted... useful!
            emitter.emit('restarted', {
                childIndex: index
            });
        }
    });

    // keep reference to the worker bees keys for quicker lookups
    workerBeeKeys = Object.keys(workerBees);
}

export function initializeWorkers(emitter) {
    const buildInfo = getBuildInfo();

    // start child worker threads aka template child
    // Initialize workers
    let startupStaggerTime = 0;

    for (let i = 0; i < WORKERS; ++i) {
        setTimeout(() => {
            addWorker(i, emitter, buildInfo);
        }, startupStaggerTime);
        startupStaggerTime += WORKER_STAGGER_INTERVAL;
    }
}

export function findWorkerByUniqueId(uniqueID) {

    const findItem = ({ requestData }) => (requestData?.headers?.uniqueID && requestData?.headers?.uniqueID === uniqueID);

    const index = requestQueue.findIndex(findItem);

    if (index !== -1) {
        requestQueue.splice(index, 1);
        logger.info(`Item found at index: ${index} and removed from requestQueue.`);
        return;
    }

    for (let i = 0, end = workerBeeKeys.length; i < end; i++) {
        const bee = workerBees[getWorkerBeeKeys()[i]];

        let found = false;
        if (bee.queue.length > 0) {
            const queueIndex = bee.queue.findIndex(findItem);
            if (queueIndex !== -1) {
                bee.queue.splice(queueIndex, 1);
                found = true;
                logger.info(`Item found at index: ${queueIndex} and removed from worker bee: ${i}.`);
            }
        }
        if (found) {
            break;
        }
    }
}

export function addResponseListener(response, headers, url, emitter) {

    if (!listenerMap[headers.uniqueID]) {
        listenerMap[headers.uniqueID] = {};
    }

    const callback = msg => {
        deleteListenerMapItem(headers.uniqueID);
        emitter.subtractOneListener();

        if (msg.type === SUCCESS) {
            sendOKResponse(headers, url,
                response, msg.html, msg.cacheRequest,
                msg.compressed, msg.responseOptions);
        } else {
            updateErrors('response_422');
            response.writeHead(422, {
                'Content-Type': 'text/plain'
            });
            response.end(Constants.EMPTY_DOCUMENT);
        }

    };

    listenerMap[headers.uniqueID] = {
        key: url,
        callback
    };
    emitter.addOneListener();
    emitter.autoAdjustListenerCount();
    emitter.once(url, callback);
}

export function findWorker(url, headers, cacheRequest, queryData, emitter) {

    // let us try to find an available worker
    // Check to make sure worker is available it could be busy
    let availableWorkerIndex = ALL_WORKERS_BUSY;

    headers['queue-entry-time'] = process.hrtime();

    const requestData = {
        headers,
        url
    };

    // see if another worker is processing this request
    for (let i = 0, end = getWorkerBeeKeys().length; i < end; i++) {
        const bee = workerBees[getWorkerBeeKeys()[i]];

        if (bee.busy && bee.requestUrl && bee.requestUrl === url) {
            workerBees[getWorkerBeeKeys()[i]].queue.push({
                requestData
            });
            availableWorkerIndex = ANOTHER_WORKER_PROCESSING_REQUEST;
            logger.warn(`Worker ${getWorkerBeeKeys()[i]} is processing this request. Adding request to workers queue. worker queue.length: ${workerBees[getWorkerBeeKeys()[i]].queue.length}`);

            break;
        }
    }

    // seeing a lot of 1 working doing most of the work
    // shuffling the workers should help split the work better
    shuffleWorkerbeeKeys();
    if (availableWorkerIndex !== ANOTHER_WORKER_PROCESSING_REQUEST) {
        // find worker
        for (let i = 0, end = getWorkerBeeKeys().length; i < end; i++) {
            const bee = workerBees[getWorkerBeeKeys()[i]];
            if (!bee.busy) {
                availableWorkerIndex = getWorkerBeeKeys()[i];
                break;
            }
        }
    }

    if (availableWorkerIndex >= 0) {
        workerBees[availableWorkerIndex].busy = true;
        workerBees[availableWorkerIndex].requestUrl = url;
        // Else pass request to currently available child index
        logger.debug(`Running request directly, not from the queue. requestQueue.length: ${getRequestQueue().length}`);

        passRequestToChild(availableWorkerIndex, requestData, cacheRequest, queryData, emitter)
            .then(processQueue, logPromiseErrors);
    } else if (availableWorkerIndex === ALL_WORKERS_BUSY) {
        addToRequestQueue({
            requestData: requestData,
            cacheAbleRequest: cacheRequest,
            queryData: queryData
        });

        logger.warn(`All template children are down or  busy, adding request to queue. requestQueue.length: ${getRequestQueue().length}`);
    }
}
