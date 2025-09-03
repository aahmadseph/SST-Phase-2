import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import refreshToken from 'services/api/accessToken/refreshToken';
import store from 'store/Store';
import authenticationUtils from 'utils/Authentication';
import RCPSCookies from 'utils/RCPSCookies';

const refreshTokenName = 'AUTH_REFRESH_TOKEN';
const { updateProfileStatus } = authenticationUtils;
const accessToken = {};

accessToken.callWithAccessToken = function (callFunc, args, accessTokenName) {
    return accessToken.getAccessToken(accessTokenName).then(jwtAccessToken => {
        return callFunc(jwtAccessToken, ...args)
            .then(data => {
                if (data.responseStatus === 403 || data.responseStatus === 401) {
                    return Promise.reject(data);
                }

                return data;
            })
            .catch(error => {
                const user = store.getState().user;
                const refrToken = Storage.local.getItem(LOCAL_STORAGE[refreshTokenName]);

                return refreshToken.refreshToken(accessToken.formPayload(user, refrToken)).then(newTokensResponse => {
                    if (
                        newTokensResponse.responseStatus === 403 ||
                        newTokensResponse.responseStatus === 401 ||
                        newTokensResponse.responseStatus === 400 ||
                        newTokensResponse.responseStatus === 500 ||
                        error?.errorCode === 404
                    ) {
                        window.dispatchEvent(new CustomEvent('promptUserToSignIn'));

                        return Promise.reject(newTokensResponse);
                    }

                    updateProfileStatus({
                        profileSecurityStatus: [newTokensResponse.profileSecurityStatus],
                        accessToken: [newTokensResponse.accessToken, newTokensResponse?.atExp],
                        refreshToken: [newTokensResponse.refreshToken, newTokensResponse?.rtExp]
                    });

                    return accessToken.callWithAccessToken(callFunc, args, accessTokenName);
                });
            });
    });
};

accessToken.getAccessToken = function (accessTokenName) {
    const accToken = Storage.local.getItem(LOCAL_STORAGE[accessTokenName]);

    return Promise.resolve(accToken);
};

accessToken.formPayload = function (user, token) {
    const payload = {
        email: user.login,
        refreshToken: token
    };

    return payload;
};

accessToken.withAccessToken = function (callFunc, accessTokenName) {
    return (...args) => {
        /*
            We are skipping the logic to call the refreshToken in case we receive
            403 as response, we have built a proactive refreshToken call which will prevent
            having an expired token.
            In addition, once the cookie is 100%, we are going to decomission all this file and
            fix all the APIs wrapped with this HoC
         */
        if (RCPSCookies.isRCPSAuthEnabled()) {
            return callFunc(null, ...args);
        }

        return accessToken.callWithAccessToken(callFunc, args, accessTokenName);
    };
};

export default accessToken;
