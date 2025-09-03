import deepExtend from 'utils/deepExtend';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import getSdnAuthToken from 'services/api/authentication/getSdnAuthToken';

const sdnToken = {};

/*
    callWithSdnToken calls callFunc with sdnToken injected as a first argument.
    In case of 401 Unauthorized response - retries with a newly requested sdnToken
*/
sdnToken.callWithSdnToken = function (callFunc, args, retryOnFailure = false, sdnApplicationName) {
    /*
        To make sure original arguments are not mutated inside the callFunc
        pass a deep copy instead of original arguments,
        as we need original arguments for the second call.
    */
    const argsClone = deepExtend({}, { args }).args;

    return sdnToken.getSdnToken(sdnApplicationName).then(sdnAccessToken =>
        callFunc(sdnAccessToken, ...argsClone).then(data => {
            // If getting 401 Unauthorized, purge token cache and try again
            if (data.responseStatus === 401 && retryOnFailure) {
                sdnToken.dropSdnToken(sdnApplicationName);

                return sdnToken.callWithSdnToken(callFunc, args, false, sdnApplicationName);
            }

            return data;
        })
    );
};

sdnToken.dropSdnToken = function (sdnApplicationName) {
    Storage.local.removeItem(LOCAL_STORAGE[sdnApplicationName]);
};

sdnToken.getSdnToken = function (sdnApplicationName) {
    const authToken = Storage.local.getItem(LOCAL_STORAGE[sdnApplicationName]);

    if (authToken) {
        return Promise.resolve(authToken);
    }

    let clientName;

    if (sdnApplicationName === 'BV_AUTH_TOKEN') {
        clientName = getSdnAuthToken.SDN_AUTH_CLIENT_NAME_BV;
    } else if (sdnApplicationName === 'OLR_AUTH_TOKEN') {
        clientName = getSdnAuthToken.SDN_AUTH_CLIENT_NAME_OLR;
    } else if (sdnApplicationName === 'UFE_AUTH_TOKEN') {
        clientName = getSdnAuthToken.SDN_AUTH_CLIENT_NAME_UFE;
    }

    return getSdnAuthToken.getSdnAuthToken({ clientName }).then(authData => {
        if (authData.responseStatus !== 200 || !authData.sdnAccessToken || !authData.expiresIn) {
            throw new Error(`Invalid ${clientName} authentication response.`);
        }

        const expiresIn = parseInt(authData.expiresIn);

        if (expiresIn > 30) {
            // 30s - network latency compensation
            Storage.local.setItem(
                LOCAL_STORAGE[sdnApplicationName],
                authData.sdnAccessToken,
                expiresIn * 1000 // ms
            );
        }

        return authData.sdnAccessToken;
    });
};

sdnToken.withSdnToken = function (callFunc, sdnApplicationName) {
    return (...args) => {
        return sdnToken.callWithSdnToken(callFunc, args, true, sdnApplicationName);
    };
};

export default sdnToken;
