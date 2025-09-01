import {
    STATUS_LOG_TIME
} from '#server/config/envConfig.mjs';
import {
    PROMETHEUS_PORT,
    ENABLE_REDIS,
    ENABLE_MEMORY_CACHE
} from '#server/config/envRouterConfig.mjs';
import {
    statusRoute,
    getLastCalledTime
} from '#server/services/routing/status.mjs';
import {
    flushMemoryCache
} from '#server/services/routing/memCacheFlush.mjs';
import {
    getPrometheusMetrics
} from '#server/libs/prometheusMetrics.mjs';
import {
    postCacheManager,
    sendCacheManagerPageResponse
} from '#server/services/orchestration/cacheManagerPage.mjs';

const JSON_CONTENT_TYPE = 'application/json; charset=UTF-8';

export function loadStatusURLs(app) {

    app.post('/flushMemoryCache', flushMemoryCache);
    app.get('/status', statusRoute);
    app.get('/metrics', (request, response) => {
        getPrometheusMetrics(request, response, PROMETHEUS_PORT);
        const lastStatusCalledTime = getLastCalledTime();
        const logStatusData = (!!(!lastStatusCalledTime ||
            (new Date().getTime() - lastStatusCalledTime.getTime() > STATUS_LOG_TIME)));

        if (logStatusData) {
            statusRoute(undefined, undefined);
        }
    });
    app.get(['/health', '/healthcheck', '/jerri{*splat}/actuator/health', '/woody{*splat}actuator/health'], (_request, response) => {
        response.writeHead(200, {
            'Content-Type': JSON_CONTENT_TYPE
        });
        response.end('{"healthCheck":"OK","statusCode":200}');
    });

    // ------ debugCache page start ------
    if (ENABLE_REDIS || ENABLE_MEMORY_CACHE) {
        app.get('/debugCache', sendCacheManagerPageResponse);
        app.post('/debugCache', postCacheManager);
    }
    // ------ debugCache page end ------

}
