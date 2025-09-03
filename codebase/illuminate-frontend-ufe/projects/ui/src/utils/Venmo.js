import basketUtils from 'utils/Basket';
import orderUtils from 'utils/Order';
import ErrorsUtils from 'utils/Errors';
import localeUtils from 'utils/LanguageLocale';
import checkoutApi from 'services/api/checkout';
import locationUtils from 'utils/Location';
import store from 'store/Store';
import VenmoActions from 'actions/VenmoActions';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import checkoutUtils from 'utils/Checkout';
import VenmoBindings from 'analytics/bindingMethods/pages/checkout/VenmoBindings';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { VENMO_FLOW, VENMO_STARTED } = LOCAL_STORAGE;

let venmoIntegration;
let venmoToken;
let tokenPromise = null;

const TYPES = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
    HIDDEN: 'HIDDEN'
};

const getText = localeUtils.getLocaleResourceFile('components/RwdCheckout/RwdCheckoutMain/locales', 'RwdCheckoutMain');

const Venmo = {
    TYPES,

    fetchAndSetupVenmoToken: async function () {
        try {
            const { token } = await checkoutApi.getVenmoToken();
            venmoToken = token;
            await Venmo.venmoSetup({ clientToken: token });
            store.dispatch(VenmoActions.setReady(true));
        } catch (errorData) {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData);
            throw errorData;
        } finally {
            tokenPromise = null;
        }
    },

    prepareVenmoCheckout: function () {
        // If we already have a token, we're done
        if (venmoToken) {
            return;
        }

        if (!tokenPromise) {
            tokenPromise = Venmo.fetchAndSetupVenmoToken();
        }
    },

    // Save if the user has started the Venmo flow, so that we can continue
    // the flow after the page is reloaded after venmo authentication
    saveVenmoStarted: function () {
        Storage.local.setItem(VENMO_STARTED, true);
    },

    clearVenmoStarted: function () {
        Storage.local.removeItem(VENMO_STARTED);
    },

    isVenmoStarted: function () {
        return Storage.local.getItem(VENMO_STARTED) === true;
    },

    // Save if the user has started the Venmo express flow (in basket page), so that
    // we can continue the flow in checkout page
    saveVenmoExpressFlow: function () {
        Storage.local.setItem(VENMO_FLOW, true);
    },

    clearVenmoExpressFlow: function () {
        Storage.local.removeItem(VENMO_FLOW);
    },

    isVenmoExpressFlow: function () {
        return Storage.local.getItem(VENMO_FLOW) === true;
    },
    // For mobile users when the user lands on checkout page, we need
    // to check if the user is just landing on the page or if the page
    // has been reloaded after loading Venmo auth in the same page
    onCheckoutReload: async function ({ defaultPayment, callback }) {
        if (Venmo.isVenmoStarted()) {
            const { token } = await checkoutApi.getVenmoToken();
            await Venmo.venmoSetup({ clientToken: token });

            // Even if we create venmoIntegration again after reload, it still
            // has previous tokenization because Venmo stores it in localStorage
            if (venmoIntegration?.hasTokenizationResult()) {
                // If we're reloading checkout after Venmo auth, the call
                // to tokenizeVenmo will return the payload from the previous
                // tokenization, instead of opening the Venmo auth window again
                Venmo.saveVenmoStarted();
                const payload = await Venmo.tokenizeVenmo();

                Venmo.checkoutWithTokenizedVenmo({
                    defaultPayment,
                    callback,
                    payload
                });
            }
        }
    },

    checkoutWithTokenizedVenmo: async function ({ defaultPayment, callback, payload }) {
        try {
            store.dispatch(Actions.showInterstice(true));
            await checkoutApi.initializeVenmoCheckout(payload);
            const placeOrderPayload = {
                originOfOrder: 'web'
            };

            if (defaultPayment) {
                placeOrderPayload.defaultPayment = defaultPayment;
            }

            Venmo.clearVenmoStarted();
            const submittedDetails = await checkoutApi.placeOrder(placeOrderPayload);
            callback(submittedDetails);
        } catch (error) {
            store.dispatch(Actions.showInterstice(false));
            Sephora.logger.error('Failed to initialize Venmo checkout:', error);

            if (error?.code) {
                Venmo.displayVenmoErrors(error);
            } else {
                Venmo.displayCartAndServiceErrors(error);
            }
        }
    },

    checkoutWithVenmo: async function ({ defaultPayment, callback }) {
        VenmoBindings.placeOrderClick({ defaultPayment });
        Venmo.saveVenmoStarted();
        const payload = await Venmo.tokenizeVenmo();
        await Venmo.checkoutWithTokenizedVenmo({ defaultPayment, callback, payload });
    },

    displayVenmoErrors: function (error) {
        const genericErrorMessage = getText('authorizeErrorMessage', ['Venmo']);

        VenmoBindings.modalError({ error, genericErrorMessage });

        switch (error.code) {
            // TODO VENMO: These two cases are the same for now, but we'll be adding more
            // specific errors later
            case 'FRAME_SERVICE_FRAME_CLOSED':
                store.dispatch(VenmoActions.showInlineError(genericErrorMessage));

                break;
            default:
                store.dispatch(VenmoActions.showInlineError(genericErrorMessage));

                break;
        }
    },

    displayCartAndServiceErrors: function (error) {
        const genericErrorMessage = getText('cartServiceError', ['Venmo']);
        const title = getText('error');
        const buttonText = getText('ok');

        VenmoBindings.modalError({ error, genericErrorMessage });

        switch (error.key) {
            // TODO VENMO: These two cases are the same for now, but we'll be adding more
            // specific errors later
            case 'checkout.cc.auth.generic.error':
                store.dispatch(VenmoActions.showModalError(genericErrorMessage, title, buttonText));

                break;

            default:
                store.dispatch(VenmoActions.showModalError(genericErrorMessage, title, buttonText));

                break;
        }
    },

    /**
     * Keep this function as plain as possible!
     * No promises, callback chains -> any of this logic could be treated as a
     * suspicious behavior and browser will block the new window with Venmo
     * Explanation of the issue:
     * http://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers
     * @param callback
     */
    tokenizeVenmo: async function () {
        const isPickupOrder = basketUtils.isPickup();
        const amountWithCurrency = locationUtils.isCheckout()
            ? orderUtils.getPayPalAmount() || orderUtils.getCreditCardTotal()
            : basketUtils.getSubtotal(true, isPickupOrder);
        const amount = amountWithCurrency ? Number(basketUtils.removeCurrency(amountWithCurrency)) : 0;

        // Because Venmo tokenization opens a popup, this must be called
        // as a result of a user action, such as a button click.
        try {
            // https://braintree.github.io/braintree-web/current/Venmo.html#tokenize
            const payload = await venmoIntegration.tokenize({
                flow: 'checkout',
                billingAgreementDescription: 'Estimated Total: ' + amountWithCurrency,
                container: 'venmo-container',
                singleUse: false,
                amount: amount,
                currency: localeUtils.isCanada() ? 'CAD' : 'USD',
                enableShippingAddress: true,
                enableBillingAddress: true,
                headless: true,
                ...(isPickupOrder && { shippingAddressOverride: basketUtils.shippingAddressOverride() })
            });

            return payload;
        } catch (err) {
            Sephora.logger.error('Venmo tokenization failed:', err);
            throw err;
        }
    },

    // For mobile users when the user lands on checkout page, we need
    // to check if the user is just landing on the page or if the page
    // has been reloaded after loading Venmo auth in the same page
    onBasketReload: async function ({ isBopis }) {
        if (Venmo.isVenmoStarted()) {
            store.dispatch(Actions.showInterstice(true));

            const { token } = await checkoutApi.getVenmoToken();
            await Venmo.venmoSetup({ clientToken: token });

            if (venmoIntegration?.hasTokenizationResult()) {
                const payload = await Venmo.tokenizeVenmo();
                await checkoutApi.initializeVenmoCheckout(payload);
            }

            await Venmo.goToCheckoutPage({ isBopis });
        } else {
            Venmo.prepareVenmoCheckout();
        }
    },

    triggerExpressCheckout: async function ({ isBopis }) {
        try {
            store.dispatch(Actions.showInterstice(true));
            Venmo.saveVenmoExpressFlow();
            Venmo.saveVenmoStarted();
            const payload = await Venmo.tokenizeVenmo();
            await checkoutApi.initializeVenmoCheckout(payload);
            Venmo.goToCheckoutPage({ isBopis });
        } catch (error) {
            store.dispatch(Actions.showInterstice(false));
            Venmo.clearVenmoExpressFlow();
            Venmo.displayCartAndServiceErrors(error);
            Sephora.logger.error('Failed to initialize Venmo checkout:', error);
        }
    },

    goToCheckoutPage: async function ({ isBopis }) {
        return checkoutUtils
            .initializeCheckout({
                isVenmoFlow: true,
                ropisCheckout: isBopis
            })
            .then(() => {
                Venmo.clearVenmoStarted();
                checkoutUtils.initOrderSuccess(true, isBopis);
            })
            .catch(err => {
                Venmo.clearVenmoStarted();
                Venmo.clearVenmoExpressFlow();
                checkoutUtils.initOrderFailure(err);
            });
    },

    braintreeCreateSuccessCallback: async function ({ clientInstance }) {
        const braintreeVenmo = await import(/* webpackChunkName: "priority" */ 'BraintreeVenmo');

        // https://braintree.github.io/braintree-web/current/module-braintree-web_venmo.html#.create
        try {
            const venmoInstance = await braintreeVenmo.create({
                client: clientInstance,
                useRedirectForIOS: false,
                requireManualReturn: false,
                allowDesktopWebLogin: true,
                mobileWebFallBack: true,
                paymentMethodUsage: 'single_use',
                allowNewBrowserTab: false
            });
            venmoIntegration = venmoInstance;
        } catch (err) {
            Sephora.logger.error('Error creating Braintree Venmo:', err);
        }
    },

    initializeVenmoCheckout: function () {
        if (Venmo.isVenmoExpressFlow()) {
            store.dispatch(OrderActions.togglePlaceOrderDisabled(false));
            this.prepareVenmoCheckout();

            return;
        }

        decorators
            .withInterstice(
                checkoutApi.initializePaymentGroup,
                INTERSTICE_DELAY_MS
            )({ paymentGroupType: 'VenmoPaymentGroup' })
            .then(() => {
                checkoutApi.getOrderDetails(orderUtils.getOrderId()).then(order => {
                    store.dispatch(OrderActions.updateOrder(order));
                    // For Afterpay, Klarna, and Paze:
                    // - When the payment group is initialized, it returns isComplete: true.
                    // - The subsequent Order Details API call also includes header.isComplete: true.
                    // - This enables the Place Order button.
                    //
                    // PayPal behaves differently:
                    // - As soon as the user clicks the radio button, the PayPal window opens
                    //   (so no need to enable the Place Order button).
                    // - When the payment group is initialized, it returns isComplete: false.
                    //
                    // Venmo is a special case:
                    // - The user experience is similar to Afterpay/Klarna/Paze,
                    // - But the API behaves like PayPal (returning isComplete: false
                    //   even though it should be true for consistency), so we have to enable
                    //   the Place Order button manually.
                    store.dispatch(OrderActions.togglePlaceOrderDisabled(false));
                    this.prepareVenmoCheckout();
                });
            })
            .catch(err => {
                store.dispatch(Actions.showInterstice(false));
                Sephora.logger.error(err);
            });
    },

    venmoSetup: async function ({ clientToken }) {
        const client = await import(/* webpackChunkName: "components" */ 'BraintreeClient');

        // https://braintree.github.io/braintree-web/current/module-braintree-web_client.html#.create
        try {
            const clientInstance = await client.create({ authorization: clientToken });
            await Venmo.braintreeCreateSuccessCallback({ clientInstance });
        } catch (clientErr) {
            Sephora.logger.error('Error creating Braintree Client:', clientErr);
        }
    }
};

export default Venmo;
