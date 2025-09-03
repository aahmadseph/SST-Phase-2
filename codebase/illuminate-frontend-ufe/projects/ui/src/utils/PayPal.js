import store from 'store/Store';
import basketUtils from 'utils/Basket';
import orderUtils from 'utils/Order';
import ErrorsUtils from 'utils/Errors';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import checkoutApi from 'services/api/checkout';
import locationUtils from 'utils/Location';

let paypalIntegration;
let paypalToken;
let isTokenRequestInProgress;

const TYPES = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
    HIDDEN: 'HIDDEN'
};

const PayPal = {
    TYPES,

    getPayPalPaymentType: function (isBopis) {
        const basketData = store.getState().basket;
        const basket = isBopis ? basketData.pickupBasket : basketData;
        const shippingCountry = userUtils.getShippingCountry().countryCode;
        const isShowPayPal =
            basket.isPaypalPaymentEnabled &&
            (Sephora.isMobile() || shippingCountry === localeUtils.COUNTRIES.US || shippingCountry === localeUtils.COUNTRIES.CA);

        if (isShowPayPal) {
            return basketUtils.isPaypalRestricted(isBopis) ? TYPES.DISABLED : TYPES.ENABLED;
        } else {
            return TYPES.DISABLED;
        }
    },

    preparePaypalCheckout: async function () {
        if (!paypalToken) {
            if (!isTokenRequestInProgress) {
                try {
                    isTokenRequestInProgress = true;
                    const data = await checkoutApi.getPayPalToken();
                    PayPal.paypalSetup(data.token).then(() => {
                        isTokenRequestInProgress = false;
                    });
                } catch (errorData) {
                    ErrorsUtils.collectAndValidateBackEndErrors(errorData);
                    isTokenRequestInProgress = false;
                }
            } else {
                PayPal.paypalSetup(paypalToken);
            }
        }
    },

    /**
     * Keep this function as plain as possible!
     * No promises, callback chains -> any of this logic could be treated as a
     * suspicious behavior and browser will block the new window with PayPal
     * Explanation of the issue:
     * http://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers
     * @param callback
     */
    showPayPal: function (callback) {
        const isPickupOrder = basketUtils.isPickup();
        const amountWithCurrency = locationUtils.isCheckout()
            ? orderUtils.getPayPalAmount() || orderUtils.getCreditCardTotal()
            : basketUtils.getSubtotal(true, isPickupOrder);
        const amount = amountWithCurrency ? Number(basketUtils.removeCurrency(amountWithCurrency)) : 0;

        const { payPalnonVaulting = false } = Sephora.configurationSettings;

        // Because PayPal tokenization opens a popup, this must be called
        // as a result of a user action, such as a button click.
        paypalIntegration.tokenize(
            {
                flow: payPalnonVaulting ? 'checkout' : 'vault',
                billingAgreementDescription: 'Estimated Total: ' + amountWithCurrency,
                container: 'paypal-container',
                singleUse: false,
                amount: amount,
                currency: localeUtils.isCanada() ? 'CAD' : 'USD',
                enableShippingAddress: true,
                enableBillingAddress: true,
                headless: true,
                ...(payPalnonVaulting && { 'enable-funding': 'paylater' }),
                ...(isPickupOrder && { shippingAddressOverride: basketUtils.shippingAddressOverride() })
            },
            (tokenizeErr, payload) => {
                if (tokenizeErr) {
                    switch (tokenizeErr.code) {
                        case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
                            // eslint-disable-next-line no-console
                            console.error('PayPal tokenization failed. See details:', tokenizeErr.details);

                            break;
                        case 'PAYPAL_FLOW_FAILED':
                            // eslint-disable-next-line no-console
                            console.error('Unable to initialize PayPal flow. Are your options correct?', tokenizeErr.details);

                            break;
                        default:
                            // eslint-disable-next-line no-console
                            console.error('Error!', tokenizeErr);
                    }
                } else {
                    if (typeof callback === 'function') {
                        callback(payload);
                    }
                }
            }
        );
    },

    paypalSetup: async function (clientToken) {
        paypalToken = clientToken;
        const client = await import(/* webpackChunkName: "priority" */ 'BraintreeClient');
        client.create({ authorization: clientToken }, (clientErr, clientInstance) => {
            if (clientErr) {
                // eslint-disable-next-line no-console
                console.error('Error creating Braintree Client:', clientErr);

                return;
            }

            import(/* webpackChunkName: "priority" */ 'BraintreePayPal').then(braintreePayPal => {
                braintreePayPal.create({ client: clientInstance }, (paypalErr, paypalInstance) => {
                    if (paypalErr) {
                        // eslint-disable-next-line no-console
                        console.error('Error creating Braintree PayPal:', paypalErr);

                        return;
                    }

                    paypalIntegration = paypalInstance;
                });
            });
        });
    }
};

export default PayPal;
