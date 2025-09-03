import os from 'os';
import zlib from 'zlib';
import {
    promisify
} from 'util';
import {
    resolve,
    basename
} from 'path';

import {
    logPromiseErrors
} from '#server/utils/sendOKResponse.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    getMax,
    subtractTimes,
    getDiffTime,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    setupCounter,
    responseTimeBuckets
} from '#server/libs/prometheusMetrics.mjs';
import {
    REQUEST_COUNT_TO_LOG,
    MEMOIZE,
    FRAMEWORK_CONSTANTS
} from '#server/config/envConfig.mjs';
import {
    getWorkerBees
} from '#server/framework/ufe/ufeWorkers.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const ufeRenderCounts = setupCounter('ufe_render_counts', 'Counter for renders includes errors'),
    ufeRenderErrorCounts = setupCounter('ufe_render_error_counts', 'Counter for renders errors');

// switch from histogram to counters
const renderTimingBuckets = {};
[50, 150, 250, 350, 450, 550, 1100, 2100].forEach(bucket => {
    const bucketValue = responseTimeBuckets(bucket / 1000);
    const bucketName = (bucketValue.startsWith('le_') ? `less then or equal to ${bucketValue.split('_')[1]}` : `greater then ${bucketValue.split('_')[1]}`);
    renderTimingBuckets[`renderTimingBuckets${bucketValue}`] = setupCounter(`ufe_render_${bucketValue}_counts`, `Counter for renders split by time ${bucketName}ms`);
});

const gzipCompression = promisify(zlib.gzip);

let maxIPCTime = 0,
    maxIPCTimeURL = '',
    maxRenderTime = 0,
    maxSendDataTime = 0,
    maxCompressionTime = 0,
    requestCount = 0,
    responsesSentSinceLastCall = 0;


// simply split out the code that does the send function
// and make this the promise part
export async function promisifiedSend(postData, childIndex) {

    return new Promise(resolvePromise => {
        const workerBees = getWorkerBees();
        workerBees[childIndex].once('message', (msg) => {
            resolvePromise(msg);
        });

        // initialize the data storage in the event the last
        // process crashed or something else wierd happened
        workerBees[childIndex].data = undefined;
        workerBees[childIndex].length = 0;

        // Send post data to tempalte assembly child process
        workerBees[childIndex].send(postData);

        delete postData.url;
        delete postData.data;
        delete postData.hostname;
        delete postData.encoding;
        delete postData.remoteHost;
    });
}

export async function sendToWorker(postData, childIndex, requestUrl) {

    const [err, msg] = await asyncWrapper(promisifiedSend(postData, childIndex));

    const workerBees = getWorkerBees();
    const bee = workerBees[childIndex];

    // IPC = Inter Process Communication
    const ipcTime = getDiffTime(bee.sendStartTime);

    if (maxIPCTime <= ipcTime) {
        maxIPCTime = ipcTime;
        maxIPCTimeURL = requestUrl;
    }

    logger.verbose(`IPC plus render time = ${ipcTime} seconds with childIndex ${childIndex} for ${requestUrl}.`);
    ufeRenderCounts.inc();
    const isErrorOrSuccess = ((err || !msg.html || FRAMEWORK_CONSTANTS.EMPTY_DOCUMENT === msg.html) ? 'ERROR' : 'SUCCESS');

    if (isErrorOrSuccess === 'ERROR') {
        ufeRenderErrorCounts.inc();
    }

    const bucketValue = responseTimeBuckets(msg.renderTime);
    renderTimingBuckets[`renderTimingBuckets${bucketValue}`].inc();

    // if we get no html or an empty document we are done
    // and can safely reject this promise
    if (err) {
        const rerr = new Error(err);
        rerr.renderTime = msg.renderTime;
        rerr.ipcTime = ipcTime;
        // log this error
        logPromiseErrors(`ERROR in template child: ${stringifyMsg(rerr)}.`);

        return Promise.reject(rerr);
    } else if (!msg.html || FRAMEWORK_CONSTANTS.EMPTY_DOCUMENT === msg.html) {
        // log this error
        const {
            ...rmsg
        } = msg;
        rmsg.ipcTime = ipcTime;
        logger.error(`ERROR response from template child: ${stringifyMsg(msg)}.`);

        return Promise.reject(rmsg);
    }

    maxRenderTime = getMax(maxRenderTime, msg.renderTime);
    maxSendDataTime = getMax(maxSendDataTime, msg.sendDataTime);

    const results = {
        renderTime: msg.renderTime,
        ipcTime: ipcTime
    };
    const [cerr, compressedData] = await asyncWrapper(gzipCompression(msg.html));

    if (cerr) {
        logPromiseErrors(`Compression failed ${requestUrl} ${cerr}.`);
        results['html'] = msg.html;
        results['compressed'] = false;
    } else {
        results['html'] = compressedData;
        results['compressed'] = true;
    }

    if (msg.renderFailure) {
        // this is actually template not found
        results['headers'] = {
            statusCode: 404
        };
        logger.warn(`Render failed: '${msg.renderFailure}' for url: ${requestUrl}'`);
    }

    // EXCLUDE IPC time
    const compressionTime = subtractTimes(bee.sendStartTime, ipcTime);
    maxCompressionTime = getMax(maxCompressionTime, compressionTime);

    return results;
}

export const getMaxIPCTime = () => maxIPCTime;

export const getMaxIPCTimeURL = () => maxIPCTimeURL;

export const getMaxRenderTime = () => maxRenderTime;

export const getMaxSendDataTime = () => maxSendDataTime;

export const getMaxCompressionTime = () => maxCompressionTime;

export const resetCounters = () => {
    maxIPCTime = 0;
    maxIPCTimeURL = '';
    maxRenderTime = 0;
    maxSendDataTime = 0;
    maxCompressionTime = 0;
    responsesSentSinceLastCall = 0;
};

export function formatBuildInfo(buildInfo) {
    const buildDataKeys = Object.keys(buildInfo);

    return buildDataKeys.reduce((accumulator, key, idx) => {

        // reduce into 1 message
        const message = `    ${key}: ${buildInfo[key]}`;
        let result = accumulator;

        if (buildInfo[accumulator]) {
            result = `${accumulator}: ${buildInfo[accumulator]}${os.EOL}`;
        }

        result += message;

        result += (idx < buildDataKeys.length - 1 ? os.EOL : '');

        return result;
    });
}

export function logResponseFinish() {
    if (requestCount >= REQUEST_COUNT_TO_LOG) {
        logger.info(`Processed ${requestCount} responses!`);
        requestCount = 0;
    }

    // update counters that track requests and logging
    // we are sending something
    requestCount++;
    responsesSentSinceLastCall++;
}

export const getResponsesSentSinceLastCall = () => responsesSentSinceLastCall;

export const isCacheableRequest = url => (MEMOIZE && url && (url.indexOf('hash=') > -1) && (url.indexOf('dontCache=true') < 0));
