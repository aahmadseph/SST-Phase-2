const { Application } = require('utils/framework').default;
const {
    EventType,
    HydrationFinished,
    TestTarget,
    TestTargetLoaded,
    TestTargetReady,
    TestTargetResult,
    UserInfoLoaded,
    VisitorAPILoaded
} = require('constants/events');
const store = require('store/Store').default;
const TestTargetActions = require('actions/TestTargetActions').default;
const InflatorComps = require('utils/framework/InflateComponents').default;
const services = InflatorComps.services;
const TestTargetUtils = require('utils/TestTarget').default;
const shouldServiceRun = require('utils/Services').default.shouldServiceRun;
const cookieUtils = require('utils/Cookies').default;
const userUtils = require('utils/User').default;

// const store = require('store/Store').default;
const watch = require('redux-watch');

const LOCAL_STORAGE = require('utils/localStorage/Constants').default;
const Storage = require('utils/localStorage/Storage').default;

/**
 * Processes test results and stores them in the Store
 */
function processTests(result) {
    store.dispatch(TestTargetActions.setOffers(result));
}

function setNGPUserRegCookie(cookieValue) {
    const { NGP_USERREG } = cookieUtils.KEYS;
    const MAX_AGE_IN_DAYS = 30;

    if (userUtils.isAnonymous()) {
        cookieUtils.write(NGP_USERREG, cookieValue, MAX_AGE_IN_DAYS);
    } else {
        cookieUtils.delete(NGP_USERREG);
    }
}

function setRCPSSlsCookie(cookieValue) {
    const { RCPS_SLS } = cookieUtils.KEYS;
    cookieUtils.write(RCPS_SLS, cookieValue || false);
}

/** Requests T&T tests and applies them
 * @param {Object} targetParams - user/page data sent to T&T, refer to utils/TestTarget.js.
 * @param {Function} callback - optional callback
 */
function getOffer(targetParams, callback) {
    document.addEventListener(adobe.target.event.REQUEST_SUCCEEDED, function handleAdobeTargetResponse(e) {
        digitalData.page.attributes.adobeTargetResponseTokens = e.detail.responseTokens;
        document.removeEventListener(adobe.target.event.REQUEST_SUCCEEDED, handleAdobeTargetResponse);
    });

    adobe.target.getOffer({
        mbox: TestTargetUtils.MBOX_NAME,
        params: targetParams,
        success: response => {
            Application.events.onLastLoadEvent(window, [HydrationFinished], () => {
                try {
                    // TODO: revisit/remove when we migrate to only support JSON offers
                    const totalTests = TestTargetUtils.getTotalDeliveredTests(response);
                    store.dispatch(TestTargetActions.setTotalTests(totalTests));

                    adobe.target.applyOffer({
                        mbox: TestTargetUtils.MBOX_NAME,
                        offer: response
                    });

                    /* Immediately processing sync tests, setup with JSON Offers */
                    if (Array.isArray(response)) {
                        const jsonTests = response.filter(test => test.action === TestTargetUtils.JSON_ACTION);

                        if (jsonTests.length) {
                            jsonTests.forEach(test => {
                                const offers = test.content.reduce(function (result, item) {
                                    Object.keys(item).forEach(key => {
                                        result[key] = item[key];
                                    });

                                    return result;
                                }, {});

                                const ngpUserRegCookieValue = offers.isUserRegistrationNGPEnabled?.show || false;
                                setNGPUserRegCookie(ngpUserRegCookieValue);

                                const rcpsSlsCookie = offers.isSLSABTestEnabled;
                                setRCPSSlsCookie(rcpsSlsCookie);

                                processTests(offers);
                            });
                        } else {
                            store.dispatch(TestTargetActions.setOffers(Sephora.configurationSettings.ABTests || {}));
                        }
                    }
                } catch (e) {
                    console.error(e); // eslint-disable-line no-console
                    store.dispatch(TestTargetActions.cancelOffers(true));
                    setNGPUserRegCookie(false);

                    if (callback) {
                        callback();
                    }
                }
            });
        },
        error: () => {
            setNGPUserRegCookie(false);
            Application.events.onLastLoadEvent(window, [HydrationFinished], () => {
                store.dispatch(TestTargetActions.cancelOffers(true));

                if (callback) {
                    callback();
                }
            });
        },
        timeout: TestTargetUtils.MBOX_TIMEOUT
    });
}

function handleCostumerIds() {
    var ignoreATGDynAndJsessionId = Boolean(Sephora?.configurationSettings?.ignoreATGDynAndJsessionId) || false;
    var ATGIDCookie = document.cookie.split('DYN_USER_ID=')[1];
    var profileId = Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID);
    const isSignedIn = userUtils.isSignedIn();

    // Helper function to set customer IDs
    function setCustomerIds(id, authState = 1) {
        // Set isLoggedIn state
        Sephora.Util.TestTarget.isLoggedIn = !!id;

        const idObject = {
            id,
            authState // Visitor.AuthState.AUTHENTICATED
        };

        Sephora.Util.TestTarget.isLoggedIn = idObject.authState === 1;

        // Don't assume visitor API is available since user might have opted-out
        // Only pass customer id's if id is available AND the user is signed in
        if (typeof visitor !== 'undefined' && id && isSignedIn) {
            visitor.setCustomerIDs({
                customerid: idObject,
                contentid: idObject
            });
        }
    }

    // Handle the logic based on ignoreATGDynAndJsessionId flag
    if (ignoreATGDynAndJsessionId) {
        // Set customer IDs based on profileId if the flag is true
        setCustomerIds(profileId);

        return; // Exit early as we don't need to process ATGIDCookie
    }

    // If the flag is false, process ATGIDCookie
    if (ATGIDCookie) {
        const ATGID = ATGIDCookie.split(';')[0];
        setCustomerIds(ATGID);
    }
}

