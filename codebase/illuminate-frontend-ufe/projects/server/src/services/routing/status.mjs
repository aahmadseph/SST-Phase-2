import process from 'node:process';
import os from 'node:os';
import {
    getHeapStatistics,
    getHeapSpaceStatistics
} from 'node:v8';
import {
    resolve,
    basename
} from 'path';

import {
    getBodySaverMetrics
} from '#server/services/middleware/bodySaverMiddleware.mjs';
import {
    getRequestMetrics
} from '#server/services/middleware/timingMiddleware.mjs';
import {
    getUFEMetrics
} from '#server/services/utils/ufeServiceCaller.mjs';
import * as redisWrapper from '#server/services/utils/redisWrapper.mjs';
import {
    apiMetrics
} from '#server/services/utils/apiRequest.mjs';
import {
    getHeaderMetrics
} from '#server/utils/responseHeaders.mjs';
import {
    BUILD_INFO,
    ENABLE_PROMETHEUS
} from '#server/config/envConfig.mjs';
import {
    ENABLE_REDIS
} from '#server/config/envRouterConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    hasMoreThanOneWorker
} from '#server/utils/indexUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

let getRedisMetrics = () => {
    return {};
};

if (ENABLE_REDIS) {
    getRedisMetrics = redisWrapper.getRedisMetrics;
}

const shouldSendMessage = (process.send && hasMoreThanOneWorker());

let lastStatusCalledTime;

function getStatus() {
    // if prometheus is enabled we do not need metrics from
    // systems that have had prometheus data setup and this will reduce amount of logs
    const requestMetrics = getRequestMetrics(),
        apiCallMetrics = apiMetrics(),
        ufeMetrics = getUFEMetrics(),
        redisMetrics = getRedisMetrics();

    const uptime = process.uptime(),
        loadAverage = os.loadavg(),
        firstCalledMessage = `First call since started ${uptime} seconds`,
        deltaTime = (lastStatusCalledTime ? ((new Date().getTime() - lastStatusCalledTime.getTime()) / 1000) + ' seconds' : firstCalledMessage);

    const status = {
        'status': 'UP',
        'pid': process.pid,
        'lastStatusCalledTime': (lastStatusCalledTime ? lastStatusCalledTime.toString() : firstCalledMessage),
        'timeSinceLastCall': `${deltaTime}`,
        'system': {
            'uptime': uptime,
            'memory': process.memoryUsage(),
            'loadAverage': {
                one: loadAverage[0],
                five: loadAverage[1],
                fifteen: loadAverage[2]
            },
            'osTotalMemory': os.totalmem(),
            'osFreeMemory': os.freemem(),
            'heapStatistics': getHeapStatistics(),
            'heapSpaceStatistics': getHeapSpaceStatistics()
        },
        'metrics': {
            requestMetrics,
            apiCallMetrics,
            ufeMetrics,
            redisMetrics,
            getBodySaverMetrics,
            'headerMetrics': getHeaderMetrics()
        }
    };

    lastStatusCalledTime = new Date();

    return status;
}

process.on('message', msg => {
    if (msg.request === 'sendStatus') {
        const statusData = getStatus();
        process.send({
            'request': 'statusData',
            'data': statusData,
            'pid': process.pid
        });
    }
});

export function statusRoute(_request, response) {

    const statusData = getStatus();

    if (shouldSendMessage) {
        process.once('message', msg => {
            if (msg.request === 'sendData') {
                const msgData = msg.data;

                if (response) {
                    const addedBuildInfo = Object.assign({}, msgData, BUILD_INFO);
                    response.json(addedBuildInfo);
                }

                logger.info(stringifyMsg(BUILD_INFO));
                Object.keys(msgData).forEach(item => {
                    logger.info(stringifyMsg(msgData[item]));
                });
            }
        });
        process.send({
            'request': 'status',
            'data': statusData,
            'pid': process.pid
        });

        return;
    }

    // TODO long term we want to move to prometheus metrics
    // but for now we need this data to be able to query
    // as prometheus is being persnickety
    const addedBuildInfo = Object.assign({}, statusData, BUILD_INFO);

    if (response) {
        if (ENABLE_PROMETHEUS) {
            const lighterInfo = Object.assign({}, addedBuildInfo);
            Object.keys(lighterInfo).forEach(key => {
                delete lighterInfo[key].metrics;
            });
            response.json(lighterInfo);
        } else {
            response.json(addedBuildInfo);
        }
    }

    logger.info(stringifyMsg(addedBuildInfo));
}

export const getLastCalledTime = () => {
    return lastStatusCalledTime;
};
