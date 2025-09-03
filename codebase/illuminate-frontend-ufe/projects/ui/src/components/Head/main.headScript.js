/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint no-use-before-define:0 */
/* eslint no-shadow:0 */
/* eslint camelcase:0 */
import { RefinementsBP } from 'constants/gql/queries/beautyPreferences/refinementsBP.gql';

/* eslint-disable-next-line complexity */
(function () {
    /* Initialize frontend globals */
    window.Sephora.isNodeRender = false;
    Sephora.debug = {
        dataAt: function (name) {
            return Sephora.debug.displayAutomationAttr ? name : null;
        }
    };
    Sephora.Util = {
        InflatorComps: Object.assign({}, (Sephora.Util && Sephora.Util.InflatorComps) || {}),
        Perf: { loadEvents: [] }
    };
    Sephora.analytics = {
        backendData: {},
        initialLoadDependencies: [],
        promises: {},
        resolvePromises: {}
    };

    /**
     * Set global hook for T&T test scripts to send results.
     * @param {Object} varianceObject - Object with test flags
     */
    Sephora.Util.TestTarget = {
        dispatchTest: function (varianceObject) {
            var InflatorComps = Sephora.Util.InflatorComps;

            if (
                InflatorComps &&
                InflatorComps.services &&
                InflatorComps.services.loadEvents &&
                InflatorComps.services.loadEvents.TestTargetServiceReady
            ) {
                window.dispatchEvent(
                    new CustomEvent('TestTargetResult', {
                        detail: { result: varianceObject }
                    })
                );
            } else {
                /* Dispatch test until TestTargetServiceReady fires in case the listener that
                 * handles TestTargetResult has not been declared yet.
                 */
                window.addEventListener('TestTargetServiceReady', function () {
                    Sephora.Util.TestTarget.dispatchTest(varianceObject);
                });
            }
        }
    };

    /**
     * Expose method to fire an event which could be used by thirdParty
     * Currently agreed thirdParty app is Olapic
     * latest update: Olapic has been removed. going to keep this here just in case if we use it with any other vendor
     * @param {Object} product {productId: '', skuId: ''} At least one is mandatory
     */
    Sephora.Util.ThirdParty = {
        showQuickLook: function (product) {
            window.dispatchEvent(
                new CustomEvent('ShowQuickLookModal', {
                    detail: {
                        product: product
                    }
                })
            );
        },
        openPrivacyModal: () => {
            window.dispatchEvent(new CustomEvent('OpenPrivacyModal'));
        }
    };

    var cookieStore = function () {
        var cookieMap = {};
        var cookies = ('' + document.cookie).split('; ');
        var currentCookie, cookieName, cookieValue;

        for (var x = 0, len = cookies.length; x < len; ++x) {
            try {
                currentCookie = cookies[x].split('=');
                cookieName = window.decodeURIComponent(currentCookie[0]);
                cookieValue = window.decodeURIComponent(currentCookie[1]);
                cookieMap[cookieName] = cookieValue;
            } catch (error) {
                console.error(error);
            }
        }

        Sephora.Util.InflatorComps.pageLoadCookies = cookieMap;

        return cookieMap;
    };
    Sephora.Util.cookieStore = cookieStore;

    if (Sephora.channel && Sephora.channel.toUpperCase() === 'RWD') {
        Sephora.isMobile = function () {
            // isMobile is a fallback option, therefore return true if cookie is not explicitly set to desktop
            return cookieStore()['device_type'] !== 'desktop';
        };

        Sephora.isDesktop = function () {
            return cookieStore()['device_type'] === 'desktop';
        };

        if (!cookieStore()['device_type']) {
            console.error('device_type cookie is missing for rwd');
        }
    } else {
        Sephora.isMobile = function () {
            return Sephora.channel === 'MW';
        };

        Sephora.isDesktop = function () {
            return Sephora.channel === 'FS';
        };
    }

    Sephora.isTouch = 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch);

    document.documentElement.classList.add(Sephora.isTouch ? 'touch' : 'no-touch');

    /* Initialize a few crucial things now and load the rest later in digitaData.js */
    global.digitalData = {
        page: {
            attributes: {
                featureVariantKeys: []
            },
            category: {},
            pageInfo: {}
        },
        performance: { ssrTime: Sephora.renderedData.pageRenderTime },
        product: []
    };

    var services = (Sephora.Util.InflatorComps.services = {});
    services.loadEvents = {};
    // this function makes sure that once a given list of dependencies had happened then
    // an the given callback is triggered.
    Sephora.Util.onLastLoadEvent = function (target, events, callback) {
        if (typeof callback !== 'function') {
            return;
        }

        let count = 0;
        const firedEvents = {};

        for (let i = 0; i < events.length; i++) {
            const eventName = events[i];
            firedEvents[eventName] = false;

            //if all events listed (dependencies) have already happened it run callback
            if (services.loadEvents[eventName]) {
                firedEvents[eventName] = true;
                const allEventsAreFired = ++count === events.length;

                if (allEventsAreFired) {
                    callback();
                }
            } else {
                let callbackNotFired = true;
                // else it creates a EventListener for each listed event
                // this function given to the event listener creates a clousure
                // so the callback is not going to be called until the last event
                // has happened
                target.addEventListener(
                    eventName,
                    function () {
                        firedEvents[eventName] = true;
                        const allEventsAreFired = events.reduce((total, current) => total && firedEvents[current], true);

                        if (callbackNotFired && allEventsAreFired) {
                            callbackNotFired = false;
                            callback();
                        }
                    },
                    false
                );
            }
        }
    };

    Sephora.Util.Perf.isReportSupported = function () {
        return window.performance && typeof window.performance.mark === 'function';
    };

    Sephora.Util.Perf.report = function (data, timestamp) {
        var shouldTimestamp = Sephora.Util.Perf.isReportSupported() && timestamp === undefined;
        var performance = window.performance || null;
        var event = {
            data: data,
            time: performance && performance.now ? performance.now() : null,
            timestamp: shouldTimestamp
        };

        Sephora.Util.Perf.loadEvents.push(event);
        // console.log('Data: '+event.data+' time: '+event.time);

        if (shouldTimestamp && typeof window.console.timeStamp === 'function') {
            var label = null;

            if (typeof data === 'string') {
                label = data;
            } else if (Array.isArray(data) && data.length) {
                label = data[0];
            }

            event.label = label;
            window.console.timeStamp(label);

            performance.clearMarks(label);
            performance.mark(label);
            updateDigitalData(label, event.time);
        }
    };

    let digitalDataEvents = [];

    const updateDigitalData = (eventName, eventTime) => {
        if (Sephora.performance) {
            if (digitalDataEvents.length) {
                digitalDataEvents.forEach(item => Sephora.performance.renderTime.updateDigitalData(item.eventName, item.eventTime));
                digitalDataEvents = [];
            }

            Sephora.performance.renderTime.updateDigitalData(eventName, eventTime);
        } else {
            digitalDataEvents.push({
                eventName,
                eventTime
            });
        }
    };

    Sephora.loadFunctions = {
        onLoad: function () {
            Sephora.LoadFired = true;
            services.loadEvents.load = true;
            Sephora.Util.Perf.report('Load Event Fired');
        },

        onDomContentLoad: function () {
            Sephora.DOMContentLoadedFired = true;
            services.loadEvents.DOMContentLoaded = true;
            Sephora.Util.Perf.report('DOMContentLoaded');
        }
    };

    /* If document has been loaded or is complete by the time we reach here call function,
    else add listener */
    if (document.readyState === 'complete' || document.readyState === 'loaded') {
        Sephora.loadFunctions.onDomContentLoad();
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            Sephora.loadFunctions.onDomContentLoad();
        });
    }

    /* If document has been loaded by the time we reach here call function, else add listener */
    if (document.readyState === 'complete') {
        Sephora.loadFunctions.onLoad();
    } else {
        window.addEventListener('load', function () {
            Sephora.loadFunctions.onLoad();
        });
    }

    Sephora.Util.InflatorComps.queue = function (className, props, renderEvent, element) {
        // console.log('queue: ' + className);
        if (!services[renderEvent]) {
            /* Initialize services object */
            services[renderEvent] = {};
            services[renderEvent].queue = [];
        }

        var currentScript =
                document.currentScript ||
                (function () {
                    var scripts = document.getElementsByTagName('script');

                    return scripts[scripts.length - 1];
                }()),
            scriptParent = currentScript.parentNode,
            renderElement;

        if (element) {
            renderElement = element;
        } else {
            // We remove the script tags here so that the SSR matches the client side render
            // when react hydrates. Its not clear if this is necessary or not since the script
            // tag is below the component being targeted but it done here as a precaution.
            renderElement = scriptParent;
            scriptParent.removeChild(currentScript);
        }

        /* Important services data should be added to the store before loadEvents.ServiceReady
        is set to true */
        if (services.loadEvents[renderEvent + 'Ready'] === true) {
            Sephora.Util.InflatorComps.render(className, props, renderElement);
        } else {
            services[renderEvent].queue.push({
                class: className,
                props: props,
                element: renderElement
            });
        }
    };

    // Time constants
    const SECONDS = 1000;
    const MINUTES = 60 * SECONDS;
    const HOURS = 60 * MINUTES;
    // Not removing it for now as it may be used by someone else
    //const DAYS = 24 * HOURS;

    var getItemFromLocalStorage = function (itemName) {
        const item = window.localStorage.getItem(itemName) || '';

        return item && item !== '{}' ? JSON.parse(item).data : null;
    };

    Sephora.Util.getItemFromLocalStorage = getItemFromLocalStorage;

    var profileSecurityStatus = getItemFromLocalStorage('profileSecurityStatus');
    const RCPS_FULL_PROFILE_GROUP = 'rcps_full_profile_group';
    var isAnonymousUser = !profileSecurityStatus || profileSecurityStatus < 1;
    var isRCPSFullProfileGroup = cookieStore()[RCPS_FULL_PROFILE_GROUP] === 'true';

    /* Process page cookies, cache, and information passed by the server to decide which api
    to call for initial user-related data. */
    var defaultUserProfileShoppingList = {
        profileLocale: Sephora.renderQueryParams.country
    };
    var defaultUserProfile = Object.assign({}, defaultUserProfileShoppingList);

    if (isAnonymousUser && isRCPSFullProfileGroup) {
        defaultUserProfile.enablePickupSearchFilterInBrowse = true;
        defaultUserProfile.enableSameDaySearchFilterInBrowse = true;
    }

    var localUserData = {
        profile: defaultUserProfile,
        shoppingList: defaultUserProfileShoppingList,
        basket: {},
        loves: {},
        targetedPromotion: {},
        personalizedPromotions: {},
        availableRRCCoupons: {},
        smsStatus: {},
        beautyPreference: {},
        tax: {},
        segments: {}
    };

    var isFromKarmaTest = function () {
        return typeof window !== 'undefined' && window.__karma__ !== undefined;
    };

    var isCheckout = function () {
        return window.location.pathname.indexOf('/checkout') === 0;
    };

    var isMyAccount = function () {
        return window.location.pathname === '/profile/MyAccount';
    };

    const isAutoReplenishPage = function () {
        return window.location.pathname === '/profile/MyAccount/AutoReplenishment';
    };

    var shouldGetWelcomeMats = function () {
        var countryCookieName = 'current_country';
        var pageCountry = Sephora.renderQueryParams.country;
        var userCountry = cookieStore()[countryCookieName] || null;

        if (userCountry && pageCountry) {
            return userCountry.toLowerCase() !== pageCountry.toLowerCase();
        } else {
            return true;
        }
    };

    Sephora.Util.shouldGetWelcomeMats = shouldGetWelcomeMats;

    var getCurrentUser = function () {
        const profileId = getItemFromLocalStorage('profileId');
        // Set in Head.f.jsx
        var ignoreATGDynAndJsessionId = Boolean(Sephora?.ignoreATGDynAndJsessionId) || false;
        var userCookie = 'DYN_USER_ID';
        var basketCookie = 'ATG_ORDER_CONTENT';

        var isRecognized = false;
        var hasBasket = cookieStore()[basketCookie] !== undefined;

        if (profileId && ignoreATGDynAndJsessionId) {
            isRecognized = true;
        }

        if (!ignoreATGDynAndJsessionId) {
            isRecognized = Sephora.Util.TestTarget.isRecognized = cookieStore()[userCookie] !== undefined;
        }

        return {
            isRecognized,
            hasBasket,
            shouldGetWelcomeMats: shouldGetWelcomeMats()
        };
    };

    var currentUser = getCurrentUser();

    Sephora.Util.getCurrentUser = getCurrentUser;

    var getCache = function (key, personalization, storageType = 'local') {
        var storage = storageType === 'session' ? window.sessionStorage : window.localStorage;
        var data = storage.getItem(key);
        var parsedData = null;
        var cacheHasExpired = function (expiry) {
            return Date.parse(expiry) < new Date().getTime();
        };

        if (!data) {
            return null;
        }

        parsedData = JSON.parse(data);

        if (!parsedData.expiry || cacheHasExpired(parsedData.expiry)) {
            return null;
        } else {
            if (personalization) {
                return parsedData;
            }

            return parsedData.data;
        }
    };

    const ENABLE_FULL_PROFILE_GROUP = 'enablefullProfileGroup';

    // eslint-disable-next-line consistent-return
    function hasFullProfileGroupValueChanged() {
        try {
            const isRCPSFullProfileGroup = cookieStore()[RCPS_FULL_PROFILE_GROUP] === 'true';
            const { enablefullProfileGroup = false } = Sephora;

            const storedIsRCPSFullProfileGroup = getItemFromLocalStorage(RCPS_FULL_PROFILE_GROUP);
            const storedEnablefullProfileGroup = getItemFromLocalStorage(ENABLE_FULL_PROFILE_GROUP);

            return isRCPSFullProfileGroup !== storedIsRCPSFullProfileGroup || enablefullProfileGroup !== storedEnablefullProfileGroup;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    function updateFullProfileGroupInLocalStorage() {
        const { enablefullProfileGroup = false } = Sephora;
        const isRCPSFullProfileGroup = cookieStore()[RCPS_FULL_PROFILE_GROUP] === 'true';

        window.localStorage.setItem(ENABLE_FULL_PROFILE_GROUP, JSON.stringify({ data: enablefullProfileGroup }));
        window.localStorage.setItem(
            RCPS_FULL_PROFILE_GROUP,
            JSON.stringify({
                data: isRCPSFullProfileGroup
            })
        );
    }

    Sephora.Util.getCache = getCache;
    var BASKET_CACHE_KEY = 'basket';
    var USER_CACHE_KEY = 'UserData';
    var getUserInfoCache = function () {
        /* User content pages should not load from cache */
        var userPages = ['profile', 'myprofile', 'gallery', 'shopping-list', 'happening/reservations'];
        var path = window.location.pathname;

        var isCurrentPage = function (url) {
            return path.indexOf(url) > -1;
        };

        if (hasFullProfileGroupValueChanged()) {
            window.localStorage.removeItem(USER_CACHE_KEY);
            updateFullProfileGroupInLocalStorage();

            return null;
        }

        if (userPages.some(isCurrentPage)) {
            return null;
        } else {
            var cachedData = getCache(USER_CACHE_KEY);

            if (typeof cachedData === 'string') {
                try {
                    cachedData = JSON.parse(cachedData);
                } catch (e) {
                    console.error('Error parsing cached user data:', e);

                    return null;
                }
            }

            return cachedData;
        }
    };

    Sephora.Util.getUserInfoCache = getUserInfoCache;

    var userInfoCache = getUserInfoCache();

    /* AJAX call and necessary handlers. */
    var retryCount = 0;
    var errorHandler = function (retryMethod, message) {
        if (retryCount < 2) {
            retryCount++;

            retryMethod();
        } else {
            console.error(message);
        }
    };

    var setUserData = function (data, dataIsFromCache) {
        if (!services.UserInfo) {
            services.UserInfo = { queue: [] };
        }

        services.UserInfo.data = data;
        services.UserInfo.dataIsFromCache = dataIsFromCache || false;
        services.loadEvents.UserInfoLoaded = true;
        Sephora.Util.Perf.report('UserInfo Loaded');
        window.dispatchEvent(new CustomEvent('UserInfoLoaded', { detail: {} }));
    };

    const setBasketData = function (data) {
        if (!services.BasketInfo) {
            services.BasketInfo = { queue: [] };
        }

        services.BasketInfo.data = data;
        services.loadEvents.BasketInfoLoaded = true;
        window.dispatchEvent(new CustomEvent('BasketInfoLoaded', { detail: {} }));
    };

    var fullProfileGroupCookieName = 'rcps_full_profile_group';
    var isRCPSFullProfileGroupAPIEnabled = cookieStore()[fullProfileGroupCookieName] === 'true';

    /* REFRESH TOKEN SERVICE*/
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
        static AUTH_ACCESS_TOKEN = 'accessToken';
        static AUTH_REFRESH_TOKEN = 'refreshToken';
        static PROFILE_SECURITY_STATUS = 'profileSecurityStatus';
        static LAST_USER_INTERACTION = 'lastUserInteraction';
        static USER_DIDNT_INTERACT = 'userDidntInteract';
        static REFRESH_DATA_STORAGE_KEY = 'REFRESH_DATA_STORAGE_KEY';
        static INVALID_TOKEN_MESSAGE = 'Invalid Token!';
        static DEFAULT_RETRY_IN_MS = 2 * 60 * 1000;
        static TOKEN_EXPIRE_THRESHOLD_MS = 60 * 1000;
        static LOGGED_IN = 4;
        static RECOGNIZED_SSI = 3;
        static RECOGNIZED = 2;
        static ERROR_CODES = [500, 503];
        static isSignOutOnInit = false;

        static refreshData = {
            currentTimerId: null,
            inProgress: false,
            refreshTokenRetries: 0,
            tokenExpirationTime: null,
            is400Error: false
        };

        static initialize = async () => {
            try {
                // Required on the method level bc/ of a circular dependency otherwise.
                const cachedAccessToken = getCache(RefreshToken.AUTH_ACCESS_TOKEN);
                const cachedRefreshToken = getCache(RefreshToken.AUTH_REFRESH_TOKEN);
                const cachedProfileSecurityStatus = getItemFromLocalStorage(RefreshToken.PROFILE_SECURITY_STATUS);

                RefreshToken.updateLocalData({}, true);
                RefreshToken.initUserComeBackLogic();
                RefreshToken.clearInProgressBeforeUnload();

                //  Get new anonymous tokes If tokens are not exist or refresh token is expired
                if (!RefreshToken.isRefreshTokenValid() || (!cachedAccessToken && !cachedRefreshToken)) {
                    if (cachedProfileSecurityStatus > 0) {
                        // set flag to true, user should be sign out+
                        RefreshToken.isSignOutOnInit = true;
                    }

                    return RefreshToken.getNewTokens();
                }

                // Retry every 2 minutes if there is a timer in progress,
                // case when 2 or more tabs initialise refreshToken call at the same time
                if (RefreshToken.refreshData.inProgress) {
                    return RefreshToken.setTokenTimer(RefreshToken.DEFAULT_RETRY_IN_MS);
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

        static getCurrentTimeMs = () => new Date().getTime();

        /**
         * Get is user interact with site within token expiration time
         * @return {boolean}
         *
         * @memberof RefreshToken
         */
        static hasUserInteractedWithinTokenTime = () => {
            const cachedAccessToken = getCache(RefreshToken.AUTH_ACCESS_TOKEN);
            const cachedLastInteraction = getItemFromLocalStorage(RefreshToken.LAST_USER_INTERACTION);

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
            const cachedAccessToken = getCache(RefreshToken.AUTH_ACCESS_TOKEN);
            const cachedRefreshToken = getCache(RefreshToken.AUTH_REFRESH_TOKEN);
            const cachedRefreshData = getItemFromLocalStorage(RefreshToken.REFRESH_DATA_STORAGE_KEY) || RefreshToken.refreshData;
            const isLoggedInBeforeRefresh = RefreshToken.isUserLoggedIn();

            //do nothing is user didn't interact with site within token expiration time
            if (!RefreshToken.hasUserInteractedWithinTokenTime() && !isExpiredSession) {
                window.localStorage.setItem(RefreshToken.USER_DIDNT_INTERACT, true);

                return null;
            }

            // mark that call logic in progress, to prevent same execution on another tab
            RefreshToken.updateLocalData({ inProgress: true });

            let newAuthTokens = {};

            try {
                newAuthTokens = await RefreshToken.fetchRefreshToken(
                    {
                        accessToken: cachedAccessToken,
                        refreshToken: cachedRefreshToken
                    },
                    { headers: { 'X-CAUSED-BY-URL': 'proactive_refresh' } }
                );
            } catch (error) {
                if (error.errorCode === 403 || error.errors?.[0]?.errorMessage.includes(RefreshToken.INVALID_TOKEN_MESSAGE)) {
                    window.dispatchEvent(new CustomEvent('ResetUser'));

                    return false;
                }
            }

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
                    // As we don't have a response from refreshToken, we are overriding it to RefreshToken.RECOGNIZED=2
                    if (RefreshToken.isUserLoggedIn()) {
                        window.dispatchEvent(new CustomEvent('UpdateProfileStatus', { profileSecurityStatus: [RefreshToken.RECOGNIZED] }));
                    }

                    //trigger event that token api failed
                    window.dispatchEvent(new CustomEvent('AuthTokenFailed', { detail: {} }));
                }

                return false;
            }

            //if we have 403 error, logout user and clear localStorage
            if ((newAuthTokens.responseStatus === 403 || newAuthTokens.errorCode === 403) && RefreshToken.isUserLoggedIn()) {
                if (isExpiredSession) {
                    //if expired on init, mark that user should be sign out when store will be ready
                    RefreshToken.isSignOutOnInit = true;
                } else {
                    //trigger an event to sign out user
                    window.dispatchEvent(
                        new CustomEvent('UserSignOut', {
                            detail: { xCausedHeader: `forceful logout 403 refresh token: ${window.location.pathname}` }
                        })
                    );
                }

                return false;
            }

            // Do nothing if an additional error is received
            if (newAuthTokens.errors) {
                RefreshToken.updateLocalData({
                    inProgress: false,
                    is400Error: false
                });

                //trigger event that token api failed
                window.dispatchEvent(new CustomEvent('AuthTokenFailed', { detail: {} }));

                return null;
            }

            //if user access token was expired and user was logged in before -> use profileStatus based on SSI
            // if not -> than use from response
            const newProfileStatus =
                isExpiredSession && isLoggedInBeforeRefresh ? RefreshToken.getSSIProfileStatus() : newAuthTokens.profileSecurityStatus;

            const tokenData = {
                profileSecurityStatus: [newProfileStatus],
                accessToken: [newAuthTokens.accessToken, newAuthTokens?.atExp],
                refreshToken: [newAuthTokens.refreshToken, newAuthTokens?.rtExp]
            };

            RefreshToken.updateLocalData({
                inProgress: false,
                refreshTokenRetries: 0
            });

            //notify to update profile status
            window.dispatchEvent(new CustomEvent('UpdateProfileStatus', { detail: tokenData }));
            //notify that tokens ready
            window.dispatchEvent(new CustomEvent('AuthTokenReceived'));

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
            if (!RefreshToken.refreshData.tokenExpirationTime) {
                return RefreshToken.DEFAULT_RETRY_IN_MS;
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
                return RefreshToken.getCurrentTimeMs() + RefreshToken.DEFAULT_RETRY_IN_MS;
            }

            return currentTokenExp - RefreshToken.TOKEN_EXPIRE_THRESHOLD_MS;
        }

        /**
         * Get the current expiration time from the access token and parsed to milliseconds
         * @param {string} token optional token
         * @returns Access token expiration time in milliseconds
         *
         * @memberof RefreshToken
         */
        static getTokenExpirationTime = token => {
            const currentAccessToken = token || getCache(RefreshToken.AUTH_ACCESS_TOKEN);

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
        static setRefreshAccessToken = async () => {
            const storedRefreshData = getItemFromLocalStorage(RefreshToken.REFRESH_DATA_STORAGE_KEY) || RefreshToken.refreshData;

            // if previous refreshToken API calls failed due to 400/500 error, do nothing
            if (storedRefreshData.is400Error) {
                return null;
            }

            // if previous request in progress, set timeout to rerun in 2 mins
            if (storedRefreshData.inProgress) {
                return RefreshToken.setTokenTimer(RefreshToken.DEFAULT_RETRY_IN_MS);
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
            const storedAccessToken = getCache(RefreshToken.AUTH_ACCESS_TOKEN);

            if (!storedAccessToken) {
                return false;
            }

            const currentTime = RefreshToken.getCurrentTimeMs();
            const timeToRefresh = RefreshToken.getTimeToExpire();

            return currentTime < timeToRefresh && !RefreshToken.refreshData.inProgress;
        };

        /**
         * Stop the current timer
         *
         * @memberof RefreshToken
         */
        static stopCurrentTimer = () => {
            clearTimeout(RefreshToken.refreshData.currentTimerId);
        };

        /**
         * Updates the local refreshData to keep in sync with multiple tabs
         * @param {object} newRefreshData New refresh data object
         * @param {boolean} isInit optional, is initialization fn call
         *
         * @memberof RefreshToken
         */
        static updateLocalData = (newRefreshData = {}, isInit = false) => {
            const storedRefreshData = getItemFromLocalStorage(RefreshToken.REFRESH_DATA_STORAGE_KEY) || RefreshToken.refreshData;
            // If inProgress is not set in newRefreshData, use the stored value or default to false
            const inProgress = Object.prototype.hasOwnProperty.call(newRefreshData, 'inProgress')
                ? newRefreshData.inProgress
                : storedRefreshData.inProgress || false;

            if (isInit) {
                storedRefreshData.is400Error = false;
            }

            RefreshToken.refreshData = {
                ...storedRefreshData,
                ...newRefreshData,
                inProgress,
                tokenExpirationTime: newRefreshData.tokenExpirationTime || RefreshToken.getTokenExpirationTime()
            };

            window.localStorage.setItem(RefreshToken.REFRESH_DATA_STORAGE_KEY, JSON.stringify({ data: RefreshToken.refreshData }));
        };

        /**
         * Get is User legged in or not based on current profileStatus
         *
         * @memberof RefreshToken
         */
        static isUserLoggedIn = () => {
            const cachedProfileStatus = getItemFromLocalStorage(RefreshToken.PROFILE_SECURITY_STATUS);
            const recognizedStatuses = [RefreshToken.LOGGED_IN, RefreshToken.RECOGNIZED_SSI, RefreshToken.RECOGNIZED];

            return cachedProfileStatus ? recognizedStatuses.includes(cachedProfileStatus) : false;
        };

        /**
         * Get profile status depends on was user SSI or no
         *
         * @memberof RefreshToken
         */
        static getSSIProfileStatus = () => {
            const isSSI = cookieStore()['SSIT'];

            return isSSI ? RefreshToken.RECOGNIZED_SSI : RefreshToken.RECOGNIZED;
        };

        /**
         * Check is refresh token is valid (exist and not expired)
         *
         * @memberof RefreshToken
         */
        static isRefreshTokenValid = () => {
            const storedRefreshToken = getCache(RefreshToken.AUTH_REFRESH_TOKEN);

            if (!storedRefreshToken) {
                return false;
            }

            const currentTime = RefreshToken.getCurrentTimeMs();
            const timeToRefresh = RefreshToken.getTimeToExpire(storedRefreshToken);

            return currentTime < timeToRefresh;
        };

        /**
         * Get new tokens by calling /v2/session api
         *
         * @memberof RefreshToken
         */
        static getNewTokens = async () => {
            window.localStorage.removeItem(RefreshToken.AUTH_ACCESS_TOKEN);
            window.localStorage.removeItem(RefreshToken.AUTH_REFRESH_TOKEN);

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
                await RefreshToken.updateTokens();
            });

            //remove userDidntInteract flag on every hard reload
            window.localStorage.removeItem(RefreshToken.USER_DIDNT_INTERACT);
        };

        /**
         * Get refreshed or new tokens
         *
         * @memberof RefreshToken
         */
        static updateTokens = async () => {
            const isLoggedInBeforeRefresh = RefreshToken.isUserLoggedIn();

            //if refresh token valid -> calling refreshToken api
            if (RefreshToken.isRefreshTokenValid()) {
                await RefreshToken.getRefreshedTokens();
            } else {
                //sign out user if it was logged in and refresh token expired
                if (isLoggedInBeforeRefresh) {
                    //notify that user should be sign out
                    window.dispatchEvent(
                        new CustomEvent('UserSignOut', {
                            detail: {
                                xCausedHeader: `forceful logout for expired refresh token: ${window.location.pathname}`
                            }
                        })
                    );
                } else {
                    //get new anonymous tokens if refresh token expired and user was anonymous
                    await RefreshToken.getNewTokens();
                }
            }
        };

        /**
         * Get fingerprint hash
         *
         * @memberof RefreshToken
         */
        static getFingerPrint = () => {
            return window.FingerprintJS.load().then(function (fp) {
                return fp.get().then(function (result) {
                    return result.visitorId;
                });
            });
        };

        /**
         * Fetch /v2/session
         *
         * @memberof RefreshToken
         */
        static fetchAnonymousToken = async (config = {}) => {
            const url = '/gway/v1/dotcom/auth/v2/session';
            const deviceFingerprint = await RefreshToken.getFingerPrint();
            const accessToken = getCache(RefreshToken.AUTH_ACCESS_TOKEN);
            const refreshToken = getCache(RefreshToken.AUTH_REFRESH_TOKEN);

            if (accessToken && refreshToken) {
                return null;
            }

            return fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        deviceId: deviceFingerprint
                    }
                },
                config
            )
                .then(res => res.json())
                .then(tokenData => {
                    if (tokenData.errorCode || tokenData.errors || RefreshToken.ERROR_CODES.includes(tokenData.responseStatus)) {
                        return Promise.reject(tokenData);
                    }

                    const tokenDataWithAccessToken = {
                        profileSecurityStatus: [tokenData.profileSecurityStatus],
                        accessToken: [tokenData.accessToken, tokenData.atExp],
                        refreshToken: [tokenData.refreshToken, tokenData.rtExp]
                    };

                    //notify that profileStatus should be updated
                    window.dispatchEvent(new CustomEvent('UpdateProfileStatus', { detail: tokenDataWithAccessToken }));
                    //notify that tokens ready
                    window.dispatchEvent(new CustomEvent('AuthTokenReceived'));

                    return tokenData;
                })
                .catch(err => Promise.reject(err));
        };

        /**
         * Fetch refreshToken
         *
         * @memberof RefreshToken
         */
        static fetchRefreshToken = async (bodyJSON, options) => {
            let url = '/gway/v1/dotcom/auth/v1/refreshToken';
            const newRefreshTokenFlow = Boolean(Sephora?.newRefreshTokenFlow);
            let headers = {
                'Content-type': 'application/json',
                'x-requested-source': 'web',
                deviceId: await RefreshToken.getFingerPrint()
            };

            if (newRefreshTokenFlow) {
                url = '/gway/v1/dotcom/auth/v2/refreshToken';
                const email = getItemFromLocalStorage('userEmail');

                if (email) {
                    bodyJSON.email = email;
                }

                headers['Seph-Access-Token'] = bodyJSON.accessToken;
            }

            if (options.headers) {
                headers = {
                    ...headers,
                    ...options.headers
                };
            }

            return fetch(url, {
                url,
                method: 'POST',
                body: JSON.stringify(bodyJSON),
                headers
            })
                .then(res => res.json())
                .then(data => {
                    if (data.errorCode || data.errors) {
                        return Promise.reject(data);
                    }

                    return data;
                });
        };

        /**
         * Get anonymous tokens with 3 retries
         *
         * @memberof RefreshToken
         */
        // eslint-disable-next-line consistent-return
        static getAnonymousToken = () => {
            /**
             *  If we already have a valid access + refresh tokens in LS, and the access token is still valid
             * (isAccessTokenValid() returns true) then do nothing.
             * This avoids unnecessary API calls to the /v2/session endpoint.
             */
            const cachedAccessToken = getCache(RefreshToken.AUTH_ACCESS_TOKEN);
            const cachedRefreshToken = getCache(RefreshToken.AUTH_REFRESH_TOKEN);

            if (cachedAccessToken && cachedRefreshToken && RefreshToken.isAccessTokenValid()) {
                // Already have valid tokens, do not call API
                return null;
            }

            // Early exit if a request is already in progress
            const storedRefreshData = getItemFromLocalStorage(RefreshToken.REFRESH_DATA_STORAGE_KEY) || RefreshToken.refreshData;

            if (storedRefreshData.inProgress) {
                // Another call is in progress, do not call API
                return null;
            }

            // Mark as in progress
            RefreshToken.updateLocalData({ inProgress: true });

            const numRetries = 1;

            async function callGetAnonymousToken(retries) {
                try {
                    await RefreshToken.fetchAnonymousToken();

                    return RefreshToken.setTokenTimer();
                } catch (error) {
                    if (retries < 3) {
                        return callGetAnonymousToken(retries + 1);
                    }

                    Sephora.logger.error(error);

                    return null;
                } finally {
                    // Clear inProgress flag after the call is done
                    RefreshToken.updateLocalData({ inProgress: false });
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
                const cachedRefreshData = getItemFromLocalStorage(RefreshToken.REFRESH_DATA_STORAGE_KEY);

                if (cachedRefreshData?.inProgress) {
                    RefreshToken.refreshData.inProgress = false;
                    window.localStorage.setItem(RefreshToken.REFRESH_DATA_STORAGE_KEY, JSON.stringify({ data: RefreshToken.refreshData }));
                }
            });
        };
    }

    if (isRCPSFullProfileGroupAPIEnabled && Sephora.isNewAuthEnabled) {
        //wait while fingeprint will be initialized
        const idInterval = setInterval(() => {
            if (window.FingerprintJS) {
                clearInterval(idInterval);
                RefreshToken.initialize();
            }
        }, 100);

        Sephora.Util.RefreshToken = RefreshToken;
    }

    /* END OF REFRESH TOKEN SERVICE*/

    var handleRequestResponse = function (callback, retryMethod, errorMessage) {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = null;

                try {
                    response = JSON.parse(this.responseText);
                } catch (error) {
                    console.error(error);
                }
                callback(response);
            } else if (
                [401, 403].includes(this.status) &&
                this.responseURL.includes('gapi/users/profiles') &&
                !(isRCPSFullProfileGroupAPIEnabled || Sephora.isNewAuthEnabled)
            ) {
                refreshToken();
            } else if (this.status === 403 && this.responseURL.includes('auth/v1/refreshToken')) {
                const userData = getCache('UserData');
                // I noticed that if we make the profileStatus = 2 and then setUserData
                // The mega nav bar and top banner load with no issues, plues, the content
                // in MyAccount pages are hidden, which is same behavior as ATG
                // BUT, after the user logs in, I wasn't able to "refresh" the page and show the content
                setUserData(userData);
                window.dispatchEvent(new CustomEvent('promptUserToSignIn'));
            } else {
                errorHandler(retryMethod, errorMessage);
            }
        }
    };

    /* Decide what to include in call */

    var shouldGetUserFull = function (basketCache, currentUser, userInfoCache) {
        var result;
        const isAnonymousUser = !getItemFromLocalStorage('profileSecurityStatus');

        // return false for anonymous user, they will get tokens from /v2/session call
        if (isAnonymousUser && isRCPSFullProfileGroupAPIEnabled) {
            return false;
        }

        if (currentUser.isRecognized) {
            /* For now we can't distinguish between an empty basket and an inactive basket for
            logged in users (like we can for anonymous users with ATG_ORDER_CONTENT). This
            means that for now, both caches are coupled and limited here by the basket cache's 15
            minute TTL. We'll explore how to address this for logged in users to be able to
            make use of the user info cache's 60 minute TTL. */
            result = !(userInfoCache?.profile?.loginStatus && basketCache);
        } else if (currentUser.hasBasket && !basketCache) {
            result = true;
        } else if (currentUser.shouldGetWelcomeMats) {
            result = true;
        } else if (!currentUser.isRecognized && !currentUser.hasBasket && !basketCache) {
            // Fetch empty basket for anonymous user ONCE, only if basket data isn't cached yet
            result = true;
        } else {
            result = false;
        }

        return result;
    };

    Sephora.Util.shouldGetUserFull = shouldGetUserFull;

    var shouldGetTargeters = function () {
        return Sephora.targetersToInclude && Sephora.targetersToInclude !== '?';
    };
    Sephora.Util.shouldGetTargeters = shouldGetTargeters;

    const shouldGetTargetedPromotion = function () {
        let bannerInfo;
        const isUserLoggedIn = getCurrentUser()?.isRecognized;

        if (Sephora.rwdPersistentBanner1) {
            bannerInfo = Sephora.rwdPersistentBanner1[0];
        } else {
            return isUserLoggedIn;
        }

        /*
        Logic is based on
        https://confluence.sephora.com/wiki/display/ILLUMINATE/Persistent+Banner+Use+Cases
        Decided if TargetedPromotion need to be send in IncludeAPi.
        The fallback scenario is in PersistentBanner.ctrlr.jsx
        */
        if (bannerInfo.isTopPriority === true) {
            return false;
        } else {
            return isUserLoggedIn;
        }
    };
    Sephora.Util.shouldGetTargetedPromotion = shouldGetTargetedPromotion;

    const shouldGetTaxData = function () {
        return Sephora.isTaxExemptionEnabled && isMyAccount();
    };

    // This method is duplicated from sku utils https://jira.sephora.com/browse/UA-639
    var getProductPageData = function () {
        var productData = null;

        var clearUrl = decodeURI(Sephora.renderQueryParams.urlPath).replace(/[^a-zA-Z0-9]/g, '');
        var pidResult = /P\d+$/.exec(clearUrl);

        if (pidResult) {
            productData = {
                productId: pidResult[0]
            };

            var skuIdResult = /skuId=(\d+)/.exec(location.search);

            if (skuIdResult) {
                productData.skuId = skuIdResult[1];
            }
        }

        return productData;
    };

    const getBasketData = async function () {
        const cachedBasket = getCache('basket') || {};
        const isBasketNotEmpty = Object.keys(cachedBasket).length > 0;
        const isUserLoggedIn = getCurrentUser()?.isRecognized;
        const sephAccessToken = JSON.parse(localStorage.getItem('accessToken'))?.data;
        const sdnUfeAPIUserKey = isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup ? Sephora.sdnUfeAPIUserKey : Sephora.clientKey;

        if (isBasketNotEmpty && !isUserLoggedIn) {
            setBasketData(cachedBasket);
        } else {
            try {
                const response = await fetch('/api/shopping-cart/basket', {
                    headers: {
                        'Seph-Access-Token': sephAccessToken,
                        'x-api-key': sdnUfeAPIUserKey
                    }
                });
                const data = await response.json();
                setBasketData(data);
            } catch (error) {
                console.error('Error getting basket data:', error);
            }
        }
    };

    Sephora.Util.getBasketData = getBasketData;

    const appendParam = (param, key) => {
        if (param) {
            return `&${key}=${param}`;
        }

        return '';
    };

    var refreshToken = function () {
        var url = '/api/auth/v1/refreshToken';
        var refreshToken = getItemFromLocalStorage('refreshToken');
        var userEmail = getItemFromLocalStorage('userEmail');

        var bodyJSON = JSON.stringify({
            email: userEmail,
            refreshToken
        });

        var req = new window.XMLHttpRequest();
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('x-requested-source', 'web');
        req.setRequestHeader(
            'x-api-key',
            isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup ? Sephora.sdnUfeAPIUserKey : Sephora.clientKey
        );
        req.onreadystatechange = function () {
            // handle 403 error, that's need to hide content in account page
            if (this.status === 403) {
                const userData = getCache('UserData');

                if (userData && userData.profile) {
                    userData.profile.loginStatus = 2;
                    setUserData(userData);
                }
            }

            handleRequestResponse.call(
                this,
                function (response) {
                    window.localStorage.setItem('accessToken', JSON.stringify({ data: response.accessToken }));
                    window.localStorage.setItem('refreshToken', JSON.stringify({ data: response.refreshToken }));
                    fetchInitialData();
                },
                fetchInitialData,
                'user full call unsuccessful after 3 attempts'
            );
        };

        req.send(bodyJSON);
    };

    const hasAutoReplenishSubscriptions = function (userData = {}) {
        let hasAutoReplenishSubscriptions = false;

        if (userData?.profile) {
            const user = userData.profile;
            hasAutoReplenishSubscriptions =
                Array.isArray(user.subscriptionSummary) &&
                user.subscriptionSummary?.some(
                    subscription => subscription.type === 'REPLENISHMENT' && (subscription.active || subscription.paused || subscription.cancelled)
                );
        }

        return hasAutoReplenishSubscriptions;
    };

    /* eslint-disable-next-line complexity */
    var makeUserFullXhr = function (
        includeUserInfo,
        productPageData,
        includeTargetedPromotion,
        includePersonalizedPromotions,
        includeAvailableRRCCoupons,
        includeSmsStatus,
        includeTaxInfo,
        forceLinkedAccountDetails
    ) {
        var skipApis = [];
        var includeApis = [];

        if (includeUserInfo) {
            includeApis.push('profile', 'loves', 'shoppingList', 'smsStatus', 'tax', 'beautyPreference');
        }

        // need to exclude basket from full user call when rcps_full_profile_group cookie is true
        if (isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup) {
            includeApis.push('biPoints');
        } else {
            includeApis.push('basket');
        }

        skipApis.push('targetersResult');

        if (includeTargetedPromotion) {
            includeApis.push('targetedPromotion');
        }

        if (includePersonalizedPromotions) {
            includeApis.push('personalizedPromotions');
        }

        if (includeAvailableRRCCoupons) {
            includeApis.push('availableRRCCoupons');
        }

        if (includeSmsStatus) {
            includeApis.push('smsStatus');
        }

        if (includeTaxInfo) {
            includeApis.push('tax');
        }

        includeApis.push('segments');

        /* Fetch initial data from the user/full endpoint.
         The fetch polyfill is not yet available so we use XMLHttpRequest) */
        var req = new window.XMLHttpRequest();
        var cachebuster = Math.round(new Date().getTime() / 1000);

        var params =
            (includeApis.length > 0 ? '&includeApis=' + includeApis : '') +
            (skipApis.length > 0 ? '&skipApis=' + skipApis : '') +
            (forceLinkedAccountDetails ? '&forceLinkedAccountDetails=true' : '') +
            '&cb=' +
            cachebuster;

        const isRecognizedUser = Sephora.Util.getCurrentUser()?.isRecognized;
        const userData = getCache('UserData');

        if (isRecognizedUser && isAutoReplenishPage()) {
            try {
                params += !hasAutoReplenishSubscriptions(userData) ? '&refreshSubscriptions=true' : '';
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        }

        var url = '/api/users/profiles/current/full?' + params;

        if (isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup && isRecognizedUser) {
            const profileId = getItemFromLocalStorage('profileId');
            const biAccountId = userData?.profile?.beautyInsiderAccount?.biAccountId || getItemFromLocalStorage('biAccountId');
            const selectedStore = getCache('selectedStore', null, 'session');
            const storeId = selectedStore?.storeId || userData?.profile?.preferredStore;

            const sameDayZipcodeCookie = cookieStore()['sameDayZipcodeCookie'];
            const preferredZipCode = sameDayZipcodeCookie || selectedStore?.address?.postalCode;

            params += appendParam(preferredZipCode, 'preferredZipCode');
            params += appendParam(biAccountId, 'biAccountId');
            params += appendParam(storeId, 'storeId');
            params += appendParam('world', 'preferenceStruct');

            url = `/gapi/users/profiles/${profileId}/current/full?` + params;
        }

        req.open('GET', url, true);

        const accessToken = getItemFromLocalStorage('accessToken');

        if (accessToken && isRecognizedUser) {
            req.setRequestHeader('Seph-Access-Token', accessToken);
            req.setRequestHeader(
                'x-api-key',
                isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup ? Sephora.sdnUfeAPIUserKey : Sephora.clientKey
            );
        }

        req.onreadystatechange = function () {
            handleRequestResponse.call(
                this,
                function (response) {
                    const {
                        profile,
                        product,
                        shoppingList,
                        personalizedPromotions,
                        availableRRCCoupons,
                        smsStatus,
                        beautyPreference,
                        tax,
                        segments
                    } = response;
                    // If the response contains profile data then we process the full response for
                    // user data, targeters and potentially product data. If profile is not present
                    // then we parse the response for targeters *only*. All profile data is
                    // default/cached
                    let data;

                    if (profile) {
                        data = response;
                    } else {
                        data = localUserData;
                        data.product = product;
                        data.personalizedPromotions = personalizedPromotions;
                        data.availableRRCCoupons = availableRRCCoupons;
                        data.smsStatus = smsStatus;
                        data.beautyPreference = beautyPreference;
                        data.tax = tax;
                        data.segments = segments;

                        if (shoppingList) {
                            data.shoppingList = shoppingList;
                        }
                    }

                    setUserData(data);
                },
                fetchInitialData,
                'user full call unsuccessful after 3 attempts'
            );
        };

        req.timeout = 10000;
        req.send();
    };

    const setPersonalizedProductData = function (data) {
        if (!services.ProductInfo) {
            services.ProductInfo = { queue: [] };
        }

        services.ProductInfo.data = data;
        services.loadEvents.ProductInfoLoaded = true;
        Sephora.Util.Perf.report('ProductInfo Loaded');
        window.dispatchEvent(new CustomEvent('ProductInfoLoaded', { detail: {} }));
    };

    const getCurrentLanguage = () => {
        return (Sephora.renderQueryParams && Sephora.renderQueryParams.language) || 'EN';
    };

    const getCurrentCountry = () => {
        return (Sephora.renderQueryParams && Sephora.renderQueryParams.country && Sephora.renderQueryParams.country.toUpperCase()) || 'US';
    };

    const getCurrentLanguageCountryCode = () => {
        return `${getCurrentLanguage().toUpperCase()}-${getCurrentCountry().toUpperCase()}`;
    };

    const makePersonalizedProductCallRequest = function (productId, skuId) {
        let url = `/api/v3/users/profiles/${profileId}/product/${productId}?`;
        const userIdCookie = 'DYN_USER_ID';
        const profileId = cookieStore()[userIdCookie] || 'current';

        const queryParams = [];
        queryParams.push('skipAddToRecentlyViewed=false');

        if (skuId) {
            if (skuId !== 'forBV') {
                queryParams.push(`preferedSku=${skuId}`);
            }
        }

        const countryCode = getCurrentCountry();
        const languageCode = getCurrentLanguageCountryCode();
        queryParams.push(`countryCode=${countryCode}&loc=${languageCode}`);

        queryParams.push(`cb=${Math.round(new Date().getTime() / 1000)}`);
        url = url + queryParams.join('&');

        const req = new window.XMLHttpRequest();
        req.open('GET', url, true);

        const accessToken = getItemFromLocalStorage('accessToken');

        if (accessToken && Sephora.Util.getCurrentUser().isRecognized) {
            req.setRequestHeader('Seph-Access-Token', accessToken);
            req.setRequestHeader('x-api-key', Sephora.clientKey);
        }

        req.onreadystatechange = function () {
            handleRequestResponse.call(this, setPersonalizedProductData, fetchInitialData, 'personalized product request failed after 3 attempts');
        };

        req.timeout = 10000;
        req.send();
    };

    /* APIS */
    var autoLoginOnCheckout = function (callback) {
        var url = '/api/ssi/autoLogin';
        var req = new window.XMLHttpRequest();
        req.open('POST', url);
        req.setRequestHeader('x-requested-source', 'web');
        req.onreadystatechange = function () {
            handleRequestResponse.call(
                this,
                function () {
                    if (callback) {
                        callback();
                    }
                },
                fetchInitialData,
                'autologin call unsuccessful after 3 attempts'
            );
        };
        req.send('{}');
    };

    const GraphQLClientHttpHeaders = {
        ContentType: 'Content-Type',
        GraphQLClientName: 'Apollographql-Client-Name',
        GraphQLClientVersion: 'Apollographql-Client-Version',
        Authorization: 'Authorization',
        XAPIKey: 'X-Api-Key'
    };

    const isDataExpired = expiry => {
        return Date.parse(expiry) < new Date().getTime();
    };

    const makeGraphQLRequest = async (operationName, sha256Hash) => {
        const accessToken = getItemFromLocalStorage('accessToken');

        const headers = {
            [GraphQLClientHttpHeaders.ContentType]: 'application/json',
            [GraphQLClientHttpHeaders.GraphQLClientName]: 'UFE',
            [GraphQLClientHttpHeaders.GraphQLClientVersion]: 1,
            [GraphQLClientHttpHeaders.Authorization]: `Bearer ${accessToken}`,
            [GraphQLClientHttpHeaders.XAPIKey]: Sephora.sdnUfeAPIUserKey
        };

        const standardLocaleForRefinements = getCurrentLanguageCountryCode().replace('-', '_');

        const body = {
            operationName,
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash
                }
            },
            variables: {
                standardLocale: standardLocaleForRefinements,
                country: getCurrentCountry()
            }
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        };

        const response = await window.fetch(Sephora.configurationSettings?.gqlAPIEndpoint, options);

        const { data } = await response.json();

        return data;
    };

    const fetchBeautyPreferenceRefinements = async function () {
        try {
            const { refinements } = await makeGraphQLRequest('RefinementsBP', RefinementsBP);

            if (!refinements) {
                console.warn('[GraphQL] No refinements data received');

                return;
            }

            const countryCode = getCurrentLanguageCountryCode();
            const DEFAULT_TTL = HOURS * 4;
            const REFINEMENTS_TTL = Sephora.configurationSettings?.gqlTTLs?.refinements
                ? Number(Sephora.configurationSettings?.gqlTTLs.refinements)
                : DEFAULT_TTL;
            const dataToCache = {
                data: {
                    refinements,
                    countryCode
                },
                expiry: new Date(Date.now() + REFINEMENTS_TTL)
            };

            window.localStorage.setItem('refinements', JSON.stringify(dataToCache));
            window.dispatchEvent(new CustomEvent('MasterListLoaded', { detail: {} }));
        } catch (error) {
            console.error('[GraphQL] API call returned error:', error);
        }
    };

    // Only fetch if there is no cached version of the master list (refinements) or if it is expired or if the country code has changed
    const cachedRefinements = window.localStorage.getItem('refinements');
    const countryCode = getCurrentLanguageCountryCode();
    const parsedCachedRefinements = cachedRefinements && JSON.parse(cachedRefinements);

    if (!cachedRefinements || isDataExpired(parsedCachedRefinements?.expiry) || parsedCachedRefinements?.data?.countryCode !== countryCode) {
        fetchBeautyPreferenceRefinements();
    } else {
        window.dispatchEvent(new CustomEvent('MasterListLoaded', { detail: {} }));
    }

    var reInitializeCheckout = function (callback) {
        var url = '/api/checkout/order/init';
        var req = new window.XMLHttpRequest();
        req.open('POST', url);
        req.onreadystatechange = function () {
            handleRequestResponse.call(
                this,
                function () {
                    if (callback) {
                        callback();
                    }
                },
                fetchInitialData,
                'initialize checkout call unsuccessful after 3 attempts'
            );
        };
        req.send();
    };

    /* FETCH DATA */

    var fetchInitialDataForCheckout = function () {
        // TODO: Add caching strategy
        var queryParams = Sephora.Util.getQueryStringParams();
        var lastOrderId = window.localStorage.getItem('lastUfeInitOrderId');
        var orderId = queryParams?.orderId ? queryParams.orderId[0] : lastOrderId && lastOrderId !== '{}' ? JSON.parse(lastOrderId).data : 'current';
        var url = '/api/checkout/orders/' + orderId + '?includeShippingItems=true&includeProfileFlags=true';
        var req = new window.XMLHttpRequest();
        req.open('GET', url, true);

        var accessToken = getItemFromLocalStorage('accessToken');
        var shouldAddTokens = (isRCPSFullProfileGroupAPIEnabled && Sephora.isNewAuthEnabled) || Sephora.Util.getCurrentUser().isRecognized;

        if (accessToken && shouldAddTokens) {
            req.setRequestHeader('Seph-Access-Token', accessToken);
            req.setRequestHeader('x-api-key', Sephora.clientKey);
        }

        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 403) {
                    window.location = window.origin + '/basket';
                } else {
                    handleRequestResponse.call(
                        this,
                        function (data) {
                            // need to catch errorCode here because status comes back as 200
                            if (data.errorCode === 409) {
                                autoLoginOnCheckout(reInitializeCheckout.bind(null, fetchInitialData));
                            } else {
                                if (!services.OrderInfo) {
                                    services.OrderInfo = { queue: [] };
                                }

                                services.OrderInfo.data = data;
                                services.loadEvents.OrderInfoLoaded = true;
                                Sephora.Util.Perf.report('OrderInfo Loaded');
                                window.dispatchEvent(new CustomEvent('OrderInfoLoaded', { detail: {} }));
                            }
                        },
                        fetchInitialData,
                        'order details call unsuccessful after 3 attempts'
                    );
                }
            }
        };
        req.timeout = 10000;
        req.send();
    };

    var getBasketCache = function (currentUser) {
        // Don't use cached basket data if current page is basket page
        return window.location.href.indexOf(`${window.origin}/basket`) > -1
            ? // only if user is anonymous and basket is empty
            !currentUser.isRecognized && !currentUser.hasBasket
                ? getCache(BASKET_CACHE_KEY)
                : null
            : getCache(BASKET_CACHE_KEY);
    };

    Sephora.Util.getBasketCache = getBasketCache;

    /**
     * Retrieve user specific data for the page.  UserInfo and product data may be retrieved.
     * Targeters aer always included
     */
    var fetchInitialData = function (productPageData) {
        var basketCache = getBasketCache(currentUser);
        var includeUserInfo = shouldGetUserFull(basketCache, currentUser, userInfoCache);
        var includeProductPageData = Boolean(productPageData);
        const includeTargetedPromotion = shouldGetTargetedPromotion();
        const includePersonalizedPromotions = true;
        const includeAvailableRRCCoupons = true;
        const includeSmsStatus = true;
        const includeTaxInfo = shouldGetTaxData();
        const forceLinkedAccountDetails = isMyAccount();

        // If available, seed user info cache and basket cache here in case local data is used.
        if (userInfoCache) {
            /* userInfoCache contains a user/full payload, meaning it has the same model of
            localUserData. If the cache exists, then it supersedes the default one declared
            above. */
            localUserData = userInfoCache;
        }

        if (basketCache && !(isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup)) {
            /* basketCache supersedes the userInfoCache.basket cache as the latter is not updated
            when an item is added/removed from basket. */
            localUserData.basket = basketCache;
        }

        var isAccessTokenValid = RefreshToken.isAccessTokenValid();
        var isRefreshTokenValid = RefreshToken.isRefreshTokenValid();
        var AuthTokenReceived = 'AuthTokenReceived';

        var getUserData = function (includeUserData) {
            var fullProfileGroupCookieName = 'rcps_full_profile_group';
            var userDataFromLocalStorage = getItemFromLocalStorage('userData');
            var isRCPSFullProfileGroupAPIEnabled = cookieStore()[fullProfileGroupCookieName] === 'true';
            var dataIsFromCache = !(isRCPSFullProfileGroupAPIEnabled && !userDataFromLocalStorage);

            // do not make user data call if running karma tests it should be mocked
            if (isFromKarmaTest()) {
                return;
            }

            if (!includeUserData) {
                // TODO ILLUPH-106359: need to revisit in scope of here or not localUserData.product
                // is even needed
                // If on product page, can use default user-specific product data
                if (includeProductPageData) {
                    localUserData.product = {
                        usingDefaultUserSpecificData: true,
                        makeUserSpecificProductDetailsCall: true
                    };
                }

                setUserData(localUserData, dataIsFromCache);
            } else {
                // Need user info or targeters or user-specifiuc product page data
                const executeUserFullXhr = () =>
                    makeUserFullXhr(
                        includeUserData,
                        productPageData,
                        includeTargetedPromotion,
                        includePersonalizedPromotions,
                        includeAvailableRRCCoupons,
                        includeSmsStatus,
                        includeTaxInfo,
                        forceLinkedAccountDetails
                    );

                const shouldExecuteXhr =
                    !isRCPSFullProfileGroupAPIEnabled || !Sephora.isNewAuthEnabled || (isRefreshTokenValid && isAccessTokenValid);

                if (shouldExecuteXhr) {
                    executeUserFullXhr();
                } else {
                    window.addEventListener(AuthTokenReceived, executeUserFullXhr);
                }
            }
        };

        if (isCheckout()) {
            window.addEventListener('OrderInfoLoaded', function () {
                getUserData(includeUserInfo);
            });
            fetchInitialDataForCheckout();
        } else {
            getUserData(includeUserInfo);
        }

        // we need to call basket API on a basket page when rcps_full_profile_group cookie is true
        if (window.location.href.indexOf(`${window.origin}/basket`) > -1 && isRCPSFullProfileGroupAPIEnabled && Sephora.enablefullProfileGroup) {
            if (isAccessTokenValid && isRefreshTokenValid) {
                getBasketData();
            } else {
                window.addEventListener(AuthTokenReceived, getBasketData);
            }
        }

        // Pull personalized product page data on load
        if (Sephora.pagePath === 'Product/ProductPage') {
            makePersonalizedProductCallRequest(productPageData.productId, productPageData.skuId);
        }
    };

    Sephora.Util.fetchInitialData = fetchInitialData;

    Sephora.Util.getQueryStringParams = function () {
        var queryString = window.location.search;
        var params = {};

        //Not a global since regexp with 'g' flag will have state
        var queryParamRegexp = /([^?&]+)=([^&]*)/g;

        var result;

        while ((result = queryParamRegexp.exec(queryString))) {
            var key = result[1];
            var value = result[2];

            function decodeURIComponentSafely(uri) {
                try {
                    return decodeURIComponent(uri);
                } catch (e) {
                    return uri;
                }
            }

            var existingValue = params[key];

            if (existingValue) {
                existingValue.push(decodeURIComponentSafely(value));
                params[key] = existingValue;
            } else {
                params[key] = [decodeURIComponentSafely(value)];
            }
        }

        return params;
    };

    Sephora.Util.getConstructorQueryStringParams = function (queryParams) {
        var updatedQueryParams = {};
        Object.keys(queryParams).forEach(function (param) {
            var refStringRegex = /ref=(.*)/g;
            var refParamValues = refStringRegex.exec(param);

            if (refParamValues && refParamValues.length > 1) {
                var refString = refParamValues[1] + '=' + encodeURIComponent(queryParams[param]);
                updatedQueryParams.ref = refString.split(',');
            } else {
                updatedQueryParams[param] = queryParams[param];
            }
        });

        return updatedQueryParams;
    };

    var addRecognizedUserFlag = function () {
        document.documentElement.classList.add('isRecognized');
    };

    if (Sephora.Util.getCurrentUser().isRecognized) {
        addRecognizedUserFlag();
    }

    var hideDefaults = function () {
        document.documentElement.classList.add('hideDefaults');
    };

    var productPageData = getProductPageData();

    if (
        Sephora.productPage &&
        Sephora.productPage.defaultSkuId &&
        productPageData.skuId &&
        Sephora.productPage.defaultSkuId !== productPageData.skuId
    ) {
        hideDefaults();
    }

    /* FETCH INITIAL DATA FOR PAGE */
    // if user is not on checkout and play is in basket, delete play from basket.
    // This scenario (play in basket) can occur on iOS devices when beforeunload
    // handler (attached inside of fetchInitialData) does not work.  Play in
    // basket will prevent user from using site to full advantage, as such need to delete.
    // otherwise, fetch initial data as normal.
    var basket = getCache(BASKET_CACHE_KEY);

    if (!isCheckout() && basket && basket.items && basket.items.length && basket.items[0].sku.type === 'Subscription') {
        // eslint-disable-next-line no-undef
        deletePlaySubscription(basket.orderId, function () {
            window.localStorage.removeItem('lastUfeInitOrderId');
            window.localStorage.removeItem(BASKET_CACHE_KEY);
            window.localStorage.removeItem(USER_CACHE_KEY);
            fetchInitialData(productPageData);
        });
    } else {
        fetchInitialData(productPageData);
    }

    var imagesExpected = 0,
        imagesLoadedCount = 0;
    // Generate "Page Render" performance monitoring
    Sephora.Util.Perf.markPageRender = function (src) {
        var scripts = document.getElementsByTagName('script'),
            currentScript = scripts[scripts.length - 1],
            img = currentScript.previousSibling;

        Sephora.Util.Perf.imageExpectedDedup(src);

        // TODO: add code to check that image is not being lazy loaded. We should not be lazy
        // loading images blocking the Page Rendered event
        if (img.complete) {
            Sephora.Util.Perf.markPageRenderDedup(src, img.currentSrc || img.src);
        } else {
            const imgOnLoad = function (e) {
                // console.log('Native Image Load Triggered');
                const { target = {} } = e;
                Sephora.Util.Perf.markPageRenderDedup(src, target.currentSrc || target.src);
                e.target.removeEventListener('load', imgOnLoad);
            };
            img.addEventListener('load', imgOnLoad);
        }
    };

    // Functions for deduplicating image load events
    var imagesToDedup = {};
    Sephora.Util.Perf.resetImageDedup = function () {
        imagesToDedup = {};
    };
    Sephora.Util.Perf.imageExpectedDedup = function (imageIdentifier) {
        if (imageIdentifier && !imagesToDedup[imageIdentifier]) {
            console.log('IMAGE EXPECTED: ' + imageIdentifier);
            imagesToDedup[imageIdentifier] = {};
            imagesExpected++;
        }
    };

    Sephora.Util.Perf.markPageRenderDedup = function (imageIdentifier, imageSource = '') {
        // When we deal with such markup:
        // <picture>
        //     <source srcSet="urlA x1 urlB x3" />
        //     <img src="urlC" srcSet="urlC x1 urlD x2" />
        // </picture>
        // or just:
        // <img src="urlE" srcSet="urlE x1 urlF x2" />
        // it's impossible to predict during SSR which image will be loaded by browser during client side rendering
        // that is why imageIdentifier was introduced because for the page render report it's important to use
        // the same image identifier always otherwise page render report time will be bigger than it actually was
        if (imageIdentifier && imagesToDedup[imageIdentifier] && !imagesToDedup[imageIdentifier].loaded) {
            console.log(`PAGE RENDER REPORT: Image Loaded ${imageSource} Image Identifier ${imageIdentifier}`);
            imagesLoadedCount++;
            imagesToDedup[imageIdentifier].loaded = true;

            if (imagesLoadedCount === imagesExpected) {
                console.log('PAGE RENDER REPORT: FINAL IMAGE LOADED');
                Sephora.Util.Perf.report('Page Rendered');
            }
        }
    };

    // Akamai mPulse code
    (function () {
        // Ensure we have the BOOMR namespace to work with
        var BOOMR = window.BOOMR || {};
        BOOMR.plugins = BOOMR.plugins || {};

        // holds the beacon until this is true
        var complete = false;

        // create a custom plugin to hold the beacon until we're ready
        BOOMR.plugins.MyCustomPlugin = {
            is_complete: function () {
                return complete;
            }
        };

        var notProdEnv = Sephora.UFE_ENV !== 'PROD';

        window.BOOMR_config = {
            Continuity: {
                enabled: true,
                // ttiWaitForHeroImages: ".hero-image",
                // ttiWaitForFrameworkReady: true,
                monitorLongTasks: true,
                // monitorPageBusy: false,
                // monitorInteractions: false,
                // monitorStats: false,
                monitorFrameRate: true
            }
        };

        const pagePathsWithMpulseTracking = [
            'Category/NthCategory',
            'Brands/BrandNthCategory',
            'ContentStore/RwdContentStore',
            'Basket/RwdBasketpage',
            'Search/Search',
            'Product/ProductPage',
            'Homepage/Homepage'
        ];

        if (pagePathsWithMpulseTracking.indexOf(Sephora.pagePath) !== -1) {
            window.BOOMR_config.autorun = false;
            window.BOOMR_config.History = {
                enabled: true
            };
        }

        if (notProdEnv) {
            // https://developer.akamai.com/tools/boomerang/docs/BOOMR.plugins.ConfigOverride.html
            window.BOOMR_config.instrument_xhr = true;
            // Refer: https://developer.akamai.com/tools/boomerang#enabling-with-config-overrides
            window.BOOMR_config.Errors = {
                enabled: true,
                // monitorGlobal enables the onerror global event handler
                monitorGlobal: true,
                // monitorNetwork enables monitoring XMLHttpRequest responses (Automatically Instrument XHR also needs to be enabled)
                monitorNetwork: true,
                // monitorTimeout enables monitoring setTimeout and setInterval callbacks
                monitorTimeout: true
            };
        }

        // Tell mPulse my framework is ready
        Sephora.Util.onLastLoadEvent(window, 'PostLoadCtrlrsApplied', function () {
            if (BOOMR && BOOMR.plugins) {
                // console.log('mPulse Beacon Fired');
                Sephora.Util.Perf.report('mPulse Beacon Triggered');

                complete = true;

                //trigger the beacon
                if (typeof BOOMR.sendBeacon === 'function') {
                    BOOMR.sendBeacon();
                }
            }
        });
    }());

    // Force update on bfcache
    // https://jira.sephora.com/browse/UTS-2924
    // https://web.dev/bfcache/#ways-to-opt-out-of-bfcache
    // https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    // UTS-3194
    Sephora.adbanners = ['off', 'prod'].includes(cookieStore().adbanners) ? cookieStore().adbanners : undefined;
}());
