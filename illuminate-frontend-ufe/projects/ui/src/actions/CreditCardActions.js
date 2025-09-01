import getRealtimePreScreenDetails from 'services/api/profile/getRealtimePreScreenDetails';
import profileApi from 'services/api/profile/index';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import userUtils from 'utils/User';
import UtilActions from 'utils/redux/Actions';
import localStorageConstants from 'utils/localStorage/Constants';
import updateBiAccount from 'services/api/beautyInsider/updateBiAccount';
import prescreenCustomerResponse from 'services/api/profile/prescreenCustomerResponse';
import creditCard from 'reducers/creditCard';
import RCPSCookies from 'utils/RCPSCookies';
import getRealtimePrescreenDetailsSDN from '../services/api/profile/getRealtimePrescreenDetailsSDN';

const { ACTION_TYPES } = creditCard;

const { CREDIT_CARD_REALTIME_PRESCREEN, CREDIT_CARD_TARGETERS } = localStorageConstants;
const { StorageTypes } = Storage;
const REALTIME_PRESCREEN_CONFIG = {
    INTERVAL_IN_SECONDS: 30,
    MAX_COUNT: 3,
    FIRST_CALL: 1
};

// 10 minutes cache
const CREDIT_CARD_TARGETERS_CACHE_TIME = 1000 * 60 * 10;
const config = {
    cache: {
        key: CREDIT_CARD_TARGETERS,
        expiry: CREDIT_CARD_TARGETERS_CACHE_TIME,
        storageType: StorageTypes.IndexedDB
    }
};

const CC_BASKET_TARGETER = '/atg/registry/RepositoryTargeters/Sephora/CCDynamicMessagingBasketTargeter';
const CC_INLINE_BASKET_TARGETER = '/atg/registry/RepositoryTargeters/Sephora/CCDynamicMessagingInlineBasketTargeter';
const CC_CHECKOUT_TARGETER = '/atg/registry/RepositoryTargeters/Sephora/CCDynamicMessagingCheckoutTargeter';
const targeters = [CC_BASKET_TARGETER, CC_INLINE_BASKET_TARGETER, CC_CHECKOUT_TARGETER];

