/* eslint no-shadow: 0*/
import fs from 'node:fs';
import {
    resolve,
    basename
} from 'path';
import zlib from 'node:zlib';

import * as redisWrapper from '#server/services/utils/redisWrapper.mjs';
import {
    getBodyBuffer
} from '#server/services/utils/urlUtils.mjs';
import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    WritableStream
} from '#server/libs/WritableStream.mjs';
import {
    sendOKResponse
} from '#server/utils/sendOKResponse.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    BUILD_INFO,
    SERVER_HOME
} from '#server/config/envConfig.mjs';
import {
    CACHE_MANAGER_USERNAME,
    CACHE_MANAGER_PASSWORD
} from '#server/config/envRouterConfig.mjs';
import {
    HOUR
} from '#server/config/TimeConstants.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const DEFAULT_ERROR_MSG = 'Something went wrong! Check username and password?';

// cryptic :)
// url would be u=xxx&p=yyy&c=s to get db size
// obfuscate to hide some from hackers
// these are the form fields and are obfuscated
const parameterMap = {
    u: 'username',
    p: 'password',
    c: 'command',
    k: 'key',
    x: 'key',
    bp: 'checked'
};

// for c which is the command to run, the available values are
// in this map
const valueMap = {
    g: 'fetch',
    s: 'getDbsize',
    f: 'flushAll',
    b: 'setBypassRedis',
    d: 'deleteItem',
    a: 'getAllKeys',
    i: 'info',
    c: 'clusterInfo'

};

let cacheManagerPage;

const REDIS_CONFIG_PREFIX = (redisWrapper.getPrefix() ? redisWrapper.getPrefix() : ''),
    REDIS_PREFIX_RW = new RegExp('{{REDIS_PREFIX}}', 'g'),
    REDIS_PREFIX_RW_BR = new RegExp('{{REDIS_PREFIX_BR}}', 'g'),
    REDIS_CONFIG_PREFIX_BR = (redisWrapper.getPrefix() ? '<br>Redis DB Prefix ' + redisWrapper.getPrefix() : '');

async function sendCacheManagerPage() {
    return new Promise((resolve, reject) => {
        if (!cacheManagerPage) {
            const results = new WritableStream();
            fs.createReadStream(`${SERVER_HOME}/src/views/cacheManager.html`)
                .pipe(results)
                .on('error', (err) => {
                    logger.error(err);
                    reject(err);
                }).on('finish', () => {
                    cacheManagerPage = results.toString();

                    cacheManagerPage = cacheManagerPage.replace('{{BUILD_NUMBER}}', BUILD_INFO['BUILD_NUMBER'])
                        .replace('{{GIT_BRANCH}}', BUILD_INFO['GIT_BRANCH'])
                        .replace('{{GIT_COMMIT}}', BUILD_INFO['GIT_COMMIT'])
                        .replace(REDIS_PREFIX_RW_BR, REDIS_CONFIG_PREFIX_BR)
                        .replace(REDIS_PREFIX_RW, REDIS_CONFIG_PREFIX);

                    resolve(cacheManagerPage);
                });
        } else {
            resolve(cacheManagerPage);
        }
    });
}

export async function sendCacheManagerPageResponse(request, response) {
    const [errx, htmlDocx] = await asyncWrapper(sendCacheManagerPage());

    if (htmlDocx) {
        sendOKResponse(request.headers, '', response,
            htmlDocx, false, undefined);
    } else {
        sendErrorResponse(response, errx);
    }
}

function getPostdata(request) {

    const postData = getBodyBuffer(request);
    logger.debug(`POST Data: ${postData}`);

    return (postData ? new URLSearchParams(postData) : undefined);
}

export async function postCacheManager(request, response) {

    const params = getPostdata(request);

    if (!params) {
        // no data send generic error
        sendErrorResponse(response, DEFAULT_ERROR_MSG, {
            sendErrorPage: false
        });
        logger.error('No parameters passed!');

        return;
    }

    const urlCommands = Array.from(params.keys()).filter(key => {
        return parameterMap[key];
    }).map(item => {
        const value = params.get(item);

        return {
            [parameterMap[item]]: (valueMap[value] || value)
        };
    });

    if (!urlCommands || urlCommands.length === 0) {
        sendErrorResponse(response, DEFAULT_ERROR_MSG, {
            sendErrorPage: false
        });
        logger.error('Invalid parameters sent!');

        return;
    }

    logger.verbose(`URL Command: ${stringifyMsg(urlCommands)}`);
    const action = urlCommands.reduce((acc, next) => {
        return Object.assign({}, acc, next);
    });

    if (!action || !action.command || typeof redisWrapper[action.command] !== 'function') {
        sendErrorResponse(response, DEFAULT_ERROR_MSG, {
            sendErrorPage: false
        });
        logger.error('No valid action!');

        return;
    }

    // we only call a command if username and password match what we got
    if (CACHE_MANAGER_USERNAME !== action.username || CACHE_MANAGER_PASSWORD !== action.password) {
        sendErrorResponse(response, DEFAULT_ERROR_MSG, {
            sendErrorPage: false
        });
        logger.error('Authorization failed!');

        return;
    }

    if (action.command === 'deleteItem' || action.command === 'fetch' || action.command === 'getAllKeys') {
        action.key = decodeURIComponent(action.key);
    }

    const [err, data] = (action.key ?
        await asyncWrapper(redisWrapper[action.command](action.key, '', true)) :
        await asyncWrapper(redisWrapper[action.command]()));

    if (!err) {
        if (action.command === 'fetch') {
            // for fetch we want ttl of key also
            const [terr, tdata] = await asyncWrapper(redisWrapper.pttl(action.key));
            let pttlResult;

            if (terr) {
                pttlResult = `Error: ${terr}`;
            } else if (tdata < 0) {
                pttlResult = `Error RC: ${tdata}`;
            } else {
                const ttl = Math.trunc(tdata * 100 / HOUR) / 100;
                const hours = Math.trunc(ttl),
                    minutes = Math.trunc((ttl - hours) * 60);
                pttlResult = `${hours} Hours and ${minutes} minutes`;
            }

            const dataCopy = Object.assign({}, data, {
                pttl: pttlResult
            });
            const decompressHTML = (request.apiOptions?.headers?.Cookie?.['decompressHTML']);

            if (decompressHTML && dataCopy.compressed && dataCopy.html) {
                zlib.gunzip(dataCopy.html, (err, data) => {
                    if (!err) {
                        dataCopy.html = data.toString();
                    }

                    logger.debug(`TTL call resulted in : ${pttlResult}`);
                    sendOKResponse(request.headers, '', response,
                        stringifyMsg(dataCopy), false, undefined);
                });
            } else {
                // don't send the html buffer
                delete dataCopy.html;
                logger.debug(`TTL call resulted in : ${pttlResult}`);
                sendOKResponse(request.headers, '', response,
                    stringifyMsg(dataCopy), false, undefined);
            }
        } else {
            sendOKResponse(request.headers, '', response,
                stringifyMsg(data), false, undefined);
        }
    } else {
        sendErrorResponse(response, DEFAULT_ERROR_MSG, {
            sendErrorPage: false
        });
        logger.error(`REDIS error: ${stringifyMsg(err)}`);
    }
}
