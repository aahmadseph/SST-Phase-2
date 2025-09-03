import Location from 'utils/Location';
import Storage from 'utils/localStorage/Storage';
import Flush from 'utils/localStorage/Flush';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import basketUtils from 'utils/Basket';
import UserUtils from 'utils/User';
import OrderUtils from 'utils/Order';
import urlUtils from 'utils/Url';
import authenticationUtils from 'utils/Authentication';
import { ArgumentOutOfRangeException } from 'exceptions';
import store from 'store/Store';
import Actions from 'actions/Actions';
import RCPSCookies from 'utils/RCPSCookies';
import { AuthTokenReceived, AuthTokenFailed } from 'constants/events';

import { BASKET_TYPES } from 'actions/ActionsConstants';
import IntersticeRequestActions from 'actions/IntersticeRequestActions';
import refreshToken from 'services/api/accessToken/refreshToken';

const { isAuthServiceEnabled, isAuthServiceUrl, storeAuthTokens } = authenticationUtils;
const { StorageTypes } = Storage;
let requestCounter = 0;
let autoLoginHasBeenCalled = false;

const ResponseErrorCode = {
    NETWORK_REQUEST_FAILED: -666666,
    REQUEST_ABORTED: -777777,

    // The token's lifetime is over and the user needs to do the manual
    // re-login with SSI.
    SSI_TOKEN_EXPIRED: 407,

    // The SSI user needs to perform the auto-login.
    SSI_SIGN_IN_REQUIRED: 409,

    // (ILLUPH-53935), (INFL-949)
    REQ_NOT_ALLOWED_AUTO_LOGGED: 411,

    //ATG 11 Migration error code, BE moves user info from atg9 to atg11, redo api call.
    ATG_11_MIGRATION: 347,

    ORDER_IS_NOT_INITIALIZED: 422
};

const SUBMIT_ORDER_URL = '/api/checkout/submitOrder';
const AUTO_LOGIN_URL = 'api/ssi/autoLogin';
const AUTO_REPLENISHMENT_URL = 'v1/replenishment';
const GWAY_SWITCH_COUNTRY_URL = 'gway/v2/users/profile/switchCountry';
const INIT_CHECKOUT_URL = 'api/checkout/order/init';
const V2_GENERATE_TOKEN = '/gway/v1/dotcom/auth/v2/generateToken';
const V2_RESET_PASSWORD = '/gway/v1/dotcom/auth/v2/resetPassword';

const ResponseStatusCode = {
    // Per conversation with Lijo Jacob, any 403 Forbidden HTTP response
    // means nothing but that a request is forbidden for auto-login users,
    // and so user needs to perform a manual sign-in.
    FORBIDDEN: 403
};

const NUM_RETRIES = 3;
const RETRY_TIMEOUT_MS = 10000;

function getCallsCounter() {
    return requestCounter;
}

function flushCache() {
    Flush.flushUser();
    Flush.flushBasket();
    Flush.flushPersonalizedPromotions();
}

const apisRequireAccessTokenQueue = [];

function enqueueRequest(url, options, config) {
    return new Promise((resolve, reject) => {
        apisRequireAccessTokenQueue.push({
            url,
            options,
            config,
            resolve,
            reject
        });
    });
}

function processRequestQueue() {
    while (apisRequireAccessTokenQueue.length > 0) {
        const {
            url, options, config, resolve, reject
        } = apisRequireAccessTokenQueue.shift();

        makeRetryingRequest(url, options, config).then(resolve).catch(reject);
    }
}

function processAccessTokenFailed() {
    const failedUrls = [];

    while (apisRequireAccessTokenQueue.length > 0) {
        const { url, reject } = apisRequireAccessTokenQueue.shift();
        failedUrls.push(url);
        reject();
    }

    Sephora.logger.error('Token API failed for next urls:', failedUrls);
}

function isApiRequireAccessToken(url, patterns) {
    return patterns.some(pattern => {
        const regexPattern = pattern
            .replace(/\$\{[^}]+\}/g, '[^/]+') // escape ${variable} to [^/]+
            .replace(/[\/.?+]/g, '\$&'); // escape / . ? +

        const regex = new RegExp(regexPattern, 'i');

        return regex.test(url);
    });
}

if (typeof window !== 'undefined') {
    window.addEventListener(AuthTokenReceived, function () {
        processRequestQueue();
    });

    window.addEventListener(AuthTokenFailed, function () {
        processAccessTokenFailed();
    });
}