const creditCardActions = {
    handleRealtimePrescreen: function (loyaltyId, ccAccountandPrescreenInfo) {
        if (localeUtils.isUS()) {
            const storage = Storage.local.getItem(CREDIT_CARD_REALTIME_PRESCREEN);

            if (!storage) {
                // If there is no storage yet, attempt to initiate the process

                // If realTimePrescreenInProgress is true,
                // initiate the process by setting inProgress as true
                if (ccAccountandPrescreenInfo && ccAccountandPrescreenInfo?.realTimePrescreenInProgress === true) {
                    creditCardActions.updateStorage(CREDIT_CARD_REALTIME_PRESCREEN, {
                        count: 0,
                        inProgress: true
                    });

                    if (RCPSCookies.isRCPSCCAP()) {
                        creditCardActions.makeRealtimePrescreenCall(loyaltyId, REALTIME_PRESCREEN_CONFIG.FIRST_CALL);
                    }
                }
            } else {
                // If there is storage, proceed to Lightweight API calls

                // If there is a user response already, or if it's no longer in progress, or if we have a cardType
                // stop making new calls
                if (RCPSCookies.isRCPSCCAP() && storage.response?.cardType) {
                    return;
                }

                if (!RCPSCookies.isRCPSCCAP() && (storage.userResponse || !storage.inProgress)) {
                    return;
                }

                // If this is not the first call, verify if its counts is under MAX_COUNT
                // and if it's been at least INTERVAL_IN_SECONDS interval since the last call
                if (storage.count > 0) {
                    const now = Date.now();
                    const secondsDiff = Math.floor(Math.abs(now - storage.timestamp) / 1000);

                    if (storage.count >= REALTIME_PRESCREEN_CONFIG.MAX_COUNT || secondsDiff < REALTIME_PRESCREEN_CONFIG.INTERVAL_IN_SECONDS) {
                        return;
                    }
                }

                // Else, make the Lightweight API call
                // Recap: to get here, we need the following conditions to be true:
                // 1. storage !== undefined
                // 2. storage.userResponse === undefined
                // 3. storage.inProgress === true
                // 4. storage.count < MAX_COUNT
                // 5. secondsDiff >= INTERVAL_IN_SECONDS
                creditCardActions.makeRealtimePrescreenCall(loyaltyId, storage.count + 1);
            }
        }
    },

    updateStorage: function (key, data) {
        const storage = Object.assign({}, Storage.local.getItem(key), data);
        Storage.local.setItem(key, storage, userUtils.USER_DATA_EXPIRY);
    },

    makeRealtimePrescreenCall: function (loyaltyId, count) {
        // Makes the LightWeight API call
        const apiCall = RCPSCookies.isRCPSCCAP() ? getRealtimePrescreenDetailsSDN : getRealtimePreScreenDetails;

        return apiCall(loyaltyId)
            .then((response = {}) => {
                // inProgress is true while preScreenProcessStatus is 'In Progress'
                const inProgress = response.preScreenProcessStatus && response.preScreenProcessStatus.toLowerCase() === 'in progress';

                creditCardActions.updateLightweightCallDetails({
                    count,
                    inProgress,
                    response
                });
            })
            .catch(() => creditCardActions.updateLightweightCallDetails({ count }));
    },

    updateLightweightCallDetails: function (data = {}) {
        const storage = {
            timestamp: Date.now(),
            ...data
        };

        creditCardActions.updateStorage(CREDIT_CARD_REALTIME_PRESCREEN, storage);
    },

    captureRealtimePrescreenUserResponse: function (userResponse) {
        const profileData = {
            profileId: userUtils.getProfileId(),
            biAccount: { prescreenCustomerResponse: userResponse }
        };

        return updateBiAccount(profileData).then(response => {
            let promise;

            if (response.responseStatus === 200) {
                creditCardActions.updateStorage(CREDIT_CARD_REALTIME_PRESCREEN, { userResponse });
                promise = Promise.resolve(response);
            } else {
                promise = Promise.reject(response);
            }

            return promise;
        });
    },

    realtimePrescreenUserResponse: function (userResponse) {
        const biAccount = userUtils.getBiAccountInfo();

        return prescreenCustomerResponse(biAccount?.biAccountId, userResponse).then(response => {
            let promise;

            if (response.responseStatus === 200) {
                creditCardActions.updateStorage(CREDIT_CARD_REALTIME_PRESCREEN, { userResponse });
                promise = Promise.resolve(response);
            } else {
                promise = Promise.reject(response);
            }

            return promise;
        });
    },

    getCreditCardTargeters: function (force = false) {
        return dispatch => {
            if (Sephora.configurationSettings?.isTargetersATGSunset) {
                return Promise.resolve();
            }

            return profileApi.getTargetersContent(targeters, { ...config, cache: { ...config.cache, invalidate: force } }).then(response => {
                if (response.responseStatus === 200 && response.targeterResult) {
                    const ccTargeters = {
                        CCDynamicMessagingBasketTargeter: response.targeterResult[CC_BASKET_TARGETER],
                        CCDynamicMessagingInlineBasketTargeter: response.targeterResult[CC_INLINE_BASKET_TARGETER],
                        CCDynamicMessagingCheckoutTargeter: response.targeterResult[CC_CHECKOUT_TARGETER]
                    };

                    return dispatch(UtilActions.merge('creditCard', 'ccTargeters', ccTargeters));
                } else {
                    return dispatch(UtilActions.merge('creditCard', 'ccTargeters', {}));
                }
            });
        };
    },

    updateCCBanner: function (ccBanner) {
        return {
            type: ACTION_TYPES.UPDATE_CC_BANNER,
            ccBanner
        };
    }
};

export default creditCardActions;
