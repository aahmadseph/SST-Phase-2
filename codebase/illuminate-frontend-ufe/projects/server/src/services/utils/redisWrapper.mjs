/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';

import RedisPool from '#server/framework/services/redis/createClientPool.mjs';
import {
    setupCounter,
    setupHistogram
} from '#server/libs/prometheusMetrics.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    getDiffTime,
    stringifyMsg,
    safelyParse,
    getMax
} from '#server/utils/serverUtils.mjs';
import {
    BUILD_INFO,
    BUILD_NUMBER_STRING
} from '#server/config/envConfig.mjs';
import {
    DISABLE_REDIS_CLUSTER_MODE
} from '#server/config/envRouterConfig.mjs';
import {
    HOUR
} from '#server/config/TimeConstants.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

import redisConfig from '#server/config/redisConfig.mjs';

const REDIS_MAX_CALL_TIME = 0.025,
    REDIS_MAX_CALL_TIME_STR = `${REDIS_MAX_CALL_TIME}ms`;

// 6 hours has been working fine so hard code this here now
const CACHE_EXPIRE_TIME = 6 * HOUR,
    CACHE_EXTENSION_TIME = 6 * HOUR;

const {
    GIT_BRANCH
} = BUILD_INFO;

let redisClient,
    prefix,
    bypassRedis = false,
    redisCallCount = {
        total: 0,
        getAPIItem: 0,
        fetch: 0,
        expire: 0,
        setItem: 0,
        setAPIItem: 0,
        scan: 0,
        dbsize: 0,
        flush: 0,
        keys: 0,
        deleteItem: 0,
        info: 0,
        clusterInfo: 0,
        ttl: 0
    },
    redisCacheSuccess = 0,
    redisCacheErrors = 0,
    redisCacheHits = 0,
    redisCacheMisses = 0,
    redisCacheNoData = 0,
    redisMaxSuccessTime = 0,
    redisMaxErrorTime = 0;

function getRedisMetrics() {

    const metrics = {
        prefix: prefix,
        bypassRedis: bypassRedis,
        isEnabled: redisClient.isEnabled,
        redisCallCount: redisCallCount,
        redisCacheSuccess: redisCacheSuccess,
        redisCacheErrors: redisCacheErrors,
        redisMaxSuccessTime: redisMaxSuccessTime,
        redisMaxErrorTime: redisMaxErrorTime,
        redisCacheHits: redisCacheHits,
        redisCacheMisses: redisCacheMisses,
        redisCacheNoData: redisCacheNoData
    };

    redisCallCount = {
        total: 0,
        getAPIItem: 0,
        fetch: 0,
        expire: 0,
        setItem: 0,
        scan: 0,
        dbsize: 0,
        flush: 0,
        keys: 0,
        deleteItem: 0,
        info: 0,
        clusterInfo: 0,
        ttl: 0
    };
    redisCacheHits = 0;
    redisCacheMisses = 0;
    redisCacheNoData = 0;
    redisCacheSuccess = 0;
    redisCacheErrors = 0;
    redisMaxSuccessTime = 0;
    redisMaxErrorTime = 0;

    return metrics;
}

const redisDurationMicroseconds = setupHistogram('redis_processing_time',
        'Duration of requests to REDIS in microseconds', undefined, ['command', 'status']),
    redisCounts = setupCounter('redis_counts', 'Counter for REDIS requests'),
    slowRedisCount = setupCounter('slow_redis_counts', 'Counter for REDIS requests');

function getRedisClient(options) {
    redisClient = new RedisPool(options);
    logger.debug('REDIS: Cluster Mode Set: Always in Cluster Mode');

    return redisClient;
}

function getPrefix() {
    return prefix;
}

function getRedisConfig() {

    if (redisConfig.prefix) {
        prefix = redisConfig.prefix;
    }

    if (typeof redisConfig.clusterMode === 'undefined') {
        if (DISABLE_REDIS_CLUSTER_MODE) {
            redisConfig['clusterMode'] = false;
        } else {
            redisConfig['clusterMode'] = true;
        }
    }

    // we don't want buffersredisCacheSuccess
    delete redisConfig['return_buffers'];

    // switch to detect_buffers?
    return Object.assign({}, {
        'return_buffers': false,
        'detect_bufers': true,
        host: redisConfig.host,
        port: redisConfig.port
    }, redisConfig);
}

function setupRedis(filterKeyName) {
    const options = getRedisConfig();

    if (filterKeyName) {
        options.filterKeyName = filterKeyName;
    }

    logger.debug(`REDIS Config: ${stringifyMsg(options)}`);
    redisClient = getRedisClient(options);
}

// the only caller of this expects a promise
async function setBypassRedis(bypass = false) {
    bypassRedis = safelyParse(bypass);
    logger.debug(`Bypass ${typeof bypass}`);
    Promise.resolve(bypass);
}