function performManualSignInAndMakeRequest(originalUrl, originalOptions, originalConfig, reason, withHeaderValue = false) {
    if (originalConfig?.skipLoginPrompt) {
        return Promise.reject(reason);
    }

    const AuthActions = require('actions/AuthActions').default;

    const ORDER_INIT_API = '/api/checkout/order/init';

    const isRopisBasket = () => Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === BASKET_TYPES.ROPIS_BASKET;
    const isBasketInitCheckout = originalUrl.indexOf(ORDER_INIT_API) >= 0 && Location.isBasketPage() && !isRopisBasket();
    const isCheckoutInitAttempt = originalUrl.includes(ORDER_INIT_API);

    const showGuestCheckoutModal = store.getState().basket.isGuestCheckoutEnabled && UserUtils.isAnonymous();

    if (urlUtils.getIsGuestParamValue()) {
        return Promise.reject(reason);
    }

    // Make user recognized, if the store thinks that she's still signed in.
    if (UserUtils.isSignedIn()) {
        store.dispatch(AuthActions.updateProfileStatus(2));
    }

    const attemptToSignIn = new Promise((resolve, reject) => {
        store.dispatch(IntersticeRequestActions.clear());
        store.dispatch(Actions.showInterstice(false));

        const preventRegistrationModal = isBasketInitCheckout;

        const options = originalOptions.body ? JSON.parse(originalOptions.body) : {};

        const cachedTargetReferrer = Storage.local.getItem(LOCAL_STORAGE.TARGET_REFERRER);
        const isEmailTraffic =
            cachedTargetReferrer !== null ? cachedTargetReferrer.indexOf('ret') === 0 || cachedTargetReferrer.indexOf('tr') === 0 : false;

        if (showGuestCheckoutModal && !options.RopisCheckout && !isEmailTraffic) {
            const extraParams = { isCheckoutInitAttempt };

            if (withHeaderValue) {
                extraParams.headerValue = '/api/ssi/autoLogin';
            }

            store.dispatch(
                Actions.showSignInWithMessagingModal({
                    isOpen: true,
                    messages: reason?.errorMessages,
                    callback: resolve,
                    isApplePayFlow: options.isApplePayFlow,
                    isPaypalFlow: options.isPaypalFlow,
                    analyticsData: {},
                    errback: reject,
                    extraParams
                })
            );
        } else {
            store.dispatch(
                Actions.showSignInModal({
                    isOpen: true,
                    messages: reason?.errorMessages,
                    callback: resolve,
                    isNewUserFlow: preventRegistrationModal,
                    isApplePayFlow: options.isApplePayFlow,
                    RopisCheckout: options.RopisCheckout,
                    analyticsData: {},
                    errback: reject,
                    extraParams: withHeaderValue ? { headerValue: '/api/ssi/autoLogin', isCheckoutInitAttempt } : { isCheckoutInitAttempt }
                })
            );
        }
    });

    return attemptToSignIn
        .then(userData => {
            return new Promise(resolve => {
                // require.ensure is used to package nested requires in components.chunk.js
                // rather than priority.bundle.js in order to keep priority.bundle.js lean
                require.ensure(
                    [],
                    function (require) {
                        const checkoutUtils = require('utils/Checkout').default;
                        const options = originalOptions && originalOptions.body ? JSON.parse(originalOptions.body) : {};
                        let promise;

                        if (isBasketInitCheckout) {
                            // Try to init order after interrrupt by sign in
                            promise = checkoutUtils.initializeCheckout({
                                isPaypalFlow: options.isPaypalFlow,
                                isApplePayFlow: options.isApplePayFlow,
                                // We need to know if we're initializing checkout after login, so
                                // we can update preferredZipcode BEFORE checkout call to the API
                                isInitAfterSignIn: true,
                                user: userData,
                                signInResponse: userData,
                                ropisCheckout: basketUtils.isPickup()
                            });
                        } else {
                            // eslint-disable-next-line no-use-before-define
                            promise = makeRequest(originalUrl, originalOptions);
                        }

                        resolve(promise);
                    },
                    'components'
                );
            });
        })
        .catch(response => {
            return response;
        });
}

