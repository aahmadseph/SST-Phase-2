import {
    resolve,
    basename
} from 'path';
import {
    createRequire
} from 'module';
const require = createRequire(import.meta.url);

import WebRequest from '#server/framework/services/net/WebRequest.mjs';
import {
    ENABLE_PROMETHEUS
} from '#server/config/envConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    hasMoreThanOneWorker
} from '#server/utils/indexUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const isMutli = hasMoreThanOneWorker();

const TEMPLATERESOLVER_LEN = '/templateResolver?'.length;

// metric checks, need this to filter them out
const METRIC_PATHS = /(^\/metrics|^\/healthcheck|^\/health|^\/status)/;

// metric checks, need this to filter them out
const ASSET_PATHS = /(^\/js|^\/img|^\/productimages|^\/contentimages|^\/favicon)/;

const ASSETS_URL = 'assets',
    API_URLS = 'apis',
    STATS_URL = 'stats',
    HOMEPAGE_URL = 'homepage',
    OTHER_URL = 'other';

let prometheusClient;

if (ENABLE_PROMETHEUS && !prometheusClient) {
    prometheusClient = require('prom-client');
}

function initPrometheusClient(appName) {
    if (ENABLE_PROMETHEUS) {
        // prometheus
        const prometheusRegister = new prometheusClient.AggregatorRegistry();
        prometheusRegister.setDefaultLabels({
            app: appName
        });
        prometheusClient.collectDefaultMetrics({
            register: prometheusRegister
        });
    }
}

function getPrometheusMetrics(request, response, prometheusPort) {
    if (ENABLE_PROMETHEUS) {
        if (prometheusPort && isMutli) {
            // proxy
            const options = {
                enableAgent: false,
                keepalive: false,
                method: 'GET',
                host: 'localhost',
                port: prometheusPort,
                path: '/metrics',
                headers: {}
            };
            WebRequest(false, options).then(res => {
                response.setHeader('Content-Type', prometheusClient.register.contentType);
                response.writeHead(200, {});
                response.end(res.data);
            }).catch(err => {
                // cannot call sendErrorResponse here as that creates
                // circular reference
                const errMSg = stringifyMsg(err);
                logger.error(errMSg);
                response.writeHead(500, {});
                response.end(errMSg);
            });
        } else {
            // Return all metrics the Prometheus exposition format
            response.setHeader('Content-Type', prometheusClient.register.contentType);
            prometheusClient.register.metrics().then(results => {
                response.end(results);
                prometheusClient.register.getMetricsAsArray().filter(metric => {
                    return metric instanceof prometheusClient.Counter;
                }).forEach(metric => {
                    metric.reset();
                });
            });
        }
    } else {
        response.setHeader('Content-Type', 'text/plain');
        response.end('No data');
    }
}

function setupHistogram(name, help, buckets, labelNames) {

    if (ENABLE_PROMETHEUS) {
        // prometheus
        const histogramMetric = new prometheusClient.Histogram({
            name: name,
            help: help,
            labelNames: labelNames || ['method', 'route', 'code'],
            buckets: buckets || [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 5]
        });
        prometheusClient.register.registerMetric(histogramMetric);

        return histogramMetric;
    } else {
        return {
            startTimer: () => {
                return () => {};
            }
        };
    }
}

function setupCounter(name, help) {

    if (ENABLE_PROMETHEUS) {
        // prometheus
        const counterMetric = new prometheusClient.Counter({
            name: name,
            help: help
        });
        prometheusClient.register.registerMetric(counterMetric);

        return counterMetric;
    } else {
        return {
            inc: () => {},
            reset: () => {}
        };
    }
}

function setupGauge(name, help) {

    if (ENABLE_PROMETHEUS) {
        // prometheus
        const gaugeMetric = new prometheusClient.Gauge({
            name: name,
            help: help
        });
        prometheusClient.register.registerMetric(gaugeMetric);

        return gaugeMetric;
    } else {
        return {
            set: () => {},
            inc: () => {},
            dec: () => {},
            reset: () => {}
        };
    }
}

function replaceStartingPath(url = '', pathIn, len) {
    return (url.startsWith(pathIn) ? url.substring(len) : url);
}

function simplifyPath(pathIn = '') {

    // always manage urls in lower case for prometheus
    const pathInLowerCase = pathIn.toLowerCase();

    // remove /ca
    const pathInLowerCaseNoCa = replaceStartingPath(pathInLowerCase, '/ca/', 3);

    // remove en or fr
    const enPathIn = replaceStartingPath(replaceStartingPath(pathInLowerCaseNoCa, '/fr/', 3), '/en/', 3);

    let result;

    if (enPathIn.length === 0 || enPathIn === '/') {
        result = HOMEPAGE_URL;
    } else if (enPathIn.match(METRIC_PATHS) || enPathIn.indexOf('/actuator/health') > -1) {
        result = STATS_URL;
    } else if (enPathIn.match(ASSET_PATHS)) {
        result = ASSETS_URL;
    } else if (enPathIn.startsWith('/api')) {
        result = API_URLS;
    } else {
        const pathParts = enPathIn.split('/');

        if (pathParts && pathParts.length > 1 && pathParts[1]) {
            result = pathParts[1];
        } else {
            result = OTHER_URL;
            logger.info(`{ requestpath: ${enPathIn} }`);
        }
    }

    return result;
}

function simplifyRoute(routeIn = '') {

    const routeOutParts = new URLSearchParams(routeIn.slice(TEMPLATERESOLVER_LEN));

    const routeOut = `${(routeOutParts.get('channel') || '').toLowerCase()}_${(routeOutParts.get('country') || '').toLowerCase()}_${(routeOutParts.get('language') || '').toLowerCase()}`;

    const urlPath = simplifyPath(decodeURIComponent(routeOutParts.get('urlPath')));

    return `${routeOut}_${urlPath}`;
}

function responseTimeBuckets(renderTime) {
    const renderTimeBucket = (Math.round((renderTime || 0) * 10) * 100);

    let bucket = '0';

    if (+renderTimeBucket <= 100) {
        bucket = 'le_100';
    } else if (+renderTimeBucket <= 200) {
        bucket = 'le_200';
    } else if (+renderTimeBucket <= 300) {
        bucket = 'le_300';
    } else if (+renderTimeBucket <= 400) {
        bucket = 'le_400';
    } else if (+renderTimeBucket <= 500) {
        bucket = 'le_500';
    } else if (+renderTimeBucket <= 1000) {
        bucket = 'le_1000';
    } else if (+renderTimeBucket <= 2000) {
        bucket = 'le_2000';
    } else if (+renderTimeBucket > 2000) {
        bucket = 'gt_2000';
    }

    return bucket;
}

export {
    STATS_URL,
    ASSETS_URL,
    initPrometheusClient,
    getPrometheusMetrics,
    setupHistogram,
    setupCounter,
    setupGauge,
    simplifyRoute,
    simplifyPath,
    responseTimeBuckets
};
