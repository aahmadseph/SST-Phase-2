/* eslint object-curly-newline: 0 */
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';
import {
    memoryUsage
} from 'node:process';
import {
    getHeapStatistics
} from 'node:v8';

import {
    MAX_MEMORY_ITEMS,
    PURGE_ITEM_PERCENT
} from '#server/config/envConfig.mjs';
import {
    getDiffTime
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const {
    'heap_size_limit': totalAvailableSize
} = getHeapStatistics();
// we've set max_old_space_size
const MAX_HEAP_SHOULD_USE = Math.ceil(0.9 * totalAvailableSize);

const AMPERSANDS = /^\&|\&\&|\&$/,
    TEMPLATE_RESOLVER_LEN = '/templateResolver?'.length;

// NOTE these globals are only accessible in the master process
// or any process that imports memoryCache
const memory = new Map(),
    purgeItemsCount = Math.ceil(MAX_MEMORY_ITEMS * PURGE_ITEM_PERCENT / 100);

let purgeEventCountSinceLastCall = 0,
    cacheSetsSinceLastCall = 0,
    cacheMissesSinceLastCall = 0,
    cacheHitsSinceLastCall = 0;

// tries to remove the hash from the URL
// returns object with the hash and rest of url
function splitHash(iurl) {
    const surl = (iurl || '').slice(TEMPLATE_RESOLVER_LEN).toLowerCase(),
        parts = new URLSearchParams(surl);
    const hashKey = parts.get('hash');

    if (!hashKey) {
        return undefined;
    }

    const hashPart = 'hash=' + hashKey;

    // we strip out the hash, the templateResolver, trailing amp
    return {
        refURL: surl.replace(hashPart, '').replace(AMPERSANDS, ''),
        hash: hashKey
    };
}

function sortKeys(a, b) {
    const ma = memory.get(a),
        mb = memory.get(b);

    return mb.createTime - ma.createTime;
}

const MEMORY_NOT_SET_EXISTS = 1,
    MEMORY_SET_SUCCESSFULLY = 2;

function setMemoryCache(url, html) {
    const urlParts = splitHash(url);

    if (!urlParts || !urlParts.refURL || !urlParts.hash) {
        throw new Error('Could not find hash in url!');
    }

    const cacheItem = memory.get(urlParts.refURL);

    if (cacheItem && cacheItem.hashKey === urlParts.hash) {
        // this exact item is already in memory so just return
        return MEMORY_NOT_SET_EXISTS;
    }

    // get the keys to check if we need to dump memory items
    const { heapTotal } = memoryUsage();
    if (memory.size > (+MAX_MEMORY_ITEMS - 1) || heapTotal > MAX_HEAP_SHOULD_USE) {
        const startTime = process.hrtime();

        const keys = Array.from(memory.keys());

        // sort the keys based on createTime
        keys.sort(sortKeys);

        for (let i = 0; i < purgeItemsCount; i++) {
            const currentKey = keys[i];

            if (currentKey && memory.get(currentKey)) {
                memory.delete(currentKey);
            }
        }

        logger.info(`Purge event end: ${getDiffTime(startTime)} and removed: ${purgeItemsCount}.`);
        purgeEventCountSinceLastCall++;
    }

    cacheSetsSinceLastCall++;
    memory.set(urlParts.refURL, {
        'hashKey': urlParts.hash,
        'html': html,
        'createTime': Date.now()
    });

    logger.debug(`Memory size ${memory.size}.`);

    return MEMORY_SET_SUCCESSFULLY;
}

function getMemoryCache(iUrl) {
    const urlParts = splitHash(iUrl),
        result = {
            'html': undefined
        };

    if (!urlParts || !urlParts.refURL || !urlParts.hash) {
        logger.warn(`URL does not contain hash key ${iUrl}`);
    } else if (memory.get(urlParts.refURL)) {
        const cacheItem = memory.get(urlParts.refURL);

        if (cacheItem.hashKey === urlParts.hash) {
            result['html'] = cacheItem['html'];
            result['compressed'] = cacheItem['compressed'];
            result['createTime'] = Date.now();
            memory.set(urlParts.refURL, cacheItem);
            cacheHitsSinceLastCall++;
        } else {
            // remove the key from both
            memory.delete(urlParts.refURL);
            cacheMissesSinceLastCall++;
        }
    }

    return result;
}

// dump the memory items minus the HTML
// the HTML is likely gzipped
function dumpMemoryCache() {
    const memoryKeys = Array.from(memory.keys());

    const memoryItemsAsJSON = memoryKeys.map(key => {
        const item = memory.get(key);

        return {
            [key]: {
                'hashKey': item.hashKey,
                'createTime': item.createTime
            }
        };
    }).reduce((acc, next) => {
        return Object.assign({}, acc, next);
    });

    return JSON.stringify(memoryItemsAsJSON);
}

function getMemoryObject() {
    return memory;
}

function getPurgeItemsCount() {
    return purgeItemsCount;
}

function getMemoryCounts() {
    return {
        purgeEventCountSinceLastCall,
        cacheSetsSinceLastCall,
        cacheMissesSinceLastCall,
        cacheHitsSinceLastCall
    };
}

function resetMemoryCounters() {
    purgeEventCountSinceLastCall = 0;
    cacheSetsSinceLastCall = 0;
    cacheMissesSinceLastCall = 0;
    cacheHitsSinceLastCall = 0;
}

export {
    splitHash,
    sortKeys,
    setMemoryCache,
    getMemoryCache,
    getMemoryObject,
    dumpMemoryCache,
    getPurgeItemsCount,
    getMemoryCounts,
    resetMemoryCounters,
    MEMORY_NOT_SET_EXISTS,
    MEMORY_SET_SUCCESSFULLY
};