function performAutoLoginAndMakeRequest(originalUrl, originalOptions, originalConfig) {
    const ssiApi = require('services/api/ssi').default;
    store.dispatch(Actions.showInterstice(false));

    return new Promise(resolve => {
        require.ensure([], function (require) {
            const { setupFingerprint } = require('services/Fingerprint').default;
            setupFingerprint(deviceFingerprint => {
                const newOptions = {
                    ...originalOptions,
                    deviceFingerprint
                };
                resolve(
                    ssiApi
                        .autoLogin({ deviceFingerprint })
                        .then(userData => {
                            if (isAuthServiceEnabled()) {
                                storeAuthTokens({ accessToken: userData.accessToken, refreshToken: userData.refreshToken });
                            }

                            autoLoginHasBeenCalled = false;

                            // eslint-disable-next-line no-use-before-define
                            return makeRequest(originalUrl, newOptions);
                        })
                        .catch(reason => performManualSignInAndMakeRequest(originalUrl, originalOptions, originalConfig, reason, true))
                );
            });
        });
    });
}

async function performRefreshTokenAndRetryCheckoutInit(originalUrl, originalOptions, originalConfig) {
    const cachedUserEmail = Storage.local.getItem(LOCAL_STORAGE.USER_EMAIL);
    const cachedRefToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);

    const newAuthTokens = await refreshToken.refreshToken({ email: cachedUserEmail, refreshToken: cachedRefToken });

    if ('errors' in newAuthTokens || newAuthTokens?.profileSecurityStatus < 3) {
        return performManualSignInAndMakeRequest(originalUrl, originalOptions, originalConfig);
    }

    authenticationUtils.storeAuthTokens({ accessToken: newAuthTokens.accessToken, refreshToken: newAuthTokens.refreshToken });

    // eslint-disable-next-line no-use-before-define
    return makeRequest(originalUrl, originalOptions);
}

function handleResponse(responseStatus, responseData, originalUrl, originalOptions, originalConfig) {
    let promise;

    // Per conversation with Alexey Filonov, errorCode should always be
    // present, defaulting to -1.
    //
    // No specific HTTP response status is enforced to have errorCode, so it
    // can be present in response with any status.
    // That's likely because of various BE engineers in various BE teams
    // having interpreted some best practice in the past differenly.
    //
    // So, first of all, we handle general error codes for SSI expiration
    // and auto-login. Other error codes are considered endpoint specific,
    // so don't handle them here. Finally, 403 (like on login) is handled.

    if (responseData.errorCode === ResponseErrorCode.ATG_11_MIGRATION) {
        // eslint-disable-next-line no-use-before-define
        promise = makeRequest(originalUrl, originalOptions);
    } else if (
        responseData.errorCode === ResponseErrorCode.SSI_TOKEN_EXPIRED ||
        responseData.errorCode === ResponseErrorCode.REQ_NOT_ALLOWED_AUTO_LOGGED
    ) {
        promise = performManualSignInAndMakeRequest(originalUrl, originalOptions, originalConfig, responseData);
    } else if (
        responseData.errorCode === ResponseErrorCode.SSI_SIGN_IN_REQUIRED &&
        // Ignore 409 logic for curbside pickup notification call since it's an expected code
        originalUrl !== `${Sephora.configurationSettings.sdnDomainBaseUrl}/v1/notifications` &&
        !autoLoginHasBeenCalled
    ) {
        autoLoginHasBeenCalled = true;
        promise = performAutoLoginAndMakeRequest(originalUrl, originalOptions, originalConfig);
    } else if (responseData.errorCode === ResponseErrorCode.ORDER_IS_NOT_INITIALIZED) {
        Location.setLocation('/basket');
    } else if (responseData.errorCode) {
        promise = Promise.reject(Object.assign({}, responseData, { responseStatus }));
    } else if (responseStatus === ResponseStatusCode.FORBIDDEN && !isAuthServiceUrl(originalUrl)) {
        if (originalUrl.indexOf(AUTO_LOGIN_URL) !== -1) {
            promise = Promise.reject(responseData);
        } else if (originalUrl.indexOf(AUTO_REPLENISHMENT_URL) !== -1) {
            promise = Promise.reject(responseData);
        } else if (originalUrl.indexOf(GWAY_SWITCH_COUNTRY_URL) !== -1) {
            promise = Promise.resolve(Object.assign({}, responseData, { responseStatus }));
        } else if (originalUrl.indexOf(INIT_CHECKOUT_URL) !== -1 && UserUtils.isRecognizedSSI()) {
            promise = performRefreshTokenAndRetryCheckoutInit(originalUrl, originalOptions, originalConfig);
        } else if (originalUrl.indexOf(V2_GENERATE_TOKEN) !== -1) {
            promise = Promise.reject(responseData);
        } else if (originalUrl.indexOf(V2_RESET_PASSWORD) !== -1) {
            promise = Promise.reject(responseData);
        } else {
            promise = performManualSignInAndMakeRequest(originalUrl, originalOptions, originalConfig);
        }
    } else {
        promise = Promise.resolve(Object.assign({}, responseData, { responseStatus }));
    }

    return promise;
}