function getRedisHandle() {
    return redisClient.getConnection();
}

function isRedisEnabled() {
    if (bypassRedis) {
        return false;
    }

    return getRedisHandle().isClientEnabled();
}

function slowREDISCallLogging(methodName, callTime, isError, end) {

    redisCounts.inc();
    const statusMsg = isError ? 'ERROR' : 'SUCCESS';

    // greater than 25 ms
    if (callTime > REDIS_MAX_CALL_TIME) {
        slowRedisCount.inc();
        logger.warn(stringifyMsg({
            'REDIS': {
                'method': methodName,
                'took_more_than': REDIS_MAX_CALL_TIME_STR,
                'callTime': callTime,
                'status': statusMsg
            }
        }));
    }

    if (end) {
        end({
            command: methodName,
            status: statusMsg
        });
    }
}

function processResponse(err, success, startTime, command, end) {
    if (err) {
        redisCacheErrors++;
        const diffTime = getDiffTime(startTime);
        redisMaxErrorTime = getMax(redisMaxErrorTime, diffTime);
        logger.error(`ERROR Calling ${command}: ${err}`);
        slowREDISCallLogging(command, diffTime, true, end);

        return undefined;
    } else {
        redisCacheSuccess++;
        const diffTime = getDiffTime(startTime);
        redisMaxSuccessTime = getMax(redisMaxSuccessTime, diffTime);
        logger.debug(`REDIS Calling ${command}: ${success}`);
        slowREDISCallLogging(command, diffTime, false, end);

        return success;
    }
}

async function setCacheExpirationTime(redisKey, cacheExpirationTime) {
    redisCallCount.expire++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    // time in seconds
    const now = new Date().getTime();
    const expTime = Math.ceil((+now + +cacheExpirationTime) / 1000);
    const [err, success] = await asyncWrapper(getRedisHandle().pexpireat(redisKey, expTime));

    return processResponse(err, success, startTime, 'pexpireat', end);
}

async function pttl(key) {
    redisCallCount.ttl++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().asyncCommand('pttl', key));

    return processResponse(err, success, startTime, 'pinfo', end);
}

const updateTTL = async (serveStale, redisKey) => {
    if (!serveStale) {
        // get ttl time left and use that to figure out if we should extend cache
        const [err, timeLeft] = await asyncWrapper(pttl(redisKey));

        if (err) {
            logger.debug(`PTTL call resulted in error: ${stringifyMsg(err)}`);
        } else if (timeLeft && timeLeft > 0 && timeLeft < HOUR) {
            // extend 2 hours
            await setCacheExpirationTime(redisKey, CACHE_EXTENSION_TIME);
            logger.verbose(`Extending the expiration time of fetched item ${redisKey}`);
        }
    }
};

async function fetch(redisKey, hash, serveStale = false) {
    let result;
    redisCallCount.fetch++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().phgetall(redisKey));

    if (success && success.createTime && success.html && success.hashKey) {
        redisCacheSuccess++;
        const diffTime = getDiffTime(startTime);
        redisMaxSuccessTime = getMax(redisMaxSuccessTime, diffTime);
        slowREDISCallLogging('fetch', diffTime, false, end);

        if (success.buildNumber && success.gitBranch &&
            ((hash && success.hashKey.toString() === hash.toString()) || serveStale) &&
            success.gitBranch === GIT_BRANCH &&
            success.buildNumber === BUILD_NUMBER_STRING) {

            // convert the buffers to readable stuff
            result = {
                createTime: success.createTime.toString(),
                html: Buffer.from(success.html.toString(), 'base64'),
                hashKey: success.hashKey.toString(),
                compressed: (!!success.compressed),
                buildNumber: (success.buildNumber ? success.buildNumber.toString() : ''),
                gitBranch: (success.gitBranch ? success.gitBranch.toString() : '')
            };

            redisCacheHits++;
            logger.verbose(`Success in getting data ${success && success.hashKey}`);

            await updateTTL(serveStale, redisKey);
        } else {
            redisCacheMisses++;
            logger.info(`Cache miss Build Number: ${BUILD_NUMBER_STRING} vs ${success.buildNumber} and Branch: ${GIT_BRANCH} vs ${success.gitBranch} and Hash: ${hash} vs ${success.hashKey} For KEY: ${redisKey}`);
        }
    } else if (err) {
        redisCacheErrors++;
        const diffTime = getDiffTime(startTime);
        redisMaxErrorTime = getMax(redisMaxErrorTime, diffTime);
        logger.error(`ERROR getting data from redis: ${err}`);
        slowREDISCallLogging('fetch', diffTime, true, end);
    } else {
        redisCacheNoData++;
        // no error but no data either
        const diffTime = getDiffTime(startTime);
        redisMaxSuccessTime = getMax(redisMaxSuccessTime, diffTime);
        slowREDISCallLogging('fetch', diffTime, false, end);
    }

    return result;
}

