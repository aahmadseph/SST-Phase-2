import {
    resolve,
    basename
} from 'path';

import {
    setConfigurationCacheItem,
    deleteConfigurationCacheItem
} from '#server/services/utils/configurationCache.mjs';
import {
    stringifyMsg,
    safelyParse,
    getError
} from '#server/utils/serverUtils.mjs';
import {
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';
import {
    ENABLE_CONFIGURATION_UPDATE,
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import asyncWrapper from '#server/utils/PromiseWrapper.mjs';
import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import {
    MINUTE
} from '#server/config/TimeConstants.mjs';
import {
    isHealthcheckURL,
    isNonePageRoute,
    getApplicationChannels
} from '#server/services/utils/routerUtils.mjs';
import {
    getURL,
    getConfigurationOptions
} from '#server/services/utils/configCacheUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const COOKIE_EXPIRATION_TIME = 5 * MINUTE;
const APPLICATION_CHANNELS = getApplicationChannels();

async function callConfigAPI(options) {
    return httpsRequest(SDN_API_HOST, SDN_API_PORT, getURL(options), 'GET', options);
}

function setConfigCache(configResults, options) {
    const {
        data,
        headers
    } = configResults;
    const {
        country,
        language,
        ...optClone
    } = options;

    optClone.country = country;
    optClone.language = language;
    APPLICATION_CHANNELS.forEach(channel => {
        optClone.channel = channel.toLowerCase();
        setConfigurationCacheItem(optClone, {
            data,
            headers,
            channel: optClone.channel,
            country,
            language
        });
    });
}

function updateCookies(request, response, configValues) {

    // some cookie stuff for more stickiness in this code
    request.apiOptions.headers.Cookie[COOKIES_NAMES.CONFIG_CACHE] = configValues;
    request.cookies[COOKIES_NAMES.CONFIG_CACHE] = configValues;
    response.cookie(
        COOKIES_NAMES.CONFIG_CACHE,
        configValues, {
            path: '/',
            maxAge: COOKIE_EXPIRATION_TIME,
            secure: true,
            httpOnly: true,
            sameSite: true
        }
    );
}

async function getConfigData(apiOptions) {

    // call confighub and set the data
    const options = getConfigurationOptions(apiOptions);
    const [err, configResults] = await asyncWrapper(callConfigAPI(options));
    if (configResults) {
        setConfigCache(configResults, options);
        //logger.silly(configResults);
        logger.info(stringifyMsg({
            'msg': 'Got data from confighub',
            requestId: options.headers['request-id'] || '',
            url: options.apiPath
        }));
    } else {
        logger.error(`Could not get data from confighub ${getError(err)}`);
    }
    return configResults;
}

// this is only needed for preview as other environments can have the memory cache enabled
export default async function configCacheMiddleware(request, response, next) {

    // any env that ENABLE_CONFIGURATION_UPDATE is false can use this
    if (!ENABLE_CONFIGURATION_UPDATE) {

        const {
            apiOptions
        } = request;

        // skip this code on static assests
        const isAsset = isNonePageRoute(apiOptions.apiPath);
        if (isAsset && !apiOptions.apiPath.includes('/favicon') || isHealthcheckURL(apiOptions.apiPath)) {
            next();
            return;
        }

        const configResults = await getConfigData(apiOptions);

        const isConfigValueParam = request.query?.setConfigValue;
        const configValues = isConfigValueParam || apiOptions.headers.Cookie[COOKIES_NAMES.CONFIG_CACHE];

        if (configValues) {
            const cacheItem = {
                headers: configResults?.headers || {},
                data: safelyParse(configResults?.data) || {}
            };

            const requestId = apiOptions.headers['request-id'];
            request.apiOptions.requestId = requestId;

            if (configValues.includes('|')) {
                configValues.split('|').forEach(configValue => {
                    const [key, value] = configValue.split(':');
                    cacheItem.data[key] = safelyParse(value);
                });
                cacheItem.data = stringifyMsg(cacheItem.data);
            } else if (configValues.includes(':')) {
                const [key, value] = configValues.split(':');
                cacheItem.data[key] = safelyParse(value);
                cacheItem.data = stringifyMsg(cacheItem.data);
            }

            logger.debug(cacheItem);
            const {
                ...options
            } = apiOptions;
            options.requestId = requestId;
            APPLICATION_CHANNELS.forEach(channel => {
                options.channel = channel.toLowerCase();
                setConfigurationCacheItem(options, cacheItem);
            });

            logger.info(`Custom confighub options set ${isConfigValueParam ? 'from URL' : 'from cookie'} set private cache ${configValues}.`);

            // only set cookie when we have URL parameter
            // this is so we don't update the cookie all the time
            if (isConfigValueParam) {
                updateCookies(request, response, configValues);
            }

            response.on('finish', () => {
                const {
                    ...delOpts
                } = apiOptions;
                delOpts.requestId = requestId;
                APPLICATION_CHANNELS.forEach(channel => {
                    delOpts.channel = channel.toLowerCase();
                    deleteConfigurationCacheItem(delOpts);
                });
            });
        }
    }

    next();
}
