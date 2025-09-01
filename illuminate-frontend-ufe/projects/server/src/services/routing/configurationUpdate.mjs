import {
    resolve,
    basename
} from 'node:path';
import {
    release
} from 'node:os';

import {
    setConfigurationCacheItem
} from '#server/services/utils/configurationCache.mjs';
import {
    ENABLE_CONFIGURATION_UPDATE
} from '#server/config/envRouterConfig.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default function updateConfigs() {
    if (ENABLE_CONFIGURATION_UPDATE) {
        process.on('message', msg => {
            if (msg.request === 'updateConfigurationData' && msg.data) {
                logger.verbose('Request to update cache recieved, will notify !');
                Object.keys(msg.data).map(index => {
                    return msg.data[index];
                }).forEach(results => {
                    const keys = Object.keys(results);

                    if (keys.length < 1) {
                        return;
                    }

                    const key = keys[0];

                    if (!key) {
                        return;
                    }

                    const {
                        cacheTime,
                        ...dataObj
                    } = results[key];

                    if (cacheTime && dataObj && dataObj.data && dataObj.headers) {
                        // update global config cache
                        const options = {};
                        options.channel = dataObj.channel;
                        options.country = dataObj.country;
                        options.language = dataObj.language;
                        setConfigurationCacheItem(options, dataObj);
                        logger.verbose(`Data set in cache from config apis via worker thread using KEY: ${key}`);
                    }
                });
            }
        });
    }
}

if (ENABLE_CONFIGURATION_UPDATE && release() === 'linux') {
    setTimeout(() => {
        process.send({
            'request': 'refreshConfigAPI'
        });
    }, 150);
}
