//const deepExtend = require('utils/deepExtend');
import authGetSdnToken from '#server/services/api/oauth/sdn/getSdnToken.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';
import {
    safelyParse
} from '#server/utils/serverUtils.mjs';

const SDN_TOKEN = {
    [CHANNELS.ANDROID_APP]: {},
    [CHANNELS.IPHONE_APP]: {},
    [CHANNELS.WEB]: {},
    [CHANNELS.RWD]: {}
};

const callWithSdnToken = function (callFunc, defOptions, retryOnFailure = false) {
    const optionsClone = {
        ...defOptions
    };

    return getSdnToken(optionsClone).then(sdnAccessToken => {
        const options = {
            ...optionsClone,
            sdnAccessToken
        };

        return callFunc(options).catch(error => {
            // If getting 401 Unauthorized, purge token cache and try again
            if (error.statusCode === 401 && retryOnFailure) {
                dropSdnToken(options);

                return callWithSdnToken(callFunc, defOptions, false);
            }

            throw error;
        });
    });
};

const dropSdnToken = function (options) {
    SDN_TOKEN[options.channel].token = '';
};

const getSdnToken = function (options) {
    const authToken = SDN_TOKEN[options.channel].token;
    const authTokenExpiresIn = SDN_TOKEN[options.channel].expiresIn;

    if (authToken && authTokenExpiresIn > 30) {
        return Promise.resolve(authToken);
    }

    return authGetSdnToken(options).then(response => {
        const authData = safelyParse(response.data);

        if (!authData.access_token || !authData.expires_in || authData.access_token.length === 0) {
            throw new Error(`Invalid ${options.channel} authentication response.`);
        }

        const expiresIn = parseInt(authData.expires_in);

        if (expiresIn > 30) {
            SDN_TOKEN[options.channel].token = authData.access_token;
            SDN_TOKEN[options.channel].expiresIn = expiresIn;
        }

        return authData.access_token;
    });
};

const withSdnToken = function (callFunc) {
    return (options) => {
        return callWithSdnToken(callFunc, options, true);
    };
};

export {
    callWithSdnToken,
    dropSdnToken,
    getSdnToken,
    withSdnToken
};