let buildRequestUrl = function buildRequestUrl(pathWithQueryString) {
    // Per conversation with Lijo Jacob, we're safe to always shoot HTTPS requests.
    if (pathWithQueryString.indexOf('https://') === 0) {
        return pathWithQueryString;
    }

    const host = Sephora.host || window.location.hostname;
    const portPart = Sephora.sslPort === undefined || Sephora.sslPort === 443 || Sephora.sslPort === '' ? '' : ':' + Sephora.sslPort;

    return `https://${host}${portPart}${pathWithQueryString}`;
};

if (Sephora.isJestEnv) {
    buildRequestUrl = pathWithQueryString => {
        if (pathWithQueryString.indexOf('https://') === 0) {
            return pathWithQueryString.replace(/^https:\/\//, 'http://');
        } else {
            const host = Sephora.host || window.location.hostname;

            return `http://${host}${pathWithQueryString}`;
        }
    };
}

async function makeSingleRequest(url, options = {}, config = {}) {
    const regExp = /(api|gway|gapi)/;
    const isSephoraHost = regExp.test(url);
    const isPixleeRequest = /pixlee/.test(url);
    const { isSendAccessToken = false, sdnUfeAPIUserKey = '' } = Sephora.configurationSettings;
    const accessToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN) || '';

    requestCounter++;

    // Create an instance of AbortController and include its 'signal' property to the request options
    // AbortController instance will be passed back as config.abortController
    // Later on the request can be cncelled by calling config.abortController.abort()
    if (config.abortable && window.AbortController) {
        const controller = new window.AbortController();
        options.signal = controller.signal;
        config.abortController = controller;
    }

    if (isSephoraHost && accessToken && isSendAccessToken && !isPixleeRequest && !options.excludeSephTokens) {
        options.headers = {
            ...options.headers,
            'x-api-key': sdnUfeAPIUserKey,
            'Seph-Access-Token': accessToken
        };
    }

    const fetchOptions = {
        credentials: 'include',
        importance: 'high',
        ...options
    };
    const cachedData = await tryGetCachedData(config);

    if (cachedData) {
        return cachedData;
    } else {
        const response = await window.fetch(url, fetchOptions);
        const isReponseAsJson = response?.headers?.get('Content-Type')?.indexOf('application/json') >= 0;
        const responseData = isReponseAsJson ? await response.json() : await response.text();

        const correlationId = response?.headers?.get('correlationId');

        if (config.returnCorrelationId) {
            responseData['correlationId'] = correlationId;
        }

        if (config.returnHeaders) {
            responseData['headers'] = response.headers;
        }

        if (responseData.errorCode) {
            window.dispatchEvent(new CustomEvent('AgentAwareErrors', { detail: { ...responseData } }));
        }

        // eslint-disable-next-line no-use-before-define
        const processResponse = decorateResponseWithCheckoutLogic(handleResponse);
        const processedResponseData = await processResponse(response.status, responseData, url, options, config);
        try {
            await trySetCachedData(processedResponseData, config);
        } catch (e) {
            // Just ignore failed cache
        }

        return processedResponseData;
    }
}

const tryGetCachedData = async config => {
    let value = null;

    if (config.cache) {
        const { key, storageType = StorageTypes.Local, invalidate } = config.cache;

        if (invalidate) {
            return value;
        }

        switch (storageType) {
            case StorageTypes.Session: {
                value = Storage.session.getItem(key);

                break;
            }
            case StorageTypes.Local: {
                value = Storage.local.getItem(key);

                break;
            }
            case StorageTypes.IndexedDB: {
                value = await Storage.db.getItem(key);

                break;
            }
            default: {
                throw new ArgumentOutOfRangeException('storageType should be Local, Session or IndexedDB. Default is set to StorageTypes.Local');
            }
        }
    }

    return value;
};

