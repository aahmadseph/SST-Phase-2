/*global ApplePaySession*/
/* eslint-disable no-console */
import store from 'store/Store';
import watch from 'redux-watch';
import orderActions from 'actions/OrderActions';
import addToBasketActions from 'actions/AddToBasketActions';
import checkoutUtils from 'utils/Checkout';
import helperUtils from 'utils/Helpers';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import orderUtils from 'utils/Order';
import Location from 'utils/Location';
import uIUtils from 'utils/UI';
import utilityApi from 'services/api/utility';
import checkoutApi from 'services/api/checkout';
import Actions from 'Actions';
import Flush from 'utils/localStorage/Flush';
import UtilActions from 'utils/redux/Actions';
import OrderActions from 'actions/OrderActions';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import UI from 'utils/UI';

const { getErrorStatesFromSubmitOrderAPI } = FrictionlessUtils;

const ApplePayCountry = {
    CA: localeUtils.COUNTRIES.CA.toLowerCase(),
    US: localeUtils.COUNTRIES.US.toLowerCase()
};

const TYPES = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
    HIDDEN: 'HIDDEN'
};

const CCARD_TYPES = ['amex', 'visa', 'masterCard', 'privateLabel'];

const CCARD_TYPES_US = ['discover'].concat(CCARD_TYPES);

const AMOUNT_TYPE = {
    FINAL: 'final',
    PENDING: 'pending'
};

const SESSION_STATES = {
    INITIATED: 'initiated',
    STARTED: 'started',
    TERMINATED: 'terminated'
};

const ERROR_CODES = { INVALID_ADDRESS_ERROR: -10170 };
const merchantIdentifier = Sephora.configurationSettings.applePayMerchantIdentifier;
const SESSION_ABORT_TIMEOUT = 2000;
const SESSION_SUCCESS_TIMEOUT = 2000;