let testTargetStoreListeners = [];

// eslint-disable-next-line object-curly-newline
function initialize({ doNotResetTestAndTarget, notPreBasket } = {}) {
    handleCostumerIds();

    /* Stop service from loading if not necessary */
    if (!shouldServiceRun.testTarget()) {
        return;
    }

    if (testTargetStoreListeners.length) {
        for (const unsubscribe of testTargetStoreListeners) {
            typeof unsubscribe === 'function' && unsubscribe();
        }

        testTargetStoreListeners = [];
    }

    // T&T service should finish its initialization only when hydration has finished it's work
    // It's required not to mutate store during hydration period because
    // we have to render same HTML markup as it was before after SSR
    Application.events.onLastLoadEvent(window, [HydrationFinished], () => {
        if (!doNotResetTestAndTarget) {
            const ABTests = Sephora.configurationSettings.ABTests || {};
            store.dispatch(TestTargetActions.forceReset(ABTests));
        }

        Application.events.dispatchServiceEvent(TestTarget, 'ServiceReady');
    });

    /* Adobe Test & Target Service
     ** The at.js script is loaded asynchronously and contains the following custom code
     ** which is executed at the end of the script:
     ** 1. window.dispatchEvent(new CustomEvent('TestTargetLoaded', {'detail': {}}));
     ** 2. Sephora.Util.InflatorComps.services.loadEvents.TestTargetLoaded = true;
     */
    const userLocalData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, true);

    /* We check for a localStorage version of sent user target params or user data to avoid relying
     ** on userInfo if unnecessary. If no cache exists then we load user data from the userInfo
     ** service data.
     */
    const skipUserFull = Boolean(userLocalData || !Sephora.Util.TestTarget.isRecognized);

    const serviceDependencies = skipUserFull ? [TestTargetLoaded, VisitorAPILoaded] : [TestTargetLoaded, VisitorAPILoaded, UserInfoLoaded];

    Sephora.Util.TestTarget.waitedForUserFull = !skipUserFull;

    /* Actual service logic */
    Application.events.onLastLoadEvent(window, serviceDependencies, () => {
        let userData = Sephora.Util.TestTarget.isRecognized ? userLocalData || services.UserInfo.data.profile : {};

        // If hydration is finished
        if (Sephora.Util.InflatorComps.services?.loadEvents?.HydrationFinished && Sephora.Util.TestTarget.isRecognized) {
            // And a user has been initialized in the store - use it
            const userFromTheStore = store.getState().user;

            if (userFromTheStore.isInitialized) {
                userData = userFromTheStore;
            }
        }

        TestTargetUtils.setUserParams(userData, notPreBasket).then(targetParams => {
            /* Set TestTargetReady only when amount of dispatched tests matches the
            amount of total tests delivered or there are no tests at all. */

            const testTargetWatcher = watch(store.getState, 'testTarget');
            const offersUnsubscribe = store.subscribe(
                testTargetWatcher(state => {
                    if (state.totalTests === 0 || state.totalTests === state.receivedTests) {
                        Application.events.dispatchServiceEvent(TestTarget, EventType.Ready);
                        offersUnsubscribe();
                    }
                }),
                { ignoreAutoUnsubscribe: true }
            );
            testTargetStoreListeners.push(offersUnsubscribe);

            /* Listener for processing async tests, setup with HTML Offers */
            window.addEventListener(TestTargetResult, data => processTests(data.detail.result));

            getOffer(targetParams, () => Application.events.dispatchServiceEvent(TestTarget, EventType.Ready));
        });
        /* Apply Test&Target offer each time user is updated, but not if said update means
         ** the store is being populated for the first time during page load.
         */

        const userWatch = watch(store.getState, 'user');
        const userUnsubscribe = store.subscribe(
            userWatch((newVal, oldVal) => {
                /* Need to check for beautyInsiderAccount since we need to trigger mbox call
            on any user registration */
                const userChanged = newVal.profileId !== oldVal.profileId || (!oldVal.beautyInsiderAccount && newVal.beautyInsiderAccount);

                if (userChanged && oldVal.isInitialized) {
                    handleCostumerIds();
                    TestTargetUtils.setUserParams(newVal, notPreBasket).then(targetParams => {
                        getOffer(targetParams);
                    });
                }
            }),
            { ignoreAutoUnsubscribe: true }
        );
        testTargetStoreListeners.push(userUnsubscribe);
    });

    window.addEventListener(TestTargetReady, () => {
        Application.events.dispatchServiceEvent(TestTarget, EventType.ServiceCtrlrsApplied, true);
    });
}

module.exports = { initialize };