const trySetCachedData = async (response, config) => {
    const { key, expiry, storageType = StorageTypes.Local } = config.cache || {};

    if (key && expiry) {
        switch (storageType) {
            case StorageTypes.Session: {
                Storage.session.setItem(key, response, expiry);

                break;
            }
            case StorageTypes.Local: {
                Storage.local.setItem(key, response, expiry);

                break;
            }
            case StorageTypes.IndexedDB: {
                await Storage.db.setItem(key, response, expiry);

                break;
            }
            default: {
                throw new ArgumentOutOfRangeException('storageType should be Local, Session or IndexedDB. Default is set to StorageTypes.Local');
            }
        }
    }
};

function checkoutSignInAndMakeRequest(originalUrl, originalOptions, errorMessages) {
    const user = store.getState().user;

    const AuthActions = require('actions/AuthActions').default;

    let checkoutRedirectUrl;

    if (OrderUtils.isPlayEditOrder()) {
        checkoutRedirectUrl = '/profile/MyAccount/Subscriptions';
    } else if (OrderUtils.isPlayOrder()) {
        checkoutRedirectUrl = '/product/play-subscription-P396286';
    } else {
        checkoutRedirectUrl = '/basket';
    }

    if (UserUtils.isAnonymous()) {
        Location.setLocation(checkoutRedirectUrl);

        return Promise.resolve();
    }

    // Make user recognized, if the store thinks that she's still signed in.
    if (UserUtils.isSignedIn()) {
        store.dispatch(AuthActions.updateProfileStatus(2));
    }

    const attemptToSignIn = new Promise((resolve, reject) => {
        store.dispatch(IntersticeRequestActions.clear());
        store.dispatch(Actions.showInterstice(false));

        store.dispatch(
            Actions.showSignInModal({
                isOpen: true,
                messages: errorMessages,
                callback: resolve,
                isNewUserFlow: true,
                analyticsData: {},
                errback: reject,
                extraParams: { isCheckoutInitAttempt: true }
            })
        );
    });

    return attemptToSignIn
        .then(userData => {
            return new Promise(resolve => {
                // require.ensure is used to package nested requires in components.chunk.js
                // rather than priority.bundle.js in order to keep priority.bundle.js lean
                require.ensure(
                    [],
                    function (require) {
                        const checkoutUtils = require('utils/Checkout').default;
                        let promise;

                        //if, for whatever reason, another user is signing in, then redirect to correct url
                        let redirectFromCheckout = user.profileId !== UserUtils.getProfileId();
                        // or in Play became recognized
                        redirectFromCheckout = redirectFromCheckout || OrderUtils.isPlayEditOrder() || OrderUtils.isPlayOrder();

                        if (redirectFromCheckout) {
                            flushCache();
                            Location.setLocation(checkoutRedirectUrl);
                            promise = Promise.resolve();
                        } else {
                            // if the user becomes recognized on the checkout page
                            // checkout needs to be reinitialized with the user's profile id
                            promise = checkoutUtils.reinitializeOrder(userData.profileId).then(() => {
                                if (originalUrl.indexOf(SUBMIT_ORDER_URL) !== -1) {
                                    // Do not Submit Order silently, after relogin.
                                    // Let user review the Order before submitting
                                    Location.reload();

                                    return Promise.resolve();
                                } else {
                                    // eslint-disable-next-line no-use-before-define
                                    return makeRequest(originalUrl, originalOptions);
                                }
                            });
                        }

                        resolve(promise);
                    },
                    'components'
                );
            });
        })
        .catch(response => {
            flushCache();
            Location.setLocation(checkoutRedirectUrl);

            return response;
        });
}

function checkoutAutoLoginAndMakeRequest(originalUrl, originalOptions) {
    const ssiApi = require('services/api/ssi').default;
    store.dispatch(Actions.showInterstice(false));

    return new Promise(resolve => {
        require.ensure(
            [],
            function (require) {
                const { setupFingerprint } = require('services/Fingerprint').default;

                setupFingerprint(deviceFingerprint => {
                    resolve(
                        ssiApi
                            .autoLogin({ deviceFingerprint })
                            .then(userData => {
                                if (isAuthServiceEnabled()) {
                                    storeAuthTokens({ accessToken: userData.accessToken, refreshToken: userData.refreshToken });
                                }

                                return new Promise(_resolve => {
                                    const checkoutUtils = require('utils/Checkout').default;
                                    const promise = checkoutUtils.reinitializeOrder(userData.profileId);
                                    _resolve(
                                        promise.then(() => {
                                            // eslint-disable-next-line no-use-before-define
                                            return makeRequest(originalUrl, originalOptions);
                                        })
                                    );
                                });
                            })
                            .catch(reason => checkoutSignInAndMakeRequest(originalUrl, originalOptions, reason?.errorMessages))
                    );
                });
            },
            'components'
        );
    });
}

