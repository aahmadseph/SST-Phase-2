import {
    resolve,
    basename
} from 'path';

import WebRequest from '#server/framework/services/net/WebRequest.mjs';
import {
    setupCounter,
    setupHistogram,
    simplifyRoute
} from '#server/libs/prometheusMetrics.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    UFE_SLOW_TIME,
    UFE_CALL_TIMEOUT
} from '#server/config/envConfig.mjs';
import {
    COMPRESS_POST_DATA_TO_UFE
} from '#server/config/envRouterConfig.mjs';
import {
    getMax,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const metrics = {
    maxUfeTimeToCompress: 0,
    maxUfeResponseTime: 0,
    maxUfeErrorResponseTime: 0,
    ufeCallCounts: 0,
    ufeErrorCounts: 0,
    ufeSuccessCounts: 0
};

const callUfeDurationMicroseconds = setupHistogram('ufe_call_time', 'Duration of requests to UFE in microseconds'),
    callUfeCounter = setupCounter('call_ufe_counts', 'Counter for UFE requests'),
    slowCallUfeCounter = setupCounter('slow_call_ufe_counts', 'Counter for UFE requests');

function getCallMetrics() {

    const metricData = Object.assign({}, metrics);

    metrics.maxUfeTimeToCompress = 0;
    metrics.maxUfeResponseTime = 0;
    metrics.maxUfeErrorResponseTime = 0;
    metrics.ufeCallCounts = 0;
    metrics.ufeErrorCounts = 0;
    metrics.ufeSuccessCounts = 0;

    return metricData;
}

function logSlowCalls(responseTime, msgType, end, options, statusCode) {

    // match UFE :)
    if (responseTime > UFE_SLOW_TIME) {
        slowCallUfeCounter.inc();
        const {
            headers = {}
        } = options;
        const msg = stringifyMsg({
            'UFE_response': {
                status: msgType,
                'took_more_than': UFE_SLOW_TIME,
                responseTime: responseTime,
                'request-id': headers['request-id'],
                'akamweb': headers['x-akamweb']
            }
        });
        logger.warn(msg);
    }

    end({
        route: simplifyRoute(options.path),
        code: statusCode,
        method: options.method
    });
}

async function callUfe(options, data) {

    const end = callUfeDurationMicroseconds.startTimer();

    metrics.ufeCallCounts++;
    callUfeCounter.inc();

    const requestOptions = Object.assign({}, options, {
        keepCompressed: true,
        compressData: COMPRESS_POST_DATA_TO_UFE,
        returnDataMethod: 'getBuffer'
    });

    if (UFE_CALL_TIMEOUT > 0) {
        requestOptions.timeout = UFE_CALL_TIMEOUT;
    }

    logger.debug(`JERRI call to UFE: ${requestOptions.path} with options: ${stringifyMsg(requestOptions)}.`);
    const [err, results] = await asyncWrapper(WebRequest(false, requestOptions, data));

    if (err) {
        logSlowCalls(err.requestCallTime, 'ERROR', end, requestOptions, err.statusCode || 500);
        metrics.maxUfeErrorResponseTime = getMax(metrics.maxUfeErrorResponseTime, err.requestCallTime);
        metrics.maxUfeTimeToCompress = getMax(metrics.maxUfeTimeToCompress, err.compressionTime);
        metrics.ufeErrorCounts++;
        logger.error(stringifyMsg(err));

        return Promise.reject(err);
    } else {
        logSlowCalls(results.requestCallTime, 'SUCCESS', end, requestOptions, results.statusCode);
        metrics.maxUfeResponseTime = getMax(metrics.maxUfeResponseTime, results.requestCallTime);
        metrics.maxUfeTimeToCompress = getMax(metrics.maxUfeTimeToCompress, results.compressionTime);
        metrics.ufeSuccessCounts++;

        return Promise.resolve(results);
    }
}

export {
    callUfe,
    getCallMetrics
};
