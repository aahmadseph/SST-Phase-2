import {
    resolve,
    basename
} from 'path';

import {
    filterHeaders
} from '#server/services/utils/routerUtils.mjs';
import proxyRequest from '#server/services/utils/proxyRequest.mjs';
import {
    apiGet
} from '#server/services/utils/apiRequest.mjs';
import {
    PROXY_HOST,
    PROXY_PORT
} from '#server/config/envRouterConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const API_PREFIX = /^\/api2/;

function callAPI2Get(request, response) {
    const apiURL = (request.url.match(API_PREFIX) ? request.url.replace(API_PREFIX, '/v2') : `/v2${request.url}`);
    apiGet(apiURL, request.headers, request.apiOptions)
        .then(results => {
            response.writeHead(200, filterHeaders(results.headers));
            response.end(results.data);
        }).catch(_e => {
            logger.error(`ERROR calling API: ${apiURL}! Will try to proxy request.`);
            proxyRequest(PROXY_HOST, PROXY_PORT, request, response, '/api2' + request.url, {
                rejectUnauthorized: false
            });
        });
}

export default function addAPI2Routes(app) {
    // handling of all v2 api
    app.get('/api2/{*splat}', callAPI2Get);
}