function decorateResponseWithCheckoutLogic(decorated) {
    return function (...args) {
        if (Location.isCheckout()) {
            const [responseStatus, responseData, originalUrl, originalOptions] = args;

            if (responseData.errorCode === ResponseErrorCode.SSI_TOKEN_EXPIRED) {
                return checkoutSignInAndMakeRequest(originalUrl, originalOptions, responseData.errorMessages);
            } else if (responseData.errorCode === ResponseErrorCode.SSI_SIGN_IN_REQUIRED) {
                return checkoutAutoLoginAndMakeRequest(originalUrl, originalOptions);
            } else if (responseData.errorCode === ResponseErrorCode.ORDER_IS_NOT_INITIALIZED) {
                Location.setLocation('/basket');

                return decorated(...args);
            } else if (!responseData.errorCode && responseStatus === ResponseStatusCode.FORBIDDEN) {
                return checkoutSignInAndMakeRequest(originalUrl, originalOptions);
            } else {
                return decorated(...args);
            }
        } else {
            return decorated(...args);
        }
    };
}

function decorateRequestMakerWithRetryLogic(decorated) {
    return function (...args) {
        const lastArg = args[args.length - 1];
        const config = typeof lastArg === 'object' ? lastArg : {};
        let numRetries = config.numRetries || NUM_RETRIES;
        const retryTimeout = config.retryTimeout || RETRY_TIMEOUT_MS;

        function _makeRequest(...args2) {
            return decorated(...args2).catch(reason => {
                let promise;

                if (reason instanceof TypeError && reason.message === 'Network request failed') {
                    if (numRetries > 0) {
                        numRetries = numRetries - 1;

                        promise = new Promise((resolve2, reject2) => {
                            setTimeout(function () {
                                _makeRequest(...args2)
                                    .then(resolve2)
                                    .catch(reject2);
                            }, retryTimeout);
                        });
                    } else {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        promise = Promise.reject({ errorCode: ResponseErrorCode.NETWORK_REQUEST_FAILED });
                    }
                } else {
                    promise = Promise.reject(reason);
                }

                return promise;
            });
        }

        return _makeRequest(...args);
    };
}

// This will be called as
// abortable(promise, control)(promiseArgument1, promiseArgument2...)
function decorateRequestMakerWithAbortableLogic(decorated, control) {
    return function (...args) {
        let abort;

        const promise = new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            abort = () => reject({ errorCode: ResponseErrorCode.REQUEST_ABORTED });

            decorated(...args)
                .then(resolve)
                .catch(reject);
        });

        control.abort = abort;

        return promise;
    };
}

const makeRetryingRequest = decorateRequestMakerWithRetryLogic(makeSingleRequest);

// The last parameter config is an optional object which can take the following arguments:
// numRetries - will override the constant NUM_RETRIES
// retryTimeout - will override the constant RETRY_TIMEOUT_MS
// abortable - allows to abort the fetch request
// returnHeaders - allows the service to return the headers as part of the response object
// skipLoginPrompt - allows to return the API error inmediately instead of ask for user login
export function makeRequest(pathWithQueryString, options, config = {}) {
    const url = buildRequestUrl(pathWithQueryString);
    const { apisRequireAccessToken = [] } = Sephora.configurationSettings;

    // if KS and cookie 5 enabled and url needs access token
    if (RCPSCookies.isRCPSAuthEnabled() && isApiRequireAccessToken(url, apisRequireAccessToken)) {
        const isAccessTokenValid = !!Sephora?.Util?.RefreshToken?.isAccessTokenValid();

        if (isAccessTokenValid) {
            //token is valid, process as usual
            return makeRetryingRequest(url, options, config);
        } else {
            // refresh tokens if token API already is not in progress
            if (!Sephora.Util.RefreshToken.refreshData.inProgress) {
                Sephora.Util.RefreshToken.updateTokens();
            }

            //add request to waiting queue for token
            return enqueueRequest(url, options, config);
        }
    }

    return makeRetryingRequest(url, options, config);
}

export default {
    ResponseErrorCode,
    ResponseStatusCode,
    makeRequest,
    abortable: decorateRequestMakerWithAbortableLogic,
    getCallsCounter,
    flushCache
};
