/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';

import {
    setupHistogram,
    setupCounter,
    simplifyPath,
    STATS_URL,
    ASSETS_URL
} from '#server/libs/prometheusMetrics.mjs';
import {
    getDiffTime
} from '#server/utils/serverUtils.mjs';
import {
    COUNTRIES,
    LANGUAGES
} from '#server/services/utils/Constants.mjs';
import {
    getHeader
} from '#server/utils/responseHeaders.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

let requestCounts = 0,
    metricCounts = 0;

const httpRequestDurationMicroseconds = setupHistogram('http_server_requests_seconds',
        'Duration of HTTP requests in microseconds', [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1]),
    httpRequestCounts = setupCounter('http_request_counts', 'Counter for HTTP requests');

const PATHS_TO_SKIP = [STATS_URL, ASSETS_URL];

export function timingMiddleware(request, response, next) {

    request.headers['request-start-time'] = process.hrtime();

    const end = httpRequestDurationMicroseconds.startTimer();

    response.on('finish', () => {

        const basePath = simplifyPath(request.path);
        const skipPath = PATHS_TO_SKIP.includes(basePath);

        httpRequestCounts.inc();
        requestCounts++;

        if (basePath === STATS_URL) {
            metricCounts++;
        }

        // Seems that sometimes this gets unset somehow
        const {
            apiOptions = {},
            headers = {},
            url
        } = request;

        const {
            country = COUNTRIES.US,
            language = LANGUAGES.EN,
            channel
        } = apiOptions;

        const {
            statusCode
        } = response;

        const metricData = {
            'url': url,
            'country': country,
            'language': language,
            'channel': channel,
            'statusCode': statusCode,
            'request-id': headers['request-id']
        };

        if (response.callUfeTime && response.callUfeTime > 0) {
            metricData.callUfeTime = response.callUfeTime;
        }

        // none 2xx status codes more data
        if (statusCode < 200 || statusCode >= 300) {
            if (request && apiOptions && apiOptions.referer) {
                metricData.referer = apiOptions.referer;
            }

            const location = getHeader(response.getHeaders(), 'location');

            if (location) {
                metricData.redirectToLocation = location;
            }
        }

        const requestProcessingTime = getDiffTime(request.headers['request-start-time']);
        metricData['Request-processing-time-took'] = requestProcessingTime;

        // log all requests over 200ms as slow
        if (requestProcessingTime > 0.2) {
            logger.warn(metricData);
        } else if (!skipPath && !apiOptions.isHealthcheck) {
            // don't log assets or metric calls
            logger.info(metricData);
        } else {
            // if someone turns on debug they get it all
            logger.debug(metricData);
        }

        end({
            route: basePath,
            code: response.statusCode,
            method: request.method
        });
    });

    next();
}

export function getRequestMetrics() {

    const results = {
        requestCounts,
        metricCounts
    };

    requestCounts = 0;
    metricCounts = 0;

    return results;
}
