import os from 'os';
import process from 'node:process';

import {
    HOSTNAME,
    WORKERS,
    MAX_REQUEST_SIZE
} from '#server/config/envConfig.mjs';
import {
    getMemoryObject
} from '#server/libs/memoryCache.mjs';
import {
    getRequestQueue,
    getWorkerBeeKeys
} from '#server/framework/ufe/ufeWorkers.mjs';
import {
    getMemoryCounts,
    resetMemoryCounters
} from '#server/libs/memoryCache.mjs';
import {
    getSendPromiseErrors,
    resetSendPromiseErrors,
    getMaxResponsePayload,
    resetMaxResponsePayload
} from '#server/utils/sendOKResponse.mjs';
import {
    getMaxIPCTime,
    getMaxIPCTimeURL,
    getResponsesSentSinceLastCall,
    getMaxRenderTime,
    getMaxCompressionTime,
    getMaxSendDataTime,
    resetCounters
} from '#server/framework/ufe/ufeUtils.mjs';
import {
    getMaxTimeToIPC,
    getRendersSinceLastCall,
    resetMaxTimeCounters
} from '#server/framework/ufe/passRequestToChild.mjs';
import {
    getMax,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    getHeaderMetrics
} from '#server/utils/responseHeaders.mjs';

let lastStatusCalledTime,
    maxTimeInRequestQueue = 0,
    maxRequestProcessingTime = 0,
    maxPayloadSinceLastCall = 0,
    errors = {
        'response_422': 0,
        'response_413': 0,
        'response_404': 0,
        'childExitErrorCount': 0,
        'promiseErrors': 0
    };

export const updateErrors = (errorType) => {
    errors[errorType]++;
};

export function hasWorkerErrors(workerBeeKenLength) {
    return (errors.childExitErrorCount > 0 ||
        (+WORKERS) !== workerBeeKenLength ||
        workerBeeKenLength === 0);
}

export const updateMaxPayloadSinceLastCall = (payloadSize) => {
    maxPayloadSinceLastCall = getMax(maxPayloadSinceLastCall, payloadSize);
};

export const updateRequestProcessingTime = (requestProcessingTime) => {
    maxRequestProcessingTime = getMax(maxRequestProcessingTime, requestProcessingTime);
};

export const updateMaxTimeInRequestQueue = (queueTime) => {
    maxTimeInRequestQueue = getMax(maxTimeInRequestQueue, queueTime);
};

export const getLastStatusCalledTime = () => lastStatusCalledTime;

export function getMetricsObject() {

    const memoryCount = getMemoryObject().size,
        memoryUsage = process.memoryUsage();

    const cpuUsageSinceLastCall = process.cpuUsage();

    const userTime = (cpuUsageSinceLastCall.user / 1e3) + ' ms';
    const systemTime = (cpuUsageSinceLastCall.system / 1e3) + ' ms';
    const loadAverage = os.loadavg();

    return {
        'numberOfWorkers': WORKERS,
        'cacheCount': memoryCount,
        'memory': memoryUsage,
        'cpuUsageSinceLastCall': {
            'user': userTime,
            'system': systemTime
        },
        'loadAverage': {
            one: loadAverage[0],
            five: loadAverage[1],
            fifteen: loadAverage[2]
        },
        'queueLength': getRequestQueue().length,
        'uptime': process.uptime(),
        'maxRequestSize': MAX_REQUEST_SIZE,
        'osTotalMemory': os.totalmem(),
        'osFreeMemory': os.freemem(),
        'hostname': HOSTNAME
    };
}

export function getServerStatus(buildInfo, returnJSON = false) {
    const hasError = hasWorkerErrors(getWorkerBeeKeys().length),
        uptime = process.uptime(),
        firstCalledMessage = `First call since started ${uptime} seconds`,
        deltaTime = (lastStatusCalledTime ? ((new Date().getTime() - lastStatusCalledTime.getTime()) / 1000) + ' seconds' : firstCalledMessage);

    const {
        cacheSetsSinceLastCall,
        cacheHitsSinceLastCall,
        cacheMissesSinceLastCall,
        purgeEventCountSinceLastCall
    } = getMemoryCounts();

    errors.promiseErrors = getSendPromiseErrors();

    const responseStatus = {
        'status': (hasError ? 'ERROR' : 'OK'),
        'renderInfo': {
            'lastStatusCalledTime': (lastStatusCalledTime ? lastStatusCalledTime.toString() : firstCalledMessage),
            'timeSinceLastCall': `${deltaTime}`,
            'maxIPCTime': getMaxIPCTime(),
            'maxIPCTimeURL': getMaxIPCTimeURL(),
            'maxTimeToIPC': getMaxTimeToIPC(),
            'maxTimeInRequestQueue': maxTimeInRequestQueue,
            'maxPayloadSinceLastCall': maxPayloadSinceLastCall,
            'rendersSinceLastCall': getRendersSinceLastCall(),
            'cacheSetsSinceLastCall': cacheSetsSinceLastCall,
            'cacheHitsSinceLastCall': cacheHitsSinceLastCall,
            'cacheMissesSinceLastCall': cacheMissesSinceLastCall,
            'purgeEventCountSinceLastCall': purgeEventCountSinceLastCall,
            'responsesSentSinceLastCall': getResponsesSentSinceLastCall(),
            'maxResponsePayload': getMaxResponsePayload(),
            'maxRenderTime': getMaxRenderTime(),
            'maxCompressionTime': getMaxCompressionTime(),
            'maxSendDataTime': getMaxSendDataTime(),
            'maxRequestProcessingTime': maxRequestProcessingTime,
            'headerMetrics': getHeaderMetrics()
        },
        'metrics': getMetricsObject(),
        'errors': errors,
        'buildInfo': buildInfo
    };

    if (hasError) {
        responseStatus.errors.message = `${errors.childExitErrorCount} workers have exited! Worker counts: Original = ${getWorkerBeeKeys().length} vs Current = ${WORKERS}. Check logs for more details.`;
    }

    const resultData = returnJSON ? responseStatus: stringifyMsg(responseStatus);

    // reset counters
    lastStatusCalledTime = new Date();
    resetMaxTimeCounters();
    resetMemoryCounters();
    resetCounters();
    maxPayloadSinceLastCall = 0;
    resetMaxResponsePayload();
    maxTimeInRequestQueue = 0;
    maxRequestProcessingTime = 0;
    errors = {
        'response_422': 0,
        'response_413': 0,
        'response_404': 0,
        'childExitErrorCount': 0,
        'promiseErrors': 0
    };
    resetSendPromiseErrors();

    return resultData;
}
