/*global AfterPay*/
import LoadScripts from 'utils/LoadScripts';
import localeUtils from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import checkoutApi from 'services/api/checkout';

const LIB_STATES = {
    LOADING: 'loading',
    READY: 'ready'
};

const AFTERPAY_PATH = '/js/ufe/isomorphic/thirdparty/afterpay';

// https://portal.sandbox.afterpay.com/afterpay.js
const AfterpayUtils = {
    LIB_STATE: null,

    getEnvSpecificLibSrc: function () {
        const src = Sephora.UFE_ENV.toLowerCase() === 'prod' ? `${AFTERPAY_PATH}/afterpay.js` : `${AFTERPAY_PATH}/afterpay-s.js`;

        return src;
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
                    [this.getEnvSpecificLibSrc()],
                    () => {
                        this.LIB_STATE = LIB_STATES.READY;
                        this.onLoaded && this.onLoaded();
                    },
                    true
                );
        }
    },

    initPaymentGroup: function () {
        return new Promise((resolve, reject) => {
            checkoutApi
                .initializePaymentGroup({ paymentGroupType: 'AfterpayPaymentGroup' })
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

    initCheckoutWidget: function (elId, amount, errorCallback) {
        const locale = `${localeUtils.getCurrentLanguage().toLowerCase()}-${localeUtils.getCurrentCountry().toUpperCase()}`;
        const currency = localeUtils.isCanada() ? 'CAD' : 'USD';

        return new Promise((resolve, reject) => {
            try {
                this.loadLibrary(() => {
                    window.afterpayWidget = new AfterPay.Widgets.PaymentSchedule({
                        target: `#${elId}`,
                        locale: locale,
                        amount: {
                            amount: amount,
                            currency: currency
                        },
                        onReady: function () {
                            resolve();
                        },
                        onError: function (event) {
                            if (errorCallback) {
                                errorCallback(event);
                            }
                        }
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    updateCheckoutWidget: function (amount) {
        const currency = localeUtils.isCanada() ? 'CAD' : 'USD';

        if (window.afterpayWidget) {
            window.afterpayWidget.update({
                amount: {
                    amount: amount,
                    currency: currency
                }
            });
        }
    },

    showPopup: function () {
        const countryCode = localeUtils.getCurrentCountry().toUpperCase();
        const language = localeUtils.getCurrentLanguage().toLowerCase();
        const locale = `${language}-${countryCode}`;

        return new Promise((resolve, reject) => {
            try {
                this.loadLibrary(() => {
                    AfterPay.initialize({ countryCode: countryCode });
                    AfterPay.open();
                    checkoutApi
                        .initializePaymentMethod()
                        .then(data => {
                            AfterPay.transfer({
                                token: data.token,
                                consumerLocale: locale
                            });
                        })
                        .catch(error => {
                            AfterPay.close();
                            reject(error);
                        });
                    AfterPay.onComplete = function (event) {
                        resolve(event.data);
                    };
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};

export default AfterpayUtils;
