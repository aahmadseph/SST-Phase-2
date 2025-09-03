import AuthenticationUtils from 'utils/Authentication';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import userUtils from 'utils/User';
import refreshToken from 'services/api/accessToken/refreshToken';
import cookieUtils from 'utils/Cookies';
import api from 'services/api/authentication/getAnonymousToken';
import { AuthTokenReceived, AuthTokenFailed } from 'constants/events';

const DEFAULT_RETRY_IN_MS = 2 * 60 * 1000;
const REFRESH_DATA_STORAGE_KEY = 'REFRESH_DATA_STORAGE_KEY';
const TOKEN_EXPIRE_THRESHOLD_MS = 60 * 1000;
const getCurrentTimeMs = () => new Date().getTime();

let refreshData = {
    currentTimerId: null,
    inProgress: false,
    refreshTokenRetries: 0,
    tokenExpirationTime: null,
    is400Error: false
};

/**
 * Class to encapsulate any work with token refresh logic within the application.
 * @class RefreshToken
 */
class RefreshToken {
    /**
     * Triggers the proactive refresh token process.
     * Local Storage is used to keep in sync multiple tabs in order to
     * avoid multiple times being triggered at the same time.
     *
     * @memberof RefreshToken
     */
    static initialize = async () => {
        // Only client-side functionality
        if (!window) {
            return null;
        }

        try {
            // Required on the method level bc/ of a circular dependency otherwise.
            const storeLocal = (await import('store/Store')).default;
            const userActions = (await import('actions/UserActions')).default;
            const cachedAccessToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
            const cachedRefreshToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);
            const cachedProfileSecurityStatus = Storage.local.getItem(LOCAL_STORAGE.PROFILE_SECURITY_STATUS);

            RefreshToken.updateLocalData({}, true);
            RefreshToken.initUserComeBackLogic();
            RefreshToken.clearInProgressBeforeUnload();

            //  Get new anonymous tokes If tokens are not exist or refresh token is expired
            if (!RefreshToken.isRefreshTokenValid() || (!cachedAccessToken && !cachedRefreshToken)) {
                if (cachedProfileSecurityStatus > 0) {
                    storeLocal.dispatch(userActions.signOut());
                }

                return RefreshToken.getNewTokens();
            }

            // Retry every 2 minutes if there is a timer in progress,
            // case when 2 or more tabs initialise refreshToken call at the same time
            if (refreshData.inProgress) {
                return RefreshToken.setTokenTimer(DEFAULT_RETRY_IN_MS);
            }

            // if current access token valid then set timeout
            if (RefreshToken.isAccessTokenValid()) {
                return RefreshToken.setTokenTimer();
            }

            // Current session is expired, get fresh tokens
            return await RefreshToken.getRefreshedTokens(true);
        } catch (error) {
            return null;
        }
    };

    /**
     * Get is user interact with site within token expiration time
     * @return {boolean}
     *
     * @memberof RefreshToken
     */
    static hasUserInteractedWithinTokenTime = () => {
        const cachedAccessToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
        const cachedLastInteraction = Storage.local.getItem(LOCAL_STORAGE.LAST_USER_INTERACTION);

        if (!cachedAccessToken || !cachedLastInteraction) {
            return false;
        }

        const tokenIssuedAt = JSON.parse(atob(cachedAccessToken.split('.')[1])).iat * 1000;
        const lastInteraction = new Date(cachedLastInteraction).getTime();

        //user interact with site within token expiration time
        return lastInteraction > tokenIssuedAt;
    };

    /**
     * Refresh tokens and update localStorage accordingly
     *
     * @memberof RefreshToken
     */
    static getRefreshedTokens = async (isExpiredSession = false) => {
        // Required on the method level bc/ of a circular dependency otherwise.
        const storeLocal = (await import('store/Store')).default;
        const userActions = (await import('actions/UserActions')).default;
        const cachedAccessToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
        const cachedRefreshToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);
        const cachedRefreshData = Storage.local.getItem(REFRESH_DATA_STORAGE_KEY) || refreshData;
        const isLoggedInBeforeRefresh = RefreshToken.isUserLoggedIn();

        //do nothing is user didn't interact with site within token expiration time
        if (!RefreshToken.hasUserInteractedWithinTokenTime() && !isExpiredSession) {
            Storage.local.setItem(LOCAL_STORAGE.USER_DIDNT_INTERACT, true);

            return null;
        }

        // mark that call logic in progress, to prevent same execution on another tab
        RefreshToken.updateLocalData({ inProgress: true });

        // call refresh token api to get new tokens
        const newAuthTokens = await refreshToken.refreshToken(
            { accessToken: cachedAccessToken, refreshToken: cachedRefreshToken },
            { headers: { 'X-CAUSED-BY-URL': 'proactive_refresh' } }
        );

        const errorsToHandleProfileStatus = [400, 500];

        // Since this is a background process, we should not trigger any Sign In popup.
        // In case a 500 or 400 error is received while getting new tokens, retry two more times
        if (errorsToHandleProfileStatus.includes(newAuthTokens.responseStatus) || errorsToHandleProfileStatus.includes(newAuthTokens.errorCode)) {
            if (cachedRefreshData.refreshTokenRetries < 2) {
                RefreshToken.updateLocalData({ refreshTokenRetries: cachedRefreshData.refreshTokenRetries + 1 });

                await RefreshToken.getRefreshedTokens();
            } else {
                RefreshToken.updateLocalData({
                    inProgress: false,
                    refreshTokenRetries: 0,
                    is400Error: true
                });

                // Make the user recognized manually since refreshToken API call failed 3 times
                if (RefreshToken.isUserLoggedIn()) {
                    RefreshToken.updateProfileStatusSSI();
                }

                //trigger event that token api failed
                window.dispatchEvent(new CustomEvent(AuthTokenFailed, { detail: {} }));
            }

            return false;
        }

        //if we have 403 error, logout user and clear localStorage
        if ((newAuthTokens.responseStatus === 403 || newAuthTokens.errorCode === 403) && RefreshToken.isUserLoggedIn()) {
            storeLocal.dispatch(userActions.signOut());

            return false;
        }

        // Do nothing if an additional error is received
        if (newAuthTokens.errors) {
            RefreshToken.updateLocalData({
                inProgress: false,
                is400Error: false
            });

            //trigger event that token api failed
            window.dispatchEvent(new CustomEvent(AuthTokenFailed, { detail: {} }));

            return null;
        }

        //if user access token was expired and user was logged in before -> use profileStatus based on SSI
        // if not -> than use from response
        const newProfileStatus =
            isExpiredSession && isLoggedInBeforeRefresh ? RefreshToken.getSSIProfileStatus() : newAuthTokens.profileSecurityStatus;

        AuthenticationUtils.updateProfileStatus({
            profileSecurityStatus: [newProfileStatus],
            accessToken: [newAuthTokens.accessToken, newAuthTokens?.atExp],
            refreshToken: [newAuthTokens.refreshToken, newAuthTokens?.rtExp]
        });

        RefreshToken.updateLocalData({
            inProgress: false,
            refreshTokenRetries: 0
        });

        window.dispatchEvent(new CustomEvent(AuthTokenReceived, { detail: {} }));

        // Keep the timer running
        RefreshToken.setTokenTimer();

        return true;
    };

    /**
     * Get the time to execute the timer
     * @param {number} retryInMs Time in milliseconds when the timer should be executed
     * @return {number} time to execute the timer in milliseconds
     *
     * @memberof RefreshToken
     */
    static getTimeToExecute = retryInMs => {
        if (!refreshData.tokenExpirationTime) {
            return DEFAULT_RETRY_IN_MS;
        }

        if (retryInMs) {
            return retryInMs;
        }

        return RefreshToken.getTimeToExpire() - new Date().getTime();
    };

    /**
     * Calculates the expiration time based on the current access token
     * @param {string} token optional token
     * @returns Time to refresh the token in milliseconds
     *
     * @memberof RefreshToken
     */
    static getTimeToExpire(token) {
        const currentTokenExp = RefreshToken.getTokenExpirationTime(token);

        if (!currentTokenExp) {
            return getCurrentTimeMs() + DEFAULT_RETRY_IN_MS;
        }

        return currentTokenExp - TOKEN_EXPIRE_THRESHOLD_MS;
    }

    /**
     * Get the current expiration time from the access token and parsed to milliseconds
     * @param {string} token optional token
     * @returns Access token expiration time in milliseconds
     *
     * @memberof RefreshToken
     */
    static getTokenExpirationTime = token => {
        const currentAccessToken = token || Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

        if (!currentAccessToken) {
            return null;
        }

        const parsedCurrentToken = JSON.parse(atob(currentAccessToken.split('.')[1]));

        // Expiration time is in secs
        return parsedCurrentToken.exp * 1000;
    };

    /**
     * Set a new set of access tokens. We need to evaluate
     * if we can set the timer as this could be executed within the timer.
     *
     * @memberof RefreshToken
     */
    static setRefreshAccessToken = async (/*timeToRetry = DEFAULT_RETRY_IN_MS*/) => {
        const storedRefreshData = Storage.local.getItem(REFRESH_DATA_STORAGE_KEY) || refreshData;

        // if previous refreshToken API calls failed due to 400/500 error, do nothing
        if (storedRefreshData.is400Error) {
            return null;
        }

        // if previous request in progress, set timeout to rerun in 2 mins
        if (storedRefreshData.inProgress) {
            return RefreshToken.setTokenTimer(DEFAULT_RETRY_IN_MS);
        }

        RefreshToken.updateLocalData();

        // if tokens valid then run timer
        if (RefreshToken.isAccessTokenValid()) {
            return RefreshToken.setTokenTimer();
        }

        return await RefreshToken.getRefreshedTokens();
    };

    /**
     * Set the timer to proactively refresh the current token
     * @param {number} retryInMs Time in milliseconds when the timer should be executed
     * @return {number} Current timer ID
     *
     * @memberof RefreshToken
     */
    static setTokenTimer = retryInMs => {
        const timeToExecute = RefreshToken.getTimeToExecute(retryInMs);
        const newCurrentTimerId = setTimeout(() => RefreshToken.setRefreshAccessToken(timeToExecute), timeToExecute);
        RefreshToken.updateLocalData({ currentTimerId: newCurrentTimerId });

        return newCurrentTimerId;
    };

    /**
     * Evaluates if there is an available current access token and calculates if the timer should be set.
     * @return {boolean} Return `true` if there is an access token, the current time is lower to the time to refresh, and the functionality hasn’t been called
     *
     * @memberof RefreshToken
     */
    static isAccessTokenValid = () => {
        const storedAccessToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

        if (!storedAccessToken || !refreshData.tokenExpirationTime) {
            return false;
        }

        const currentTime = getCurrentTimeMs();
        const timeToRefresh = RefreshToken.getTimeToExpire();

        return currentTime < timeToRefresh && !refreshData.inProgress;
    };

    /**
     * Stop the current timer
     *
     * @memberof RefreshToken
     */
    static stopCurrentTimer = () => {
        clearTimeout(refreshData.currentTimerId);
    };

    /**
     * Updates the local refreshData to keep in sync with multiple tabs
     * @param {object} newRefreshData New refresh data object
     * @param {boolean} isInit optional, is initialization fn call
     *
     * @memberof RefreshToken
     */
    static updateLocalData = (newRefreshData = {}, isInit = false) => {
        const storedRefreshData = Storage.local.getItem(REFRESH_DATA_STORAGE_KEY) || refreshData;

        if (isInit) {
            storedRefreshData.is400Error = false;
        }

        refreshData = {
            ...storedRefreshData,
            ...newRefreshData,
            tokenExpirationTime: newRefreshData.tokenExpirationTime || RefreshToken.getTokenExpirationTime()
        };

        Storage.local.setItem(REFRESH_DATA_STORAGE_KEY, refreshData);
    };

    /**
     * Get is User legged in or not based on current profileStatus
     *
     * @memberof RefreshToken
     */
    static isUserLoggedIn = () => {
        const cachedProfileStatus = Storage.local.getItem(LOCAL_STORAGE.PROFILE_SECURITY_STATUS);

        return cachedProfileStatus ? cachedProfileStatus === userUtils.PROFILE_STATUS.LOGGED_IN : false;
    };

    /**
     * Get profile status depends on was user SSI or no
     *
     * @memberof RefreshToken
     */
    static getSSIProfileStatus = () => {
        const isSSI = cookieUtils.read('SSIT');

        return isSSI ? userUtils.PROFILE_STATUS.RECOGNIZED_SSI : userUtils.PROFILE_STATUS.RECOGNIZED;
    };

    /**
     * Update profile status depends on was user SSI or no
     *
     * @memberof RefreshToken
     */
    static updateProfileStatusSSI = () => {
        AuthenticationUtils.updateProfileStatus({
            profileSecurityStatus: [RefreshToken.getSSIProfileStatus()]
        });
    };

    /**
     * Check is refresh token is valid (exist and not expired)
     *
     * @memberof RefreshToken
     */
    static isRefreshTokenValid = () => {
        const storedRefreshToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);

        if (!storedRefreshToken) {
            return false;
        }

        const currentTime = getCurrentTimeMs();
        const timeToRefresh = RefreshToken.getTimeToExpire(storedRefreshToken);

        return currentTime < timeToRefresh;
    };

    /**
     * Get new tokens by calling /v2/session api
     *
     * @memberof RefreshToken
     */
    static getNewTokens = async () => {
        window.localStorage.removeItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
        window.localStorage.removeItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);

        await RefreshToken.getAnonymousToken();

        RefreshToken.setTokenTimer();
    };

    /**
     * Get refreshed or new tokens when user come back
     * (started to interact with the page after 15 minutes)
     *
     * @memberof RefreshToken
     */
    static initUserComeBackLogic = () => {
        window.addEventListener('UserComeBack', async function () {
            const storeLocal = (await import('store/Store')).default;
            const userActions = (await import('actions/UserActions')).default;
            const isLoggedInBeforeRefresh = RefreshToken.isUserLoggedIn();

            //if refresh token valid -> calling refreshToken api
            if (RefreshToken.isRefreshTokenValid()) {
                await RefreshToken.getRefreshedTokens();

                //need to update profileStatus if user was logged in before based on SSI
                if (isLoggedInBeforeRefresh) {
                    RefreshToken.updateProfileStatusSSI();
                }
            } else {
                //sign out user if it was logged in and refresh token expired
                if (isLoggedInBeforeRefresh) {
                    storeLocal.dispatch(userActions.signOut());
                } else {
                    //get new anonymous tokens if refresh token expired and user was anonymous
                    await RefreshToken.getNewTokens();
                }
            }
        });

        //remove userDidntInteract flag on every hard reload
        Storage.local.removeItem(LOCAL_STORAGE.USER_DIDNT_INTERACT);
    };

    /**
     * Get anonymous tokens with 3 retries
     *
     * @memberof RefreshToken
     */
    static getAnonymousToken = () => {
        const numRetries = 1;

        async function callGetAnonymousToken(retries) {
            try {
                await api.getAnonymousToken();

                RefreshToken.updateLocalData();

                window.dispatchEvent(new CustomEvent(AuthTokenReceived, { detail: {} }));

                return RefreshToken.setTokenTimer();
            } catch (error) {
                if (retries < 3) {
                    return callGetAnonymousToken(retries + 1);
                }

                return Sephora.logger.error(e);
            }
        }

        callGetAnonymousToken(numRetries);
    };

    /**
     * Clear inProgress flag during beforeunload event
     *
     * @memberof RefreshToken
     */
    static clearInProgressBeforeUnload = () => {
        window.addEventListener('beforeunload', () => {
            const cachedRefreshData = Storage.local.getItem(REFRESH_DATA_STORAGE_KEY);

            if (cachedRefreshData?.inProgress) {
                refreshData.inProgress = false;
                Storage.local.setItem(REFRESH_DATA_STORAGE_KEY, refreshData);
            }
        });
    };
}

export default RefreshToken;
