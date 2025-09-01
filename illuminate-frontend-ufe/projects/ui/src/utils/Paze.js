import OrderUtils from 'utils/Order';
import checkoutApi from 'services/api/checkout';
import LoadScripts from 'utils/LoadScripts';
import UUIDv4 from 'utils/UUID';
import cookieUtils from 'utils/Cookies';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

// Needed for PAY-3259 (analytics)
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const LIB_STATES = {
    LOADING: 'loading',
    READY: 'ready'
};

const PAZE_OPTIONS = {
    START_FLOW: 'START_FLOW',
    NO_PREFERENCE: 'NONE',
    EXPRESS_CHECKOUT: 'EXPRESS_CHECKOUT'
};

const PazeUtils = {
    digitalWalletAdaptor: null,

    // Check if Paze should be shown based on configuration flags
    isPazeVisible: () => {
        const isRCPSCCEnabled = cookieUtils.isRCPSCCEnabled();
        const canCheckoutPaze = Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);
        const { globalPazeOptionEnabled, globalUSPazeOptionEnabled, globalCAPazeOptionEnabled } = Sephora.configurationSettings;

        return (
            globalPazeOptionEnabled &&
            isRCPSCCEnabled &&
            canCheckoutPaze &&
            ((localeUtils.isUS() && globalUSPazeOptionEnabled) || (localeUtils.isCanada() && globalCAPazeOptionEnabled))
        );
    },

    isPazeEnabled: () => {
        const { globalPazeOptionEnabled, globalUSPazeOptionEnabled, globalCAPazeOptionEnabled } = Sephora.configurationSettings;

        return (
            globalPazeOptionEnabled && ((localeUtils.isUS() && globalUSPazeOptionEnabled) || (localeUtils.isCanada() && globalCAPazeOptionEnabled))
        );
    },

    getUserEmail: function () {
        const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA) || {};

        return userData?.profile?.login || '';
    },

    // Make sure we have only one instance of digital wallet adaptor
    getDigitalWalletAdaptor: function () {
        if (!this.digitalWalletAdaptor) {
            this.digitalWalletAdaptor = window.DIGITAL_WALLET_SDK;
        }

        return this.digitalWalletAdaptor;
    },

    initPaymentGroup: function () {
        return new Promise((resolve, reject) => {
            checkoutApi
                .initializePaymentGroup({ paymentGroupType: 'PazePaymentGroup' })
                .then(() => {
                    checkoutApi
                        .getOrderDetails(OrderUtils.getOrderId())
                        .then(order => {
                            resolve(order);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    onLibraryLoad: function (resolve, reject) {
        this.digitalWalletAdaptor = this.getDigitalWalletAdaptor();
        const { PazeClientID, PazeClientName, PazeProfileId } = Sephora.configurationSettings;

        this.digitalWalletAdaptor
            .initialize({
                client: {
                    id: PazeClientID,
                    name: PazeClientName,
                    profileId: PazeProfileId
                }
            })
            .then(() => {
                // TODO PAZE: Remove console.log and add initialization logic
                // eslint-disable-next-line no-console
                console.log('Digital Wallet SDK initialized');
                resolve();
            })
            .catch(error => {
                // If there's any error, it comes from Paze initialization
                // eslint-disable-next-line no-console
                console.log(error);
                reject(error);
            });
    },

    initCheckoutWidget: function () {
        return new Promise((resolve, reject) => {
            try {
                this.loadLibrary(() => this.onLibraryLoad(resolve, reject));
            } catch (error) {
                reject(error);
            }
        });
    },

    // If Paze is set to be dynamic, before showing it to the user, we must check whether
    // the user can checkout
    initDynamicPaze: function ({ email }) {
        return this.initCheckoutWidget()
            .then(
                // onLibraryLoad is finished here
                () => this.canCheckout({ email })
            )
            .then(canCheckoutResult => {
                return canCheckoutResult;
            });
    },

    loadLibrary: function (onLoaded) {
        switch (this.LIB_STATE) {
            case LIB_STATES.READY:
                onLoaded && onLoaded();

                break;
            case LIB_STATES.LOADING:
                // loading in progress, replace current callback with the new one
                this.onLoaded = onLoaded;

                break;
            default:
                // loading has not been started yet
                this.LIB_STATE = LIB_STATES.LOADING;
                this.onLoaded = onLoaded;
                LoadScripts.loadScripts(
                    [Sephora.configurationSettings.pazeLibrary],
                    () => {
                        this.LIB_STATE = LIB_STATES.READY;
                        this.onLoaded && this.onLoaded();
                    },
                    true
                );
        }
    },

    logPazeError: function ({ error, type }) {
        // Log reason for incomplete checkout
        let result = '';

        // Convert the whole object to a string with comma separated values as
        // expected by analytics
        for (const [key, value] of Object.entries(error)) {
            result += `${key}:${value};`;
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                fieldErrors: `paze-internal-${type}`,
                errorMessages: result.slice(0, -1)
            }
        });
    },

    showPopup: function ({ transactionAmount }) {
        const guid = UUIDv4();
        const transactionValue = {
            transactionAmount,
            // USD is the only supported currency for now
            transactionCurrencyCode: 'USD'
        };

        // Paze specific options
        const transactionOptions = {
            billingPreference: 'ALL',
            merchantCategoryCode: 'US',
            payloadTypeIndicator: 'PAYMENT'
        };

        const pazeResponse = { paze: {} };

        return this.startCheckout({ guid, transactionValue })
            .then(response => {
                pazeResponse.paze.checkoutResponse = response?.checkoutResponse;

                // Only proceed to completeCheckout if startCheckout was successful
                return this.completeCheckout({ guid, transactionValue, transactionOptions }).then(completeCheckoutData => {
                    pazeResponse.paze.completeResponse = completeCheckoutData?.completeResponse;

                    return pazeResponse;
                });
            })
            .catch(error => {
                return Promise.reject(error);
            });
    },

    isPazeDynamic: function () {
        return Sephora.configurationSettings.isPazeDynamic;
    },

    canCheckout: function ({ email }) {
        return this.isPazeDynamic() ? this.digitalWalletAdaptor.canCheckout({ emailAddress: email }) : true;
    },

    startCheckout: function ({ guid, transactionValue }) {
        const emailAddress = this.getUserEmail();

        const { START_FLOW: actionCode, EXPRESS_CHECKOUT: intent, NO_PREFERENCE: shippingPreference } = PAZE_OPTIONS;

        return this.digitalWalletAdaptor.checkout({
            acceptedPaymentCardNetworks: ['VISA', 'MASTERCARD'],
            ...(this.isPazeDynamic() && { emailAddress }),
            sessionId: guid,
            actionCode,
            transactionValue,
            shippingPreference,
            intent
        });
    },

    completeCheckout: function ({ guid, transactionValue, transactionOptions }) {
        const emailAddress = this.getUserEmail();

        return this.digitalWalletAdaptor.complete({
            transactionOptions,
            ...(this.isPazeDynamic() && { emailAddress }),
            sessionId: guid,
            transactionType: 'PURCHASE',
            transactionValue
        });
    }
};

export default PazeUtils;
