/* eslint-disable object-curly-newline */
import fs from 'fs';
import os from 'os';
import querystring from 'querystring';
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';
import {
    createRequire
} from 'module';
const require = createRequire(import.meta.url);

import express from 'express';
import cookieParser from 'cookie-parser';

import agentAwareMiddleware from '#server/services/middleware/agentAwareMiddleware.mjs';
import apiOptionsMiddleware from '#server/services/middleware/apiOptionsMiddleware.mjs';
import blazemeterMiddleware from '#server/services/middleware/blazemeterMiddleware.mjs';
import {
    bodySaver
} from '#server/services/middleware/bodySaverMiddleware.mjs';
import countryLanguageMiddleware from '#server/services/middleware/countryLanguageMiddleware.mjs';
import configCacheMiddleware from '#server/services/middleware/configCacheMiddleware.mjs';
import detectMobileMiddleware from '#server/services/middleware/detectMobileMiddleware.mjs';
import healthCheckMiddleware from '#server/services/middleware/healthCheckMiddleware.mjs';
import updateConfigs from '#server/services/routing/configurationUpdate.mjs';

import includeAPIs from '#server/services/apiOrchestration/index.mjs';
import requestIDMiddleware from '#server/services/middleware/requestIDMiddleware.mjs';
import decodeURIErrorMiddleware from '#server/services/middleware/decodeURIErrorMiddleware.mjs';
import defaultErrorHandlerMiddleware from '#server/services/middleware/defaultErrorHandlerMiddleware.mjs';
import {
    timingMiddleware
} from '#server/services/middleware/timingMiddleware.mjs';
import {
    sendAPI404Response
} from '#server/utils/sendAPIResponse.mjs';
import {
    initPrometheusClient
} from '#server/libs/prometheusMetrics.mjs';
import {
    API_HOST,
    API_PORT,
    ENABLE_REDIS,
    ENABLE_MEMORY_CACHE,
    ENABLE_CONFIGURATION_UPDATE,
    PROXY_HOST,
    API_ROUTER_SERVER_NAME,
    API_ROUTER_SERVER_PORT,
    SDN_API_HOST,
    SDN_API_PORT,
    SSL_KEY,
    SSL_CERT,
    DISABLE_SSL,
    SIMPLE_CACHE_MAX_SIZE,
    API_CLUSTER_WORKERS,
    DISABLE_REDIS_CLUSTER_MODE,
    REDIS_CONFIG
} from '#server/config/envRouterConfig.mjs';
import {
    AGENT_AWARE_SITE_ENABLED,
    ENABLE_PREVIEW,
    ENABLE_SEO,
    ENABLE_SPEEDSCALE,
    UFE_ENV
} from '#server/config/envConfig.mjs';
import {
    loadStatusURLs
} from '#server/services/routing/healthchecks.mjs';
import { uncaughtExceptionHandler } from '#server/utils/exceptionHandling.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

if (ENABLE_SPEEDSCALE) {
    require('global-agent/bootstrap');
}

if (ENABLE_CONFIGURATION_UPDATE) {
    updateConfigs();
}

const PROMETHEUS_APP_NAME = 'woody';

initPrometheusClient(PROMETHEUS_APP_NAME);

const app = express();

app.set('query parser', (qs) => {
    return querystring.parse(qs);
});

// disable telling people what we are
app.disable('x-powered-by');

uncaughtExceptionHandler();

const https = DISABLE_SSL ? require('http') : require('https');

const httpsOptions = (DISABLE_SSL ? undefined : {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT)
});

// add unique id to each request as a header
app.use(requestIDMiddleware);

// default error handler code
app.use(defaultErrorHandlerMiddleware);

// express URIDecode error handling
app.use(decodeURIErrorMiddleware);

// middleware for timing to track how long requests are taking
// NOTE: this should be the first thing
app.use(timingMiddleware);

// makes cookies request.cookies
app.use(cookieParser());

// body parser for middle ware
// express has one and there is body-parser but neither worked
app.use(bodySaver);

// makes api options request.apiOptions
app.use(countryLanguageMiddleware);
app.use(apiOptionsMiddleware('Woody'));
app.use(healthCheckMiddleware);
app.use(detectMobileMiddleware);
app.use(blazemeterMiddleware);
app.use(agentAwareMiddleware);
app.use(configCacheMiddleware);

// ------ server side AB testing start ------
// Enables serverside AB testing for category, brand and brandList pages
//app.use(`${CA_EN_FR}/brands-list`, serverSideABTestMiddleware);
// ------ server side AB testing end ------

// ------ management URLS start  ------
loadStatusURLs(app);
// ------ management URLS end  ------

// ------ API setup start ------
includeAPIs(app);
// ------ API setup end ------

// if we get here
// then rather than send blank page we will send 404
app.get('/{*splat}', (request, response) => {
    sendAPI404Response(response, `Request made for ${request.apiOptions.apiPath}`);
});

const server = (DISABLE_SSL ? https.createServer(app) :
    https.createServer(httpsOptions, app));

if (API_ROUTER_SERVER_NAME) {
    server.listen(API_ROUTER_SERVER_PORT, API_ROUTER_SERVER_NAME);
} else {
    server.listen(API_ROUTER_SERVER_PORT);
}

logger.info(`${os.EOL}
 __             __   ___     ___    ____   __     __
 \\ \\     _     / /  / _ \\   / _ \\  |  _ \\  \\ \\   / /  
  \\ \\   / \\   / /  | | | | | | | | | | | |  \\ \\_/ / 
   \\ \\_/ _ \\_/ /   | | | | | | | | | | | |   \\   / 
    \\   / \\   /    | |_| | | | | | | |_| |    | |  
     \\_/   \\_/      \\___/   \\___/  |____/     |_| 
`);

logger.info(`Server listening on port ${API_ROUTER_SERVER_PORT}.`);

logger.info(`Startup Environment
    PROXY_HOST: ${PROXY_HOST}
    API_ROUTER_SERVER_PORT: ${API_ROUTER_SERVER_PORT}
    API_HOST: ${API_HOST}
    API_PORT: ${API_PORT}
    SDN_API_HOST: ${SDN_API_HOST}
    SDN_API_PORT: ${SDN_API_PORT}
    ENABLE_REDIS: ${ENABLE_REDIS}
    DISABLE_REDIS_CLUSTER_MODE: ${DISABLE_REDIS_CLUSTER_MODE}
    REDIS_CONFIG: ${REDIS_CONFIG}
    DISABLE_SSL: ${DISABLE_SSL}
    SIMPLE_CACHE_MAX_SIZE: ${SIMPLE_CACHE_MAX_SIZE}
    API_CLUSTER_WORKERS: ${API_CLUSTER_WORKERS}
    ENABLE_MEMORY_CACHE: ${ENABLE_MEMORY_CACHE}
    ENABLE_SEO: ${ENABLE_SEO}
    ENABLE_PREVIEW: ${ENABLE_PREVIEW}
    AGENT_AWARE_SITE_ENABLED: ${AGENT_AWARE_SITE_ENABLED}
    ENABLE_CONFIGURATION_UPDATE: ${ENABLE_CONFIGURATION_UPDATE}
    UFE_ENV: ${UFE_ENV}
`, {
    'noJSONParse': true
});

export {
    server,
    process
};
