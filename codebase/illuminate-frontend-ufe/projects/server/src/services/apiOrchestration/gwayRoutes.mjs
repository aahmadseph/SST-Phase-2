import proxyRequest from '#server/services/utils/proxyRequest.mjs';
import {
    PROXY_HOST,
    PROXY_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';
import {
    isUfeEnvLocal
} from '#server/config/envConfig.mjs';

const ORD_DETAILS_PAGE = 'ORD_DETAILS';
const URL_PARAMS_REQUEST_ORIGIN = 'requestOrigin';

function callGway(request, response) {
    proxyRequest(PROXY_HOST, PROXY_PORT, request, response, request.url, {
        rejectUnauthorized: false,
        ciphers: 'DEFAULT:@SECLEVEL=0'
    });
}

function proxyRequestConditionally(request, response, next, condition) {
    if (condition) {
        callGway(request, response);
    } else {
        next();
    }
}

function proxyCartAndCheckout(request, response, next) {
    proxyRequestConditionally(request, response, next, request.cookies[COOKIES_NAMES.RCPS_CC] === 'true');
}

function proxyOrders(request, response, next) {
    const requestOrigin = request.query[URL_PARAMS_REQUEST_ORIGIN] || '';
    const comesFromOrderDetails = requestOrigin === ORD_DETAILS_PAGE;
    proxyRequestConditionally(request, response, next, comesFromOrderDetails && request.cookies[COOKIES_NAMES.RCPS_PO] === 'true');
}

export default function addGwayRoutes(app) {
    app.all('/gway/{*splat}', callGway);
    app.all( '/api/v3/util/location{*splat}', callGway);

    if (isUfeEnvLocal) {
        app.all('/api/shopping-cart/{*splat}', proxyCartAndCheckout);
        app.all('/api/checkout/orders/{*splat}', proxyOrders);
        app.all('/api/checkout/{*splat}', proxyCartAndCheckout);

        // Rewards APIs
        app.all('/api/bi/profile/rewards{*splat}', proxyCartAndCheckout);
        app.all('/api/bi/orders/{*splat}/rewards/{*splat}', proxyCartAndCheckout);
    }

}