async function setItem(redisKey, options) {
    redisCallCount.setItem++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().phset(redisKey,
        'hashKey', options.hashKey,
        'html', options.html.toString('base64'),
        'compressed', options.compressed,
        'buildNumber', options.buildNumber,
        'gitBranch', options.gitBranch,
        'createTime', new Date().getTime()));

    if (err) {
        redisCacheErrors++;
        const diffTime = getDiffTime(startTime);
        redisMaxErrorTime = getMax(redisMaxErrorTime, diffTime);
        logger.error(`ERROR setting data in redis: ${err}`);
        slowREDISCallLogging('setItem', diffTime, true, end);
    } else {
        redisCacheSuccess++;
        const diffTime = getDiffTime(startTime);
        redisMaxSuccessTime = getMax(redisMaxSuccessTime, diffTime);
        logger.debug(`Success in setting data ${success}`);
        slowREDISCallLogging('setItem', diffTime, false, end);

        // async call dont need to worry about response
        // set exp when we set item
        await setCacheExpirationTime(redisKey, CACHE_EXPIRE_TIME);
    }
}

async function setAPIItem(redisKey, expTime, ...args) {
    redisCallCount.setAPIItem++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().phset(redisKey, args));

    if (err) {
        redisCacheErrors++;
        const diffTime = getDiffTime(startTime);
        redisMaxErrorTime = getMax(redisMaxErrorTime, diffTime);
        logger.error(`ERROR setting API data in redis: ${err}`);
        slowREDISCallLogging('setAPIItem', diffTime, true, end);
    } else {
        redisCacheSuccess++;
        const diffTime = getDiffTime(startTime);
        redisMaxSuccessTime = getMax(redisMaxSuccessTime, diffTime);
        logger.debug(`Success in setting data ${success}`);
        slowREDISCallLogging('setAPIItem', diffTime, false, end);

        // async call dont need to worry about response
        // set exp when we set item
        if (expTime) {
            await setCacheExpirationTime(redisKey, expTime);
        }
    }
}

async function getAPIItem(redisKey) {
    let results;
    redisCallCount.getAPIItem++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().phgetall(redisKey));

    if (err) {
        redisCacheErrors++;
        const diffTime = getDiffTime(startTime);
        redisMaxErrorTime = getMax(redisMaxErrorTime, diffTime);
        logger.error(`ERROR getting API data in redis: ${err}`);
        slowREDISCallLogging('getAPIItem', diffTime, true, end);
    } else {
        redisCacheSuccess++;
        const diffTime = getDiffTime(startTime);
        redisMaxSuccessTime = getMax(redisMaxSuccessTime, diffTime);
        logger.debug(`Success in setting data ${success}`);
        slowREDISCallLogging('getAPIItem', diffTime, false, end);
        results = success;
    }

    return results;
}

// throw error or number of items on success
async function getDbsize() {
    redisCallCount.dbsize++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().pdbsize(prefix));

    return processResponse(err, success, startTime, 'pdbsize', end);
}

// throw error or return undefined on success
async function flushAll() {
    redisCallCount.flush++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().punlink(prefix));

    return processResponse(err, success, startTime, 'punlink', end);
}

// throw error or return undefined on success
async function getAllKeys(keyId = '*') {
    redisCallCount.keys++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().pscan(keyId));

    return processResponse(err, success, startTime, 'pscan', end);
}

// throw error or return undefined on success
async function deleteItem(key) {
    redisCallCount.deleteItem++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().pdelete(key));

    return processResponse(err, success, startTime, 'pdelete', end);
}

async function info() {
    redisCallCount.info++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().pinfo());

    return processResponse(err, success, startTime, 'pinfo', end);
}

async function clusterInfo() {
    redisCallCount.clusterInfo++;
    redisCallCount.total++;
    redisCallCount.info++;
    redisCallCount.total++;
    const startTime = process.hrtime();
    const end = redisDurationMicroseconds.startTimer();
    const [err, success] = await asyncWrapper(getRedisHandle().pclusterInfo());

    return processResponse(err, success, startTime, 'pclusterInfo', end);
}

export {
    BUILD_NUMBER_STRING,
    getRedisMetrics,
    getAPIItem,
    setupRedis,
    setBypassRedis,
    fetch,
    setAPIItem,
    setItem,
    setCacheExpirationTime,
    getDbsize,
    flushAll,
    deleteItem,
    getAllKeys,
    isRedisEnabled,
    getRedisHandle,
    getPrefix,
    info,
    clusterInfo,
    pttl
};
