import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import AuthActions from 'actions/AuthActions';
import { HEADER_VALUE } from 'constants/authentication';

const authenticationUtils = {};

/*
 * Show the signin modal and apply postponed promo after Login if an apple pay session
 *
 * Note: this is needed only on basket and checkout but needs to be on all ways of logging in on
 * those pages, thus its presence here as a universal decorator
 */
authenticationUtils.showSignInModalWithPromoDecoration = function (
    resolve,
    reject,
    isNewUserFlow = false,
    analyticsData = {},
    source = '',
    showBeautyPreferencesFlow,
    withExtraParams = false,
    headerValue,
    contextOptions = {}
) {
    // Required on the method level bc/ of a circular dependency otherwise.
    const Actions = require('actions/Actions').default;
    const storeLocal = require('store/Store').default;

    const decoratedResolve = function (data) {
        const applePaySession = storeLocal.getState().applePaySession;

        // TODO: Remove isActive ApplePay check when you need to enable it for any signIn
        if (applePaySession.isActive) {
            const promo = storeLocal.getState().promo;

            if (promo.afterLogin && promo.afterLogin.length) {
                import('utils/Promos').then(promoUtils => {
                    promoUtils.default.applyPromo(...promo.afterLogin).then(() => {
                        resolve(data);
                    });
                });
            } else {
                resolve(data);
            }
        } else {
            resolve(data);
        }
    };

    const modalOptions = {
        isOpen: true,
        callback: decoratedResolve,
        isNewUserFlow,
        analyticsData,
        errback: reject,
        source,
        showBeautyPreferencesFlow
    };

    if (withExtraParams) {
        modalOptions.extraParams = { headerValue: '/api/ssi/autoLogin' };
    }

    if (headerValue) {
        modalOptions.extraParams = { headerValue: HEADER_VALUE.USER_CLICK };
    }

    const { guestEventServicesEnabled } = contextOptions;

    if (guestEventServicesEnabled) {
        const {
            potentialServiceBIPoints, onContinueAsAGuest, keepMeSignedIn, storeId, bookingType
        } = contextOptions;

        const updatedExtraParams = Object.assign({}, modalOptions.extraParams, {
            onContinueAsAGuest,
            keepMeSignedIn,
            storeId,
            bookingType
        });
        const updatedModalOptions = Object.assign({}, modalOptions, {
            isGuestBookingEnabled: true,
            potentialServiceBIPoints,
            extraParams: updatedExtraParams
        });

        storeLocal.dispatch(Actions.showSignInWithMessagingModal(updatedModalOptions));
    } else {
        storeLocal.dispatch(Actions.showSignInModal(modalOptions));
    }
};

/**
 * Renders the sign-in / register overlay if needed.  then redirects/calls the desired function
 *
 * Note: only checks for signed in/recognized versus anonymous, does not differentiate between
 * signed in and recognized (API call return status will handle that accordingly)
 *
 * @param {String} redirect        *TODO* Optional: path to redirect,
 *                                  else redirected to same page or home
 * @param {object} objdata         *TODO* Optional: object for storing the temporary data required
 *                                  by functionality which needs
 *                                 to be performed after registration is done
 *                                 objdata format should be : {
 *                                      sActionType : 'Loves',
 *                                      oActionData : {}
 *                                 }
 **/
authenticationUtils.requireAuthentication = function (
    requiredForRecognized = false,
    isNewUserFlow,
    analyticsData,
    source,
    showBeautyPreferencesFlow = false,
    headerValue,
    contextOptions = {}
) {
    return new Promise(function (resolve, reject) {
        import('utils/User').then(userUtils => {
            userUtils.default.validateUserStatus().then(({ auth }) => {
                const profileStatus = auth.profileStatus;
                const PROFILE_STATUS = userUtils.default.PROFILE_STATUS;

                if (
                    profileStatus === PROFILE_STATUS.ANONYMOUS ||
                    (PROFILE_STATUS.RECOGNIZED_STATUSES.includes(profileStatus) && requiredForRecognized)
                ) {
                    authenticationUtils.showSignInModalWithPromoDecoration(
                        resolve,
                        reject,
                        isNewUserFlow,
                        analyticsData,
                        source,
                        showBeautyPreferencesFlow,
                        null,
                        headerValue,
                        contextOptions
                    );
                } else {
                    resolve();
                }
            });
        });
    });
};

// TODO THOMAS 17.4:
//  refactor various files that are using the above requireAuthentication function
//  so that those files use new decorator that calls this promise function
//  files include: ProductQuickLookMessage.c.js, AccountGreeting.c.js, InlineBasket.c.js,
//  ProductLove.c.js, RewardItem.c.js, PleaseSignIn.c.js
authenticationUtils.requireRecognizedAuthentication = function () {
    return new Promise((resolve, reject) => {
        import('utils/User').then(userUtils => {
            userUtils.default.validateUserStatus().then(({ auth }) => {
                var profileStatus = auth.profileStatus;

                if (profileStatus === 0) {
                    authenticationUtils.showSignInModalWithPromoDecoration(resolve, reject);
                } else {
                    resolve();
                }
            });
        });
    });
};

