import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import getJwtAuthToken from 'services/api/authentication/getJwtAuthToken';
import store from 'store/Store';

const jwtToken = {};

jwtToken.callWithJwtToken = function (callFunc, args, retryOnFailure = false, jwtApplicationName) {
    return jwtToken.getJwtToken(jwtApplicationName).then(jwtAccessToken =>
        callFunc(jwtAccessToken, ...args).then(data => {
            // If getting 401 Unauthorized, purge token cache and try again
            if (data.responseStatus === 401 && retryOnFailure) {
                jwtToken.dropJwtToken(jwtApplicationName);

                return jwtToken.callWithJwtToken(callFunc, args, false, jwtApplicationName);
            }

            // If getting 403 Forbidden, throw error
            if (data.responseStatus === 403 && retryOnFailure) {
                throw new Error('User is not permitted to access the resource');
            }

            return data;
        })
    );
};

jwtToken.dropJwtToken = function (jwtApplicationName) {
    Storage.local.removeItem(LOCAL_STORAGE[jwtApplicationName]);
};

jwtToken.getJwtToken = function (jwtApplicationName) {
    const authToken = Storage.local.getItem(LOCAL_STORAGE[jwtApplicationName]);

    if (authToken) {
        return Promise.resolve(authToken);
    }

    return getJwtAuthToken.getJwtAuthToken(jwtToken.formPayload(store.getState())).then(authData => {
        if (authData.responseStatus !== 200 || !authData.token) {
            throw new Error(`Invalid ${getJwtAuthToken.JWT_AUTH_CLIENT_NAME_UFE} authentication response.`);
        }

        const defaultStorageLifespan = jwtToken.getDefaultStorageLifespan();
        let expirationFromResponse = null;
        try {
            expirationFromResponse = JSON.parse(atob(authData?.token.split('.')[1])).exp;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(`Invalid token: ${err}`);
        }
        const expiresIn = expirationFromResponse ? expirationFromResponse * 1000 : defaultStorageLifespan;
        Storage.local.setItem(LOCAL_STORAGE[jwtApplicationName], authData.token, expiresIn);

        return authData.token;
    });
};

jwtToken.formPayload = function ({ user, auth }) {
    const payload = {
        profileId: user.profileId,
        profileStatus: auth.profileStatus,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.login
    };

    return payload;
};

jwtToken.getDefaultStorageLifespan = function () {
    return Date.now() + 1 * (60 * 60 * 1000); //ms
};

jwtToken.withJwtToken = function (callFunc, jwtApplicationName) {
    return (...args) => {
        return jwtToken.callWithJwtToken(callFunc, args, true, jwtApplicationName);
    };
};

export default jwtToken;
