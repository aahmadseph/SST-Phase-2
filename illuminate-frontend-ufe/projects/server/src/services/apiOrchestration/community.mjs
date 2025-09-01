import {
    resolve,
    basename
} from 'path';

import {
    filterHeaders,
    inputHeaderFilter
} from '#server/services/utils/routerUtils.mjs';
import proxyRequest from '#server/services/utils/proxyRequest.mjs';
import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    getBodyBuffer
} from '#server/services/utils/urlUtils.mjs';
import {
    PROXY_HOST,
    PROXY_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    COMM_EXPERIENCE_HOST,
    COMM_EXPERIENCE_PORT
} from '#server/config/apiConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const API_PREFIX = /^\/api\/v1\/community\/bazaarvoice/;

function callCommunityAPIPost(request, response) {
    const apiURL = (request.url.match(API_PREFIX) ? request.url : `/v1/community/bazaarvoice${request.url}`),
        bodyData = getBodyBuffer(request);
    const options = Object.assign({}, request.apiOptions, {
        rejectUnauthorized: false
    });
    const headers = Object.assign({}, inputHeaderFilter(request.headers));
    headers['Content-Type'] = 'application/json';
    httpsRequest(COMM_EXPERIENCE_HOST, COMM_EXPERIENCE_PORT, apiURL, request.method,
        options, bodyData, headers)
        .then(results => {
            response.writeHead(200, filterHeaders(results.headers));
            response.end(results.data);
        }).catch(_e => {
            logger.error(`ERROR calling API: ${apiURL}! Will try to proxy request.`);
            proxyRequest(PROXY_HOST, PROXY_PORT, request, response, apiURL, {
                rejectUnauthorized: options.rejectUnauthorized
            });
        });
}

export default function addCommunityRoutes(app) {
    // handling of all v2 api
    app.post('/api/v1/community/bazaarvoice/{*splat}', callCommunityAPIPost);
    app.put('/api/v1/community/bazaarvoice/{*splat}', callCommunityAPIPost);
}