authenticationUtils.requireLoggedInAuthentication = function () {
    const ssiApi = require('services/api/ssi').default;
    const { setupFingerprint } = require('services/Fingerprint').default;

    return new Promise((resolve, reject) => {
        setupFingerprint(deviceFingerprint => {
            import('utils/User').then(userUtils => {
                userUtils.default.validateUserStatus().then(({ auth }) => {
                    var profileStatus = auth.profileStatus;
                    const PROFILE_STATUS = userUtils.default.PROFILE_STATUS;

                    if (profileStatus === PROFILE_STATUS.ANONYMOUS) {
                        authenticationUtils.showSignInModalWithPromoDecoration(resolve, reject);
                    } else if (PROFILE_STATUS.RECOGNIZED_STATUSES.includes(profileStatus)) {
                        if (Sephora.configurationSettings.isOptInSSIMWebEnabled) {
                            ssiApi
                                .autoLogin({ deviceFingerprint })
                                .then(tokensResponse => {
                                    authenticationUtils.updateProfileStatus({
                                        profileSecurityStatus: [tokensResponse.profileSecurityStatus],
                                        accessToken: [tokensResponse.accessToken, tokensResponse.atExp],
                                        refreshToken: [tokensResponse.refreshToken, tokensResponse.rtExp]
                                    });
                                    resolve();
                                })
                                .catch(() => authenticationUtils.showSignInModalWithPromoDecoration(resolve, reject, false, {}, '', false, true));
                        } else {
                            authenticationUtils.showSignInModalWithPromoDecoration(resolve, reject);
                        }
                    } else {
                        resolve();
                    }
                });
            });
        });
    });
};

authenticationUtils.isAuthServiceEnabled = () => {
    const isKillSwitchEnabled = Sephora.configurationSettings?.isAuthServiceEnabled || false;

    return isKillSwitchEnabled;
};

authenticationUtils.isAuthServiceUrl = url => {
    const authServiceUrlRegExp = /(\/api\/auth\/v1\/|\/gway\/v1\/dotcom\/auth\/v1\/)/;

    return authServiceUrlRegExp.test(url);
};

authenticationUtils.storeAuthTokens = ({
    accessToken, refreshToken, email, accessTokenExpiry, refreshTokenExpiry
}) => {
    if (accessToken && refreshToken) {
        Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, accessToken, accessTokenExpiry);
        Storage.local.setItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN, refreshToken, refreshTokenExpiry);

        if (email) {
            Storage.local.setItem(LOCAL_STORAGE.USER_EMAIL, email);
        }
    }
};

authenticationUtils.getFingerPrint = () => {
    return window.FingerprintJS.load().then(function (fp) {
        return fp.get().then(function (result) {
            return result.visitorId;
        });
    });
};

const authenticationTokensMapping = {
    [LOCAL_STORAGE.AUTH_ACCESS_TOKEN]: {
        localStorageName: LOCAL_STORAGE.AUTH_ACCESS_TOKEN
    },
    [LOCAL_STORAGE.AUTH_REFRESH_TOKEN]: {
        localStorageName: LOCAL_STORAGE.AUTH_REFRESH_TOKEN
    },
    [LOCAL_STORAGE.PROFILE_SECURITY_STATUS]: {
        localStorageName: LOCAL_STORAGE.PROFILE_SECURITY_STATUS
    },
    [LOCAL_STORAGE.USER_EMAIL]: {
        localStorageName: LOCAL_STORAGE.USER_EMAIL
    },
    [LOCAL_STORAGE.HAS_IDENTITY]: {
        localStorageName: LOCAL_STORAGE.HAS_IDENTITY
    }
};

authenticationUtils.updateProfileStatus = authData => {
    // Required on the method level bc/ of a circular dependency otherwise.
    import('store/Store').then(({ default: storeLocal }) => {
        const { profileSecurityStatus = null, hasIdentity = null } = authData;

        if (profileSecurityStatus != null) {
            storeLocal.dispatch(AuthActions.updateProfileStatus(profileSecurityStatus[0], false));
        }

        if (hasIdentity != null) {
            storeLocal.dispatch(AuthActions.updateHasIdentity(hasIdentity[0]));
        }
    });

    Object.entries(authData).forEach(([key, value]) => {
        if (authenticationTokensMapping[key]) {
            const [propValue, expiry = null] = value;

            Storage.local.setItem(authenticationTokensMapping[key].localStorageName, propValue, expiry);
        }
    });
};

authenticationUtils.SIGN_IN_SOURCES = {
    ACCOUNT_GREETING: 'account-greeting',
    PAGE_LOAD: 'page-load'
};

authenticationUtils.getHasIdentity = auth => auth.hasIdentity || Storage.local.getItem(LOCAL_STORAGE.HAS_IDENTITY);

export default authenticationUtils;
