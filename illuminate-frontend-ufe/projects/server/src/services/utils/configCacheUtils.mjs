import {
    getSourceValue,
    getConfigCacheHeaders
} from '#server/services/utils/apiHeaders.mjs';
import {
    APPLICATION_NAME
} from '#server/config/envConfig.mjs';

const getURL = (options) => {
    return `/v1/dotcom/util/configuration?ch=${getSourceValue(options)}`;
};

const getConfigurationOptions = (options) => {
    const {
        country = 'US',
        language = 'en',
        channel,
        headers = {}
    } = options;
    const configCacheHeaders = getConfigCacheHeaders(headers['request-id'], APPLICATION_NAME);
    return {
        channel,
        country,
        language,
        url: '/',
        apiPath: '/',
        isMockedResponse: false,
        headers: configCacheHeaders
    };
};

export {
    getURL,
    getConfigurationOptions
};
