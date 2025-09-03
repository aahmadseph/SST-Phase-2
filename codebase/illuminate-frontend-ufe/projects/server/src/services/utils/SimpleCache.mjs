/* eslint object-curly-newline: 0, class-methods-use-this: 0 */
import {
    resolve,
    basename
} from 'node:path';
import {
    getHeapStatistics
} from 'node:v8';
import {
    memoryUsage
} from 'node:process';

import {
    getMax,
    getDiffTime
} from '#server/utils/serverUtils.mjs';
import {
    SIMPLE_CACHE_MAX_SIZE,
    SIMPLE_CACHE_PURGE_PERCENT
} from '#server/config/envRouterConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const {
    'heap_size_limit': totalAvailableSize
} = getHeapStatistics();

// we've set max_old_space_size
const MAX_HEAP_SHOULD_USE = Math.ceil(0.9 * totalAvailableSize);

const COMMA_SPLIT = /\,/g;

// simple cache wrapper class
class SimpleCache {

    // TODO swich to this syntax
    //static #cache = {};

    constructor() {
        this.cache = new Map();
        this.maxCacheItems = SIMPLE_CACHE_MAX_SIZE;
        this.purgeCount = Math.ceil(this.maxCacheItems * SIMPLE_CACHE_PURGE_PERCENT / 100);
        this.postPurgeCount = this.maxCacheItems - this.purgeCount;
        this.numberOfCachePurges = 0;
        this.maxCachePurgeTime = 0;
    }

    setCache(key, data, ttl) {

        if (ttl > 0 && key && data) {

            // ttl is milliseconds of life
            const ts = new Date().getTime() + +ttl;

            // if we are high on heap, purge
            const {
                heapTotal
            } = memoryUsage();

            if (this.cache.size >= this.maxCacheItems || heapTotal > MAX_HEAP_SHOULD_USE) {
                this.purge();
            }

            logger.debug(`Setting cache with key: ${key} and time: ${ts}`);
            this.cache.set(key, {
                'data': data,
                'expireTime': ts,
                'ttl': ttl
            });
        }
    }

    getCache(key) {

        let result;

        if (key) {
            const item = this.cache.get(key);

            if (item) {
                // time now minus the expiration time
                const timediff = new Date().getTime() - item.expireTime;

                // ttl should be greater than timediff
                if (item.ttl > timediff && item.data) {
                    logger.debug(`Cache HIT with key ${key} and time: ${timediff}`);
                    result = item.data;
                } else {
                    logger.debug(`Cache MISS with key ${key} and time: ${timediff}`);
                    this.cache.delete(key);
                }
            }
        }

        return result;
    }

    size() {
        return this.cache.size;
    }

    getMetrics() {

        const metrics = {
            cacheCount: this.size(),
            numberOfCachePurges: this.numberOfCachePurges,
            maxCachePurgeTime: this.maxCachePurgeTime,
            maxCacheItems: this.maxCacheItems,
            purgeCount: this.purgeCount
        };

        this.numberOfCachePurges = 0;
        this.maxCachePurgeTime = 0;

        return metrics;
    }

    flush() {
        logger.info(`Simple cache flushed of ${this.cache.size} items.`);
        this.cache.clear();
    }

    sortKeys(a, b) {
        const ma = this.cache.get(a),
            mb = this.cache.get(b);

        return mb.expireTime - ma.expireTime;
    }

    purge() {

        const startTime = process.hrtime();
        const timenow = new Date().getTime();
        const end = (this.purgeCount < this.size() ? this.purgeCount : this.size());
        // get the oldest keys first
        const keys = Array.from(this.cache.keys());
        keys.sort.call(this, this.sortKeys);
        keys.forEach((key, index) => {
            if (index < end) {
                // delete anything old
                this.cache.delete(key);
            } else {
                // continue to delete anything stale
                const item = this.cache.get(key);

                if (item) {
                    const timediff = timenow - item.expireTime;

                    if (item.ttl <= timediff) {
                        this.cache.delete(key);
                    }
                }
            }
        });
        this.numberOfCachePurges++;
        const endTime = getDiffTime(startTime);
        this.maxCachePurgeTime = getMax(this.maxCachePurgeTime, endTime);
        logger.info(`Simple cache purge took: ${endTime} and purged: ${this.maxCacheItems - this.cache.size} items.`);
    }

    // convert URL paramter data into a usable list
    partialKeysToList(partialKeys = '') {
        if (!partialKeys || partialKeys.length === 0) {
            return [];
        }
        const keyList = partialKeys.split(COMMA_SPLIT).map(item => {
            const [
                partialKey,
                country
            ] = item.split(':');
            return {
                partialKey,
                country
            };
        });
        return keyList;
    }

    getFilteredKeys(partialKeysList) {
        // get the current set of keys
        const keys = Array.from(this.cache.keys());

        // size of this list never changes
        const end = partialKeysList.length;

        // map list A and list B together
        // the keys is the full cache key
        // the keyList may be only part of the key like P1234 without the SEO friendly url part
        // hate loop in loop
        return keys.filter(item => {
            let match = false;
            let i = 0;

            // try not to loop over EVERY item in keyList
            // like if first item is match we should be done
            while (!match && i < end) {
                const {
                    partialKey,
                    country
                } = partialKeysList[i];

                match = (country ?
                    item.includes(partialKey) && item.includes(country) :
                    item.includes(partialKey));
                i++;
            }
            return match;
        });
    }

    // partialKey: string = ''
    purgeByPartialKey(partialKeys = '') {
        const startTime = process.hrtime();

        const keyList = this.partialKeysToList(partialKeys);

        // map list A and list B together
        // the keys is the full cache key
        // the keyList may be only part of the key like P1234 without the SEO friendly url part
        // hate loop in loop
        const keysToPurge = this.getFilteredKeys(keyList);

        // maybe this item is not in our cache
        // so don't even try to purge
        if (keysToPurge.length > 0) {
            keysToPurge.forEach(item => {
                this.cache.delete(item);
            });
        }
        logger.info(`Simple cache purge by partial key took: ${getDiffTime(startTime)} and purged: ${keysToPurge.length} items using partial keys: ${partialKeys}.`);
    }

}

export default SimpleCache;
