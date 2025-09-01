import {
    resolve,
    basename
} from 'path';
import process from 'node:process';
import crypto from 'node:crypto';

import {
    safelyParse
} from '#server/utils/serverUtils.mjs';
import {
    CONFIGURATION_CACHE_REFERSH_TIME,
    ENABLE_CONFIGURATION_UPDATE
} from '#server/config/envRouterConfig.mjs';
import {
    getApplicationChannels
} from '#server/services/utils/routerUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

// global in the process memory cache object
// specifically for configuration api data
const configurationCache = new Map();

const CHANNELS = getApplicationChannels().map(channel => channel.toUpperCase());

const lookupChannel = (options) => {
    const channel = options?.channel?.toUpperCase();
    // look up what is being passed in or default to RWD, which is channel @ 2
    return channel && CHANNELS.includes(channel) ? channel : CHANNELS[2];
};

// returns key given an object that contains
// { channel, country, language }
const getConfigurationKey = ENABLE_CONFIGURATION_UPDATE ? (options = {}) => {
    return lookupChannel(options).toLowerCase();
} : (options = {}) => {
    return `${lookupChannel(options)}${options.requestId || ''}`.toLowerCase();
};
const getConfigurationCacheItem = (options = {}) => {
    const key = getConfigurationKey(options);

    let results;

    if (key) {
        results = configurationCache.get(key);
    }

    return results;
};

const clearConfigurationCache = () => {
    configurationCache.clear();
};

const setConfigurationCacheItem = (options = {}, value) => {
    const key = getConfigurationKey(options);

    if (key) {
        const timestamp = new Date().getTime() + CONFIGURATION_CACHE_REFERSH_TIME;
        const hash = crypto.createHmac('sha256', 'changes happen').update(value.data).digest('hex');

        const oldConfig = getConfigurationCacheItem(options);
        if (oldConfig && oldConfig.hash && hash !== oldConfig.hash) {
            logger.info(`Configuration data changed, here is the old data: ${oldConfig?.value?.data} and here is the new data: ${value.data}`);
        }

        logger.verbose(`Setting item in config cache with key: ${key}`);
        configurationCache.set(key, {
            timestamp,
            hash,
            value
        });
    }
};

const deleteConfigurationCacheItem = (options = {}) => {
    const key = getConfigurationKey(options);

    if (key) {
        configurationCache.delete(key);
    }
};

const getConfigurationValue = (options = {}, property, defaultValue = false) => {
    let result = defaultValue;
    const config = getConfigurationCacheItem(options);

    if (config && config.value && property) {
        const configJson = safelyParse(config.value.data);

        if (property.includes('.')) {
            const parts = property.split('.');
            let configBase = configJson;
            let found = true;
            for (const element of parts) {
                if (!configBase[element]) {
                    found = false;
                    break;
                }
                configBase = configBase[element];
            }
            result = found ? configBase : result;
        } else if (configJson[property] !== null) {
            result = configJson[property];
        }

        // expired
        if (config.timestamp && Date.now() > config.timestamp) {
            process.send({
                'request': 'refreshConfigAPI',
                key: getConfigurationKey(options)
            });
            logger.verbose('Request to update cache from getConfigurationValue()');
        }
    }

    return result;
};

export {
    getConfigurationValue,
    getConfigurationKey,
    getConfigurationCacheItem,
    setConfigurationCacheItem,
    clearConfigurationCache,
    deleteConfigurationCacheItem
};