export default (function () {
    const sessionStateKey = Symbol('session_state');
    let orderDetails;
    let shippingMethods;
    let mergeBasketError;
    let session;
    let currentShippingMethodId;
    let savedAddress;
    let isGuestCheckoutFlow = false;

    function isBopisOrder() {
        return orderDetails?.header?.isBopisOrder || !basketUtils.isDCBasket();
    }

    function startSession(currentSession) {
        if (currentSession[sessionStateKey] !== SESSION_STATES.STARTED) {
            currentSession.begin();
            currentSession[sessionStateKey] = SESSION_STATES.STARTED;
        }
    }

    function abortSession(currentSession) {
        if (currentSession[sessionStateKey] === SESSION_STATES.STARTED) {
            currentSession.abort();
            currentSession[sessionStateKey] = SESSION_STATES.TERMINATED;
        }
    }

    function getOrderTotal() {
        const basketData = store.getState().basket;
        const basket = isBopisOrder() ? basketData.pickupBasket : basketData;
        const amount = basketUtils.removeCurrency(orderDetails ? orderDetails.priceInfo.orderTotal || '' : basket.subtotal || '');

        return {
            label: 'Estimated Total',
            amount: amount,
            type: AMOUNT_TYPE.FINAL
        };
    }

    function getShippingMethods() {
        // Define shipping method type strings for filtering
        const unscheduledShippingMethodTypeEnKey = 'same day delivery';
        const unscheduledShippingMethodTypeFrKey = 'livraison le jour même';
        const unscheduledFreeShippingMethodTypeEnKey = 'free rouge same day delivery';
        const scheduledShippingMethodTypeEnKey = 'schedule a delivery window';
        const scheduledShippingMethodTypeFrKey = 'prévoir la livraison';
        const scheduledShippingMethodTypeRougeFrKey = 'planifier une fenêtre de livraison';

        let seenSameDay = false;

        const methods = (shippingMethods || [])
            .filter(method => {
                const type = method.shippingMethodType?.toLowerCase() || '';
                const description = method.shippingMethodDescription?.toLowerCase() || '';

                // Remove "Schedule Delivery Window" options using defined keys
                if (
                    type === scheduledShippingMethodTypeEnKey ||
                    type === scheduledShippingMethodTypeFrKey ||
                    type === scheduledShippingMethodTypeRougeFrKey ||
                    description.includes(scheduledShippingMethodTypeEnKey) ||
                    description.includes(scheduledShippingMethodTypeFrKey) ||
                    description.includes(scheduledShippingMethodTypeRougeFrKey)
                ) {
                    return false;
                }

                // Remove duplicate Same Day Delivery options using defined keys
                if (
                    type === unscheduledShippingMethodTypeEnKey ||
                    type === unscheduledShippingMethodTypeFrKey ||
                    type === unscheduledFreeShippingMethodTypeEnKey
                ) {
                    if (seenSameDay) {
                        return false;
                    }

                    seenSameDay = true;
                }

                return true;
            })
            .map(function (group) {
                let description = group.shippingMethodDescription;

                // We need to cut "Delivery" part to win some space on ApplePay sheet
                // per https://jira.sephora.com/browse/ILLUPH-87511
                const cutIndex = description.toLowerCase().indexOf('days');

                if (cutIndex !== -1) {
                    description = description.substring(0, cutIndex + 4) + ')';
                }

                return {
                    label: group.shippingMethodType,
                    detail: description,
                    amount: basketUtils.removeCurrency(group.shippingFee || ''),
                    identifier: group.shippingMethodId
                };
            });

        /**
         * If Current Shipping Method is not the first in the list of methods,
         * Then we need to put it in the first place -
         * ApplePay always shows the first one as selected.
         */
        const methodId = methods.map(method => Number(method.identifier)).indexOf(currentShippingMethodId);

        if (methodId > 0) {
            const methodToShift = methods.splice(methodId, 1);
            methods.unshift(methodToShift[0]);
        }

        return methods;
    }

    function getShippingGroupFromOrder() {
        /* eslint indent: 0 */
        const sameDayDeliveryBasket = (orderDetails?.items?.itemsByBasket || []).find(
            obj => obj.basketType === addToBasketActions.BASKET_TYPES.SAMEDAY_BASKET
        );

        return orderDetails?.shippingGroups?.shippingGroupsEntries
            ? orderDetails.shippingGroups.shippingGroupsEntries.filter(
                  item =>
                      item.shippingGroupType ===
                      (sameDayDeliveryBasket ? orderActions.SHIPPING_GROUPS.SAME_DAY : orderActions.SHIPPING_GROUPS.HARDGOOD)
              )[0].shippingGroup
            : {
                  shippingGroupId: 0,
                  shippingMethod: { shippingMethodId: 0 }
              };
    }

    function getShippingMethodErrorMessage() {
        const shippingMethod = getShippingGroupFromOrder().shippingMethod;
        const shippingFee = checkoutUtils.setShippingFee(shippingMethod.shippingFee);
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Checkout');

        return getText('shippingMethodError', [shippingMethod.shippingMethodType + ' (' + shippingFee + ')']);
    }

    function getLineItems() {
        const { getProp } = helperUtils;
        const { removeCurrency } = basketUtils;

        const lineItems = [];

        lineItems.push({
            label: 'Merchandise Subtotal',
            amount: removeCurrency(getProp(orderDetails, 'priceInfo.merchandiseSubtotal', ''))
        });

        if (getProp(orderDetails, 'priceInfo.bagFeeSubtotal', false)) {
            lineItems.push({
                label: 'Bag Fees',
                amount: removeCurrency(getProp(orderDetails, 'priceInfo.bagFeeSubtotal', ''))
            });
        }

        if (getProp(orderDetails, 'priceInfo.pif', false)) {
            lineItems.push({
                label: 'Special Fees',
                amount: removeCurrency(getProp(orderDetails, 'priceInfo.pif', ''))
            });
        }

        lineItems.push({
            label: 'Estimated Tax',
            amount: removeCurrency(getProp(orderDetails, 'priceInfo.tax', ''))
        });

        if (!isBopisOrder()) {
            lineItems.push({
                label: 'Shipping',
                amount: removeCurrency(getProp(orderDetails, 'priceInfo.totalShipping', ''))
            });
        }

        if (getProp(orderDetails, 'priceInfo.promotionDiscount')) {
            lineItems.push({
                label: 'Discounts',
                amount: '-' + removeCurrency(getProp(orderDetails, 'priceInfo.promotionDiscount', ''))
            });
        }

        if (getProp(orderDetails, 'priceInfo.storeCardAmount')) {
            lineItems.push({
                label: 'Account Credit',
                amount: '-' + removeCurrency(getProp(orderDetails, 'priceInfo.storeCardAmount', ''))
            });
        }

        return lineItems;
    }

    function formatAddress(appleAddress, isBilling) {
        const addressLines = appleAddress.addressLines || [];
        const phoneNumber = appleAddress.phoneNumber || '1234567890';
        const address = {
            address1: addressLines.join(' ') || '',
            address2: '',
            city: appleAddress.locality ? appleAddress.locality.toUpperCase() : '',
            state: appleAddress.administrativeArea,
            postalCode: (appleAddress.postalCode || '').replace(/\n/gm, '').trim(),
            country: appleAddress.countryCode ? appleAddress.countryCode.toUpperCase() : '',
            phone: phoneNumber.replace(helperUtils.specialCharacterRegex, '').slice(0, 10)
        };
        const firstName = appleAddress.givenName || '';
        const lastName = appleAddress.familyName || '';

        if (!isBilling) {
            address.firstName = firstName;
            address.lastName = lastName;
        }

        if (isGuestCheckoutFlow) {
            address.shipEmail = Location.isCheckout() ? orderUtils.getGuestEmail(orderDetails) : appleAddress.emailAddress;
        }

        return isBilling
            ? {
                  firstName: firstName,
                  lastName: lastName,
                  address: address
              }
            : address;
    }

    function formatCreditCard(payment) {
        return {
            paymentData: btoa(JSON.stringify(payment.token.paymentData)),
            paymentNetwork: payment.token.paymentMethod.network,
            paymentDisplayInfo: payment.token.paymentMethod.displayName,
            creditCard: formatAddress(payment.billingContact, true)
        };
    }

    function getShippingGroupIdFromOrder() {
        return getShippingGroupFromOrder().shippingGroupId;
    }

    function getShippingMethodIdFromOrder() {
        return Number(getShippingGroupFromOrder().shippingMethod.shippingMethodId);
    }

    function fillAddress(address) {
        const zipCode = (address.postalCode || '').trim();

        if ((address.countryCode || '').toLowerCase() === ApplePayCountry.CA) {
            address.postalCode = zipCode.length === 3 ? zipCode + '1A1' : zipCode;

            return Promise.resolve({});
        } else {
            return utilityApi.getStateAndCityForZipCode(address.countryCode, zipCode).then(function (data) {
                address.administrativeArea = data.state;
                address.locality = data.city;
            });
        }
    }

    function preparePaymentData(payment) {
        // since billing contact from Apple doesn't have it's own phone
        payment.billingContact.phoneNumber = payment.shippingContact.phoneNumber;

        return new Promise(function (resolve, reject) {
            if (isBopisOrder()) {
                fillAddress(payment.billingContact).then(resolve).catch(reject);
            } else {
                fillAddress(payment.shippingContact)
                    .then(function () {
                        fillAddress(payment.billingContact).then(resolve).catch(reject);
                    })
                    .catch(reject);
            }
        });
    }

    function createApplePayPaymentRequest() {
        const country = localeUtils.getCurrentCountry();
        const currency = localeUtils.isCanada() ? 'CAD' : 'USD';
        const supportedCards = localeUtils.isUS() ? CCARD_TYPES_US : CCARD_TYPES;
        const shippingFields =
            isGuestCheckoutFlow && !Location.isCheckout()
                ? ['postalAddress', 'name', 'phone', 'email']
                : isBopisOrder()
                  ? ['phone']
                  : ['postalAddress', 'name', 'phone'];

        return {
            countryCode: country,
            currencyCode: currency,
            supportedNetworks: supportedCards,
            merchantCapabilities: ['supports3DS'],
            requiredShippingContactFields: shippingFields,
            requiredBillingContactFields: ['postalAddress', 'name'],
            lineItems: [],
            total: getOrderTotal()
        };
    }

    function validateApplePayMerchant(validationUrl) {
        return checkoutApi
            .validateApplePayMerchant(Location.getLocation().host, validationUrl)
            .then(function (data) {
                session.completeMerchantValidation(data);
            })
            .catch(function (reason) {
                // eslint-disable-next-line no-console
                console.log('ApplePay merchant validation failed', JSON.stringify(reason));
                abortSession(session);
            });
    }

    /**
     * The idea of this function is:
     * - to abort the ApplePay sheet after SESSION_ABORT_TIMEOUT secs
     * - and Show sticky ApplePay button instead of Checkout button,
     *      so ApplePay sheet will be accessible for user in one click
     * @param forceClose
     */
    function handleBasketError(forceClose) {
        const basketData = store.getState().basket;
        const basket = isBopisOrder() ? basketData.pickupBasket : basketData;

        if (!basket.showStickyApplePayBtn || forceClose) {
            store.dispatch(addToBasketActions.showStickyApplePayBtn(true));
            setTimeout(() => {
                abortSession(session);
                store.dispatch(Actions.showInterstice(false));
                uIUtils.unlockBackgroundPosition();
            }, SESSION_ABORT_TIMEOUT);
        }

        uIUtils.scrollToTop();
    }

    function applePayPaymentAuthorized(request, event) {
        const payment = event.payment;

        const reinitializeOrderPromise = !isGuestCheckoutFlow
            ? checkoutUtils.initializeCheckout({
                  isApplePayFlow: true,
                  ropisCheckout: isBopisOrder()
              })
            : Promise.resolve();

        reinitializeOrderPromise
            .then(() => {
                if (session[sessionStateKey] === SESSION_STATES.TERMINATED) {
                    startSession(session);

                    return;
                }

                let shippingAddressToProcess;

                if (!isBopisOrder()) {
                    shippingAddressToProcess = {
                        shippingGroupId: getShippingGroupIdFromOrder(),
                        address: formatAddress(payment.shippingContact),
                        saveToProfile: false
                    };
                }

                const createShippingAddress = !isBopisOrder() ? checkoutApi.createShippingAddress(shippingAddressToProcess) : Promise.resolve();
                createShippingAddress
                    .then(() => checkoutApi.getOrderDetails(orderDetails.header.orderId))
                    .then(data => {
                        let result;

                        orderDetails = data;
                        const newShippingMethodId = getShippingMethodIdFromOrder();

                        if (currentShippingMethodId !== newShippingMethodId && !isBopisOrder()) {
                            store.dispatch(addToBasketActions.showError({ internalError: getShippingMethodErrorMessage() }));
                            savedAddress = Object.assign({}, payment.shippingContact);
                            handleBasketError(true);
                            session.completePayment(ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS);
                            result = request;
                        } else {
                            savedAddress = null;
                            const postData = formatCreditCard(payment);

                            // TODO Refactor catches here to form a single pipeline.
                            checkoutApi
                                .addCreditCardToOrder(postData, true)
                                .then(() => {
                                    checkoutApi
                                        .placeOrder({
                                            originOfOrder: 'mobileWeb',
                                            jscData: true
                                        })
                                        .then(data2 => {
                                            session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
                                            //empty users basket data after order is placed
                                            Flush.flushBasket();

                                            setTimeout(() => {
                                                store.dispatch(Actions.showInterstice(true));
                                                urlUtils.redirectTo('/checkout/confirmation?orderId=' + data2.orderId);
                                            }, SESSION_SUCCESS_TIMEOUT);
                                        })
                                        .catch(reason => {
                                            session.completePayment(window.ApplePaySession.STATUS_FAILURE);
                                            setTimeout(() => {
                                                abortSession(session);
                                            }, SESSION_ABORT_TIMEOUT);

                                            if (Location.isFrictionlessCheckoutPage()) {
                                                const errors = getErrorStatesFromSubmitOrderAPI(reason);

                                                if (Object.keys(errors || {}).length > 0) {
                                                    FrictionlessCheckoutBindings.setPlaceOrderBtnClickanalytics({
                                                        isSuccess: false,
                                                        hasErrorMessage: reason?.errorMessages?.length > 0
                                                    });
                                                    UI.scrollTo({ elementId: Object.keys(errors)[0], hasOffset: false });
                                                    store.dispatch(OrderActions.setCheckoutSectionErrors(errors));
                                                }
                                            }

                                            if (reason.errorMessages) {
                                                store.dispatch(addToBasketActions.showError({ internalError: reason.errorMessages.join(' ') }));
                                                store.dispatch(addToBasketActions.refreshBasket());
                                                handleBasketError(true);
                                            }
                                        });
                                })
                                .catch(() => {
                                    session.completePayment(ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS);
                                });
                        }

                        return result;
                    })
                    .catch(reason => {
                        if (reason.errorCode === ERROR_CODES.INVALID_ADDRESS_ERROR && reason.errors && reason.errors.phoneNumber) {
                            session.completePayment(ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT);
                        } else {
                            session.completePayment(ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS);
                        }
                    });
            })
            .catch(reason => {
                store.dispatch(addToBasketActions.showError({ internalError: reason.errorMessages.join(' ') }));

                store.dispatch(addToBasketActions.refreshBasket());

                handleBasketError(true);
            });
    }

    function applePayPaymentMethodSelected() {
        session.completePaymentMethodSelection(getOrderTotal(), getLineItems());
    }

    function handleRestrictedShippingError(reason) {
        if (reason) {
            const errorMessage = reason.errors && (reason.errors.restrictedShipping || reason.errors.stateRestricted);

            if (errorMessage) {
                store.dispatch(addToBasketActions.showError({ internalError: errorMessage }));
                handleBasketError();
            }
        }
    }

    function handleInvalidZipCodeError(reason) {
        if (reason) {
            const errorMessage = reason?.errors?.invalidAddress;

            if (errorMessage) {
                store.dispatch(addToBasketActions.showError({ internalError: errorMessage }));
                handleBasketError();
            }
        }
    }

    function handleOutOfStockError(reason) {
        if (reason && reason.errors && (reason.errors.inventoryNotAvailable || reason.errors.sameDaySkuOOSException)) {
            store.dispatch(addToBasketActions.showError({ internalError: reason.errorMessages.join(' ') }));
            store.dispatch(addToBasketActions.refreshBasket());
            handleBasketError(true);
        }
    }

    function applePayShippingContactSelected(request, event) {
        // Show Shipping Section in Error state if basket is Hazardous
        if (mergeBasketError) {
            handleBasketError();
            session.completeShippingContactSelection(
                ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                getShippingMethods(),
                getOrderTotal(),
                getLineItems()
            );

            return request;
        }

        let shippingContact = event.shippingContact;

        if (savedAddress && savedAddress.locality === shippingContact.locality) {
            shippingContact = savedAddress;
        }

        const shippingAddressToProcess = {
            shippingGroupId: getShippingGroupIdFromOrder(),
            address: formatAddress(shippingContact, false),
            saveToProfile: false
        };

        checkoutApi
            .createShippingAddress(shippingAddressToProcess)
            .then(() => checkoutApi.getOrderDetails(orderDetails.header.orderId))
            .then(data => {
                orderDetails = data;
                currentShippingMethodId = getShippingMethodIdFromOrder();
                const shippingGroupId = getShippingGroupIdFromOrder();

                checkoutApi.getAvailableShippingMethods(orderDetails.header.orderId, shippingGroupId).then(data2 => {
                    shippingMethods = data2.shippingMethods;
                    session.completeShippingContactSelection(ApplePaySession.STATUS_SUCCESS, getShippingMethods(), getOrderTotal(), getLineItems());
                });
            })
            .catch(reason => {
                handleRestrictedShippingError(reason);
                handleInvalidZipCodeError(reason);
                handleOutOfStockError(reason);
                session.completeShippingContactSelection(
                    ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                    getShippingMethods(),
                    getOrderTotal(),
                    getLineItems()
                );

                return request;
            });

        return request;
    }

    function applePayShippingMethodSelected(request, event) {
        const shippingMethodData = {
            shippingGroupId: getShippingGroupIdFromOrder(),
            shippingMethodId: event.shippingMethod.identifier,
            orderId: orderDetails.header.orderId
        };

        checkoutApi
            .setShippingMethod(shippingMethodData)
            .then(() => checkoutApi.getOrderDetails(orderDetails.header.orderId))
            .then(data => {
                orderDetails = data;
                currentShippingMethodId = getShippingMethodIdFromOrder();
                session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS, getOrderTotal(), getLineItems());
            })
            .catch(() => {
                session.completeShippingMethodSelection(ApplePaySession.STATUS_FAILURE, getOrderTotal(), getLineItems());
            });

        return request;
    }

    function prepareSession() {
        // Reset the default values for the Session
        const request = createApplePayPaymentRequest();
        session = new window.ApplePaySession(1, request);
        session[sessionStateKey] = SESSION_STATES.INITIATED;
        store.dispatch(UtilActions.merge('applePaySession', 'isActive', true));
        mergeBasketError = false;

        function handleShippingContactCompletion(status) {
            session.completeShippingContactSelection(status, getShippingMethods(), getOrderTotal(), getLineItems());
        }

        function handleShippingContact(event) {
            fillAddress(event.shippingContact)
                .then(() => applePayShippingContactSelected(request, event))
                .catch(error => {
                    console.log(error);
                    handleShippingContactCompletion(ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT);
                });
        }

        session.onvalidatemerchant = function (event) {
            validateApplePayMerchant(event.validationURL);
        };

        session.onpaymentmethodselected = function (event) {
            applePayPaymentMethodSelected(request, event);
        };

        session.onshippingcontactselected = function (event) {
            const zipcode = event.shippingContact.postalCode;
            const state = event.shippingContact.administrativeArea;

            if (Sephora.configurationSettings.isApplePayHazmatItemsEnabled) {
                checkoutApi.checkHazmatLocation({ zipcode, state }).then(data => {
                    if (data.isShippingRestricted) {
                        handleShippingContactCompletion(ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS);
                    } else {
                        handleShippingContact(event);
                    }
                });
            } else {
                handleShippingContact(event);
            }
        };

        session.onshippingmethodselected = function (event) {
            applePayShippingMethodSelected(request, event);
        };

        session.onpaymentauthorized = function (event) {
            preparePaymentData(event.payment)
                .then(() => applePayPaymentAuthorized(request, event))
                .catch(error => {
                    console.log(error);
                    session.completePayment(window.ApplePaySession.STATUS_FAILURE);
                });
        };

        session.oncancel = function () {
            store.dispatch(Actions.showInterstice(false));

            if (Location.isCheckout()) {
                store.dispatch(UtilActions.merge('order', 'isApplePayFlow', false));
            } else {
                store.dispatch(UtilActions.merge('applePaySession', 'isActive', false));
            }
        };
    }

    function enableGuestCheckout() {
        isGuestCheckoutFlow = true;
    }

    function onApplePayClicked() {
        prepareSession();

        checkoutUtils
            .initializeCheckout({
                isApplePayFlow: true,
                isGuestCheckout: isGuestCheckoutFlow,
                ropisCheckout: isBopisOrder()
            })
            .then(order => {
                checkoutApi.getOrderDetails(isGuestCheckoutFlow ? 'current' : order.orderId).then(data => {
                    orderDetails = data;
                    startSession(session);
                });
            })
            .catch(checkoutUtils.initOrderFailure);

        // If user became recognized - Abort current session
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(() => {
                if (!userUtils.isSignedIn()) {
                    abortSession(session);
                }
            }),
            { ignoreAutoUnsubscribe: true }
        );
    }

    function checkApplePayments(resolve) {
        if (window.ApplePaySession) {
            window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
                .then(canMakePayments => {
                    resolve(canMakePayments ? TYPES.ENABLED : TYPES.HIDDEN);
                })
                .catch(() => {
                    resolve(TYPES.HIDDEN);
                });
        } else {
            resolve(TYPES.HIDDEN);
        }
    }

    function getApplePaymentType(orderData) {
        return new Promise(resolve => {
            const isApplePayHazmatEnabled = Sephora.configurationSettings.isApplePayHazmatItemsEnabled;
            let isApplePayEnabled;

            const isCheckout = Location.isCheckout();

            // The property to check if ApplePay is enabled is in different locations depending
            // if we are in checkout or not, and if isApplePayHazmatEnabled is enabled or not
            if (isApplePayHazmatEnabled) {
                isApplePayEnabled = isCheckout ? orderData.items.forceShowApplePayPopupForHazmat : orderData.forceShowApplePayPopupForHazmat;
            } else {
                isApplePayEnabled = isCheckout ? orderData.header.isApplePayEnabled : orderData.isApplePayEnabled;
            }

            if (orderData.isInitialized && isApplePayEnabled) {
                checkApplePayments(type => {
                    if (type !== TYPES.HIDDEN) {
                        if (!orderData.items.length) {
                            resolve(TYPES.DISABLED);
                        } else {
                            resolve(type);
                        }
                    } else {
                        resolve(TYPES.HIDDEN);
                    }
                });
            } else {
                resolve(TYPES.HIDDEN);
            }
        });
    }

    return {
        startSession,
        abortSession,
        onApplePayClicked,
        getApplePaymentType,
        checkApplePayments,
        prepareSession,
        enableGuestCheckout,
        getLineItems,
        TYPES
    };
}());
