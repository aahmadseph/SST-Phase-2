/* eslint-disable object-curly-newline */
import {
    resolve,
    basename
} from 'path';
import process from 'node:process';

import {
    setConfigurationCacheItem,
    getConfigurationCacheItem,
    getConfigurationKey
} from '#server/services/utils/configurationCache.mjs';
import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    ENABLE_CONFIGURATION_UPDATE,
    CONFIGURATION_CACHE_REFERSH_TIME,
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    getURL
} from '#server/services/utils/configCacheUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export default async function getConfiguration(options = {
    country: 'US'
}) {

    if (ENABLE_CONFIGURATION_UPDATE) {
        const confiApi = getConfigurationCacheItem(options);

        if (confiApi && confiApi.value) {
            if (new Date().getTime() > confiApi.timestamp) {
                process.send({
                    'request': 'refreshConfigAPI',
                    key: getConfigurationKey(options)
                });
                logger.verbose('Request to update cache from getConfiguration()!');
            }

            logger.verbose('Return configuration data from worker thread.');

            return Promise.resolve(confiApi.value);
        } else {
            process.send({
                'request': 'refreshConfigAPI',
                key: getConfigurationKey(options)
            });
            logger.info('Config cache enabled, but no data stored! Attemmpting to update cache from getConfiguration()');
        }
    } else {
        const confiApi = getConfigurationCacheItem(options);

        if (confiApi && confiApi.value) {
            logger.info('ENABLE_CONFIGURATION_UPDATE is false.  Return configuration data set by middleware');

            return Promise.resolve(confiApi.value);
        }
    }

    const addCaching = Object.assign({}, options, {
        cacheTime: (+CONFIGURATION_CACHE_REFERSH_TIME),
        cacheKey: `/v1/dotcom/util/configuration?ch=${options.channel}`
    });

    logger.info('Return configuration data from call configuration outside of worker thread.');

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, getURL(options), 'GET', addCaching)
        .then(results => {
            if (ENABLE_CONFIGURATION_UPDATE) {
                setConfigurationCacheItem(options, results);
            }

            return Promise.resolve(results);
        });
}
