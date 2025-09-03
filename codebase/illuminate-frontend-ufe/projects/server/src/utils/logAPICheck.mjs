import {
    resolve,
    basename
} from 'path';
import {
    safelyParse,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import { getConfigurationValue } from '#server/services/utils/configurationCache.mjs';
import Logger from '#server/libs/Logger.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

const isInConfiguration = (configurationAPIs = {}, originalUrl = '', apiPath = '') => {
    return Object.values(configurationAPIs).some((url) => originalUrl.includes(url) || apiPath.includes(url));
};

const logResponse = ({
    url, requestHeaders, response
}) => {
    const output = { ...response };
    output.data = safelyParse(response.data) || response.data;
    output.originalUrl = url;
    output.requestHeaders = requestHeaders;
    logger.info(stringifyMsg(output));
};
const logAPICheck = (func) => {
    return (...args) => {
        const data = func(...args);
        const dataForLogging = data;

        const options = args[0];
        const apiUrl = options?.url;
        const apiPath = options?.apiPath;
        const requestHeaders = options?.headers;

        const logIncomingAPIs = getConfigurationValue(options, 'logIncomingAPIs', false);

        if (!!logIncomingAPIs && isInConfiguration(logIncomingAPIs, apiUrl, apiPath)) {
            dataForLogging.then((response) => {
                logResponse({
                    url: apiUrl,
                    requestHeaders,
                    response
                });
            }).catch((error) => {
                logResponse({
                    url: apiUrl,
                    requestHeaders,
                    response: error
                });
            });
        }

        return data;
    };
};

export default logAPICheck;
