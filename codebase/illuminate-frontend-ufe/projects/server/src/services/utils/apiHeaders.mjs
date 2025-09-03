/* eslint-disable object-curly-newline */
import crypto from 'node:crypto';

import {
    BUILD_NUMBER_STRING
} from '#server/config/envConfig.mjs';
import {
    DEVICE_ID,
    ACCESS_TOKEN
} from '#server/config/envRouterConfig.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

function getSourceValue(options) {
    const channel = (options && options.channel ? options.channel.toLowerCase() : '');
    const channelsMap = {
        mw: CHANNELS.MOBILE_WEB,
        iphoneapp: CHANNELS.IPHONE_APP,
        androidapp: CHANNELS.ANDROID_APP,
        rwd: CHANNELS.RWD
    };

    return channelsMap[channel] || CHANNELS.WEB;
}

function getATGAPIHeaders() {
    // format date EEE, d MMM yyyy HH:mm:ss 'UTC'
    const now = new Date();

    const utcTimestamp = Math.floor(now.getTime() / 1000) * 1000; // Round down to the nearest second

    const formattedDate = now.toUTCString().replace('GMT', 'UTC');

    const seed = `${DEVICE_ID}${utcTimestamp.toString()}`;

    const hmac = crypto.createHash('sha256'),
        hmacValue = hmac.update(seed).digest('hex');

    return {
        'Accept': 'application/json;charset=UTF-8',
        'SAAT': ACCESS_TOKEN,
        'HDTS': hmacValue,
        'TS': formattedDate
    };
}

const DEFAULT_GENERIC_HEADERS = {
    //TODO: to revert this after SDN-3598 will be resolved
    //'Accept': 'application/json;charset=UTF-8',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip'
};

function getAPIHeaders() {
    return DEFAULT_GENERIC_HEADERS;
}

function getConfigCacheHeaders(requestId, applicationName) {
    return {
        'Accept-Encoding': '*',
        'Accept': 'application/json;charset=UTF-8',
        'Cookie': [],
        'cookies-as-string': '',
        'Accept-Language': 'en-US,en;q=0.9,*;q=0.8',
        'User-Agent': `Nodezilla/1.0 ${applicationName} app worker`,
        'request-id': requestId
    };
}

function getSDNGraphQLHeaders(sdnAccessToken, clientName, apiKey) {
    return {
        'Authorization': `Bearer ${sdnAccessToken}`,
        'content-type': 'application/json',
        'apollographql-client-name': clientName,
        'apollographql-client-version': BUILD_NUMBER_STRING,
        'X-API-Key': apiKey
    };
}

export {
    getSourceValue,
    getATGAPIHeaders,
    getAPIHeaders,
    getConfigCacheHeaders,
    getSDNGraphQLHeaders
};
