import {
    parentPort
} from 'node:worker_threads';
import {
    resolve,
    basename
} from 'node:path';
import {
    memoryUsage
} from 'node:process';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    getConfigurationKey
} from '#server/services/utils/configurationCache.mjs';
import {
    filterHeaders
} from '#server/framework/services/apiUtils/makeRequest.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    CONFIGURATION_CACHE_REFERSH_TIME,
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    getApplicationChannels
} from '#server/services/utils/routerUtils.mjs';
import {
    getURL,
    getConfigurationOptions
} from '#server/services/utils/configCacheUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const CHANNELS = getApplicationChannels();

const OPTION_MAPS = CHANNELS.map(channel => {
    const options = {
        channel,
        headers: {
            'request-id': process.pid
        }
    };
    const apiOption = getConfigurationOptions(options);
    apiOption.keepalive = false;
    return apiOption;
});

const getConfiguration = (options) => {
    return httpsRequest(SDN_API_HOST, SDN_API_PORT, getURL(options), 'GET', options);
};

// we can recieve many events that will trigger this
// so this allows us to reduce the number of calls to confighub
// from too many
let isInProgress = false;
async function updateConfigurationData() {

    if (isInProgress) {
        logger.info('API Calls in progress, waiting until they resolve!');
        return;
    }
    isInProgress = true;

    const apiCalls = Promise.allSettled(OPTION_MAPS.map(options => getConfiguration(options))).catch(err => logger.error(stringifyMsg(err)));

    const results = await apiCalls;
    const responseData = results.map((item, index) => {

        const {
            status,
            value
        } = item;
        const optionData = OPTION_MAPS[index];
        const key = getConfigurationKey(optionData);

        const resp = {};

        if (status === 'fulfilled') {
            const {
                headers,
                data
            } = value;

            const filteredData = filterHeaders(headers, data);

            resp[key] = Object.assign({}, filteredData, {
                cacheTime: CONFIGURATION_CACHE_REFERSH_TIME,
                channel: optionData.channel,
                country: optionData.country,
                language: optionData.language
            });
            logger.verbose(`Worker cache update for KEY: ${key}`);
        } else {
            logger.warn(`Worker cache update FAILED for KEY: ${key}`);
        }

        return resp;
    });
    logger.info(`Request to update cache has completed! Memory stats ${stringifyMsg(memoryUsage())}`);
    isInProgress = false;

    // tell parent here is the data
    parentPort.postMessage({
        request: 'configAPIs',
        data: responseData
    });
}

parentPort.on('message', msg => {
    if (msg['request'] === 'refreshConfigAPI') {
        logger.verbose('Request to update cache from parent recieved!');
        updateConfigurationData();
    }
});

updateConfigurationData();
