import React from 'react';
import store from 'store/Store';
import urlUtils from 'utils/Url';
import uiUtils from 'utils/UI';
import basketUtils from 'utils/Basket';
import addToBasketActions from 'actions/AddToBasketActions';
import OrderActions from 'actions/OrderActions';
import processEvent from 'analytics/processEvent';
import anaConstants from 'analytics/constants';
import anaUtils from 'analytics/utils';
import userUtils from 'utils/User';
import ErrorsUtils from 'utils/Errors';
import checkoutApi from 'services/api/checkout';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import orderUtils from 'utils/Order';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import locationUtils from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';
import Flush from 'utils/localStorage/Flush';
import addressUtils from 'utils/Address';
import helperUtils from 'utils/Helpers';
import dateUtils from 'utils/Date';
import updatePreferredZipCode from 'services/api/profile/updatePreferredZipCode';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import rwdBasket from 'reducers/rwdBasket';
import { RWD_CHECKOUT_ERRORS } from 'constants/RwdBasket';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { mountCmsRefererLinkByItems } from 'analytics/utils/cmsReferer';
import {
    Divider, Flex, Link, Text
} from 'components/ui';
import ChatEntry from 'components/Content/CustomerService/ChatWithUs/ChatEntry';
import { CHAT_ENTRY } from 'constants/chat';
import Empty from 'constants/empty';
import Venmo from 'utils/Venmo';
import { getOrderPayments } from 'components/RwdCheckout/RwdCheckoutMain/checkoutService';

const { ACTION_TYPES } = rwdBasket;
const { GIS_ZONE_2, BI_BENEFITS_ERRORS } = RWD_CHECKOUT_ERRORS;
const { getProp } = helperUtils;
const { hasAVS } = addressUtils;
const { SHIPPING_GROUPS } = orderUtils;

let orderMergedMsgViewed = false;
let signInResponse = null;
const CHECKOUT_PATH = '/checkout';
const CHECKOUT_PATH_ROPIS = '/checkout/ropis';

const CHECKOUT_SECTIONS = {
    PICKUP_ORDER_CONTACT_INFO: {
        name: 'pickUpOrderContactInfo',
        path: 'pickupordercontactinfo',
        title: 'pickUpOrderContactInfo'
    },
    PICKUP_ORDER_LOCATION_INFO: {
        name: 'pickUpOrderLocationInfo',
        path: 'pickuporderlocationinfo',
        title: 'pickUpOrderLocationInfo'
    },
    GIFT_CARD_ADDRESS: {
        name: 'giftCardShipAddress',
        path: 'giftcardshipping',
        title: 'giftCardShippingAddress'
    },
    GIFT_CARD_OPTIONS: {
        name: 'giftCardShipOptions',
        path: 'giftcarddelivery',
        title: 'giftCardDeliveryMessage'
    },
    SHIP_ADDRESS: {
        name: 'shipAddress',
        path: 'shipping',
        title: 'shippingAddress'
    },
    SHIP_OPTIONS: {
        name: 'shipOptions',
        path: 'delivery',
        title: 'deliveryGiftOptions'
    },
    SHIP_OPTIONS_REPLEN: {
        name: 'shipOptions',
        path: 'delivery',
        title: 'deliveryAutoReplenish'
    },
    PAYMENT: {
        name: 'payment',
        path: 'payment',
        title: 'paymentMethod'
    },
    ACCOUNT: {
        name: 'account',
        path: 'account',
        title: 'accountCreation'
    },
    REVIEW: {
        name: 'review',
        path: 'checkout',
        title: 'reviewPlaceOrder'
    },
    DELIVER_TO: {
        name: 'deliverTo',
        path: 'shipping',
        title: 'deliverTo',
        note: 'deliverToNote'
    },
    GIFT_MESSAGE: {
        name: 'giftMessage',
        path: 'checkout',
        title: 'giftMessage'
    }
};

const FULLFILLMENT_TYPE = {
    GIS: 'getItShipped',
    AR: 'autoReplenish'
};

const MESSAGE_CONTEXT = {
    WARNING: 'warning',
    ERROR: 'error',
    PROMO_WARNING: 'basket.promoWarning',
    PROMO_MESSAGES: 'basket.promoMessages',
    PROMO_INVALID: 'basketLevelMsg',
    RRC_REMAINING_BALANCE: 'basket.rrcRemainingBalance',
    SAMPLES_ONLY: 'basket.hasOnlySamples',
    PRE_BASKET_SHIPTOHOME_GENERIC_WARNING: 'basket.shiptoHome.genericErrorMessage',
    PRE_BASKET_PICKUPITEMS_GENERIC_WARNING: 'basket.pickupItems.genericErrorMessage'
};

const redirectToBasket = isRopis => {
    //remove basket cache so that OOS items show up on basket page with warning message
    Flush.flushBasket();
    let path = '/basket';

    if (isRopis) {
        path += '?type=ropis';
    }

    locationUtils.setLocation(path);
};

const ORDER_FRAUD_ERROR_MAP = {
    'checkout.placeOrder.fraud.error.forter_no_fix': {
        errorCode: -8,
        modalTitle: 'error'
    },
    'checkout.placeOrder.fraud.error.client_resolve_coupon': {
        errorCode: -8,
        modalTitle: 'adjustBasket'
    },
    'checkout.placeOrder.fraud.error.client_resolve_sale': {
        errorCode: -8,
        modalTitle: 'adjustBasket'
    },
    'checkout.placeOrder.fraud.error.contact_cs': {
        errorCode: -8,
        modalTitle: 'verificationRequired',
        modalMessage: () => {
            const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Checkout');
            const getFormattedText = resourceWrapper(getText);

            return (
                <Flex
                    flexDirection='column'
                    gap={4}
                >
                    <Text
                        is='p'
                        children={getFormattedText(
                            'contactCS',
                            false,
                            <Link
                                color='blue'
                                underline
                                href='tel:18777374672'
                                children={getText('csPhone')}
                            />
                        )}
                    />
                    <Text is='p'>
                        <Text children={getText('csHours')} />
                        <br />
                        <Text
                            children={getFormattedText(
                                'monFriHours',
                                false,
                                <Text
                                    fontWeight='bold'
                                    children={getText('monToFri')}
                                />
                            )}
                        />
                        <br />
                        <Text
                            children={getFormattedText(
                                'satSunHours',
                                false,
                                <Text
                                    fontWeight='bold'
                                    children={getText('satToSun')}
                                />
                            )}
                        />
                    </Text>
                    <Divider />
                    <ChatEntry type={CHAT_ENTRY.fraudErrCheckout} />
                    <Divider />
                </Flex>
            );
        }
    }
};

const SHIPPING_FEE_REGEX = /^(\$0.00|0,00\s*\$|FREE|GRATUIT)$/i;

function isGuestOrder() {
    return store.getState().order.orderDetails.header.isGuestOrder;
}

function successfullInit(data) {
    if (data) {
        Storage.local.setItem(LOCAL_STORAGE.INIT_ORDER_ID, data.orderId || data.currentOrderId);

        return data;
    } else {
        // initialization process should be stopped if data is not returned
        // also data.orderId and data.currentOrderId are not set
        return Promise.reject(data);
    }
}

function initializeAnonymousCheckout(params) {
    return checkoutApi.initializeAnonymousCheckout(params);
}

function initializeSignedInCheckout(params) {
    return checkoutApi.initializeCheckout(params);
}

/**
 *
 * @param {*} userData
 * @param {*} basket
 */
function verifyBIPointsBalance(userData, basket) {
    try {
        const userPromotionPoints = userData?.beautyInsiderAccount?.promotionPoints;
        const redeemedBiPoints = basket?.redeemedBiPoints;
        const appliedCBRValue = basket?.appliedCBRValue;
        const getBiBenefitsText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/locales', 'BIBenefits');

        if (userPromotionPoints < 0 && (redeemedBiPoints > 0 || appliedCBRValue > 0)) {
            const exceededPoints = Math.abs(userPromotionPoints);
            const errorMessage = getBiBenefitsText('exceededCheckoutPoints', [exceededPoints]);

            throw { errorMessages: [errorMessage] };
        }
    } catch (error) {
        store.dispatch({
            type: ACTION_TYPES.SET_RWD_CHECKOUT_ERRORS,
            payload: {
                error,
                errorLocation: BI_BENEFITS_ERRORS
            }
        });

        throw error;
    }
}

function handleInitCheckoutError(error, ropisCheckout) {
    if (!ropisCheckout) {
        Sephora.logger.verbose('[ERROR IN CHECKOUT]: ', error);

        if (!error?.errors?.sameDayBasketLevelMsg) {
            // Clear previous GIS Zone 2 errors on new Checkout attempt
            store.dispatch({
                type: 'CLEAR_GISZONE2_ERRORS'
            });

            store.dispatch({
                type: ACTION_TYPES.SET_RWD_CHECKOUT_ERRORS,
                payload: {
                    error,
                    errorLocation: GIS_ZONE_2
                }
            });
        }
    }

    // re-throw the error in case we want to use orignal err elsewhere
    throw error;
}

// Initializing checkout is a mandatory API operation of switching current order
// to its new `checkout' status. It's not possible to start a checkout process
// without initializing an order first.
function initializeCheckout(options = {}) {
    const {
        isPaypalFlow = false,
        isApplePayFlow = false,
        isVenmoFlow = false,
        isGuestCheckout = false,
        user = null,
        ropisCheckout = false,
        isInitAfterSignIn = false
    } = options;

    const params = {};
    const userData = (user ? user : store.getState().user) || {};
    signInResponse = options.signInResponse;

    if (signInResponse && signInResponse.warnings && signInResponse.warnings.length) {
        // eslint-disable-next-line no-console
        return Promise.reject(new Error('fail')).then(() => console.log('Error on Sign in'));
    }

    // if merged message was viewed already, then do not show it again on initOrderSuccess
    const basketData = store.getState().basket;
    const basket = ropisCheckout ? basketData.pickupBasket : basketData;

    orderMergedMsgViewed = !!(basket && basket.error && basket.error.orderMergedMsg);

    // Throw an error if user is trying to checkout with insufficient points
    verifyBIPointsBalance(userData, basket);

    const isAnonymousCheckout = !!userData.isNewUserFlow;

    if (isAnonymousCheckout) {
        params.email = userData.userName;
    } else if (isGuestCheckout) {
        params.guestCheckout = !!isGuestCheckout;
    } else {
        params.orderId = basketUtils.getOrderId();
        params.profileId = userUtils.getProfileId();
    }

    params.isPaypalFlow = !!isPaypalFlow;
    params.isApplePayFlow = !!isApplePayFlow;
    params.isVenmoFlow = !!isVenmoFlow;

    if (ropisCheckout) {
        /*
        As per CE contract, RopisCheckout property is sent to /api/checkout/order/init
        either the order is BOPIS or ROPIS.
        */
        params.RopisCheckout = true;
    }

    const zipCodeData = { postalCode: userData.preferredZipCode };
    // If we are doing an init checkout just after sign, we need to make sure that
    // the user has an updated preferred zipcode.
    const shouldUpdateZipCode =
        Sephora.configurationSettings.isSameDayShippingEnabled &&
        userData.preferredZipCode &&
        basketUtils.hasSameDayItems() &&
        !ropisCheckout &&
        isInitAfterSignIn;

    // Make sure to call the API just when needed
    const updateZipCodePromise = shouldUpdateZipCode ? updatePreferredZipCode(zipCodeData) : Promise.resolve();

    return updateZipCodePromise
        .then(() => {
            if (isAnonymousCheckout || isGuestCheckout) {
                return checkoutUtils.initializeAnonymousCheckout(params).then(successfullInit);
            } else {
                return checkoutUtils.initializeSignedInCheckout(params).then(successfullInit);
            }
        })
        .catch(error => handleInitCheckoutError(error, ropisCheckout));
}

function initOrderSuccess(isRegularCheckout = true, isBopis = false, editSephoraCreditCard = false) {
    const basketData = store.getState().basket;
    const basket = isBopis ? basketData.pickupBasket : basketData;

    const hasOrderMsg = !!(basket && basket.error && basket.error.orderMergedMsg);
    let showPaymentSection = false;
    const bopis = isBopis || basketUtils.isPickup();

    BasketBindings.checkout({ isBopis: bopis });

    mountCmsRefererLinkByItems({
        items: basket?.items
    });

    if (Sephora.isAgent) {
        //If it is Sephora mirror payment section will always be open. However, for some agent roles this doesn't apply
        showPaymentSection = !Sephora.isAgentAuthorizedRole?.(['3']);
    }

    if (editSephoraCreditCard) {
        Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, true);
    } else if (showPaymentSection) {
        Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, true);
    } else {
        Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, false);
    }

    if ((orderMergedMsgViewed || !hasOrderMsg) && !locationUtils.isCheckout()) {
        const path = isRegularCheckout ? CHECKOUT_PATH : CHECKOUT_PATH_ROPIS;
        urlUtils.redirectTo(path);
    } else {
        orderMergedMsgViewed = true;
        uiUtils.scrollToTop();
        uiUtils.unlockBackgroundPosition();
    }
}

// Get the error key (such as sameDayBasketLevelMsg) to show the error in the
// appropriate basket. Use internal error if there's no such key
function getErrorKey(error) {
    let keys;

    if (error?.errors) {
        keys = Object.keys(error.errors);
    }

    return keys ? keys[0] : 'internalError';
}

function initOrderFailure(reason, isShowCheckoutActive) {
    // if the reason is not defined - we do not claim an error
    // e.g. closed authorisation modal does not give to the checkout process
    // to continue and is not an error

    if (reason && typeof reason === 'object') {
        const itemLevelErrors = basketUtils.catchItemLevelErrors(reason);
        const errorKey = getErrorKey(reason);

        // Currently, this handler is handling failures from both UI and API, which
        // is, obviously, bad. That's why we need to check if errorMessages prop is
        // present on the failure reason.
        // TODO Address handling failures properly.
        // Don't lose the error key, sicne we need to know which type of error it is
        const basketLevelErrors = !itemLevelErrors && { [errorKey]: reason && reason.errorMessages && reason.errorMessages.join(' ') };

        if (locationUtils.isCheckout()) {
            ErrorsUtils.collectAndValidateBackEndErrors(reason || {});
        } else if (isShowCheckoutActive && !locationUtils.isBasketPage()) {
            const path = '/basket';
            locationUtils.setLocation(path);
        }

        store.dispatch(addToBasketActions.showError(basketLevelErrors, itemLevelErrors));

        store.dispatch(addToBasketActions.refreshBasket(itemLevelErrors ? reason : null, false));

        processEvent.process(anaConstants.LINK_TRACKING_EVENT, {
            data: {
                bindingMethods: linkTrackingError,
                errorMessages: reason && reason.errorMessages,
                fieldErrors: ['basket'],
                eventStrings: [anaConstants.Event.EVENT_71],
                linkName: 'error',
                specificEventName: 'basket_checkout_button_error'
            }
        });
    }
}

function placeOrderSuccess(submittedDetails) {
    store.dispatch(OrderActions.orderSubmitted(submittedDetails));
    Flush.flushUser();
    Flush.flushBasket();
    Flush.flushPersonalizedPromotions();
    Venmo.clearVenmoExpressFlow();
    Venmo.clearVenmoStarted();
    locationUtils.setLocation('/checkout/confirmation?orderId=' + submittedDetails.orderId);
}

function getOrderFraudError(errorData) {
    const { errorCode, errorMessages, key: errorKey } = errorData || Empty.Object;

    let isOrderDeclined = false;
    let orderDeclineAction = Empty.Function;

    if (errorKey && Object.hasOwn(ORDER_FRAUD_ERROR_MAP, errorKey) && errorCode === -8) {
        const { modalTitle, modalMessage } = ORDER_FRAUD_ERROR_MAP[errorKey];

        isOrderDeclined = true;

        orderDeclineAction = () => {
            const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Checkout');
            const isGuestCheckout = isGuestOrder();

            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: isGuestCheckout ? getText('error') : getText(modalTitle),
                    message: isGuestCheckout ? getText('guestErrorMessage') : modalMessage ? modalMessage() : errorMessages?.join(' '),
                    buttonText: getText('ok'),
                    callback: redirectToBasket,
                    showCancelButton: false
                })
            );
        };
    }

    return {
        isOrderDeclined,
        orderDeclineAction
    };
}

function placeOrderFailure(errorData, comp, isRopis = false) {
    //TODO 18.2: remove after implementing tech story ILLUPH-104109 which will
    //add interstice back to checkout flow
    store.dispatch(OrderActions.togglePlaceOrderDisabled(false));

    const { isOrderDeclined, orderDeclineAction } = getOrderFraudError(errorData);

    //TODO 18.2: Refactor this piece when API errorCode for OOS is ready
    const isItemsOOS = errorData.errorMessages && errorData.errorMessages.some(error => error.indexOf('outOfStock') !== -1);

    if (isOrderDeclined) {
        orderDeclineAction();
    } else if (isItemsOOS) {
        if (isRopis) {
            const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Checkout');
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('warning'),
                    message: errorData.errorMessages.join('. '),
                    buttonText: getText('ok'),
                    callback: () => redirectToBasket(true),
                    showCancelButton: false,
                    showCloseButton: false
                })
            );
        } else {
            redirectToBasket();
        }
    } else {
        if (comp) {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, comp);
        }
        // errors are saved in Store,
        // please, see usage of store.watchAction to catch them

        store.dispatch(OrderActions.orderErrors(errorData));
    }
}

function isGiftCardAddressComplete() {
    const orderDetails = store.getState().order.orderDetails;
    const shipGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);

    return shipGroup && shipGroup.isComplete;
}

function isGiftCardShipOptionsComplete() {
    const orderDetails = store.getState().order.orderDetails;
    const shipGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);

    return shipGroup && shipGroup.shippingMethod.isComplete;
}

//for regular hard good products, not physical gift card
// params are orderDetails.shippingGroups.shippingGroupEntries
function isShipAddressComplete() {
    const orderDetails = store.getState().order.orderDetails;
    const shipGroup = orderUtils.getHardGoodShippingGroup(orderDetails);

    return shipGroup && shipGroup.isComplete;
}

//for same day delivery group
function isSameDayShipAddressComplete() {
    const orderDetails = store.getState().order.orderDetails;
    const shipGroup = orderUtils.getSameDayShippingGroup(orderDetails);

    return shipGroup && shipGroup.isComplete;
}

//checks if the payments provided in orderDetails is considered complete (via the api)
function isPaymentInOrderComplete() {
    const orderState = store.getState().order;
    const orderDetails = orderState.orderDetails;
    const isZeroDollarOrderWithCVVValidation = orderUtils.isZeroDollarOrderWithCVVValidation();
    const headerPaymentGroups = orderDetails.header.paymentGroups || [];
    const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(orderDetails);
    const hasAutoReplenishItems = orderUtils.hasAutoReplenishItems(orderDetails);
    const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };

    if ((isSDUOnlyOrder || hasAutoReplenishItems || isZeroDollarOrderWithCVVValidation) && !creditCardPaymentGroup.isComplete) {
        return false;
    }

    for (let i = 0; i < headerPaymentGroups.length; i++) {
        const group = headerPaymentGroups[i];

        if (!group.isComplete) {
            return false;
        }
    }

    return true;
}

function renderFrictionlessPaymentErrorView() {
    const orderState = store.getState().order;
    const orderDetails = orderState.orderDetails;
    const creditCards = orderState.paymentOptions?.creditCards;
    const isZeroDollarOrderWithCVVValidation = orderUtils.isZeroDollarOrderWithCVVValidation();
    const headerPaymentGroups = orderDetails.header.paymentGroups || [];
    const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };

    if (isZeroDollarOrderWithCVVValidation && creditCards?.length && !creditCardPaymentGroup.isComplete) {
        return true;
    }

    for (let i = 0; i < headerPaymentGroups.length; i++) {
        const group = headerPaymentGroups[i];

        // we only want to return error view if the user has CC saved,
        // and then gets to checkout page with an incomplete card.
        if (!group.isComplete && group?.cardNumber?.length > 0) {
            return true;
        }
    }

    return false;
}

function isGiftCardApplied() {
    const orderDetails = store.getState().order.orderDetails;
    const paymentGroupsEntries = orderDetails.paymentGroups.paymentGroupsEntries || [];

    return paymentGroupsEntries.some(payment => payment.paymentGroupType === orderUtils.PAYMENT_GROUP_TYPE.GIFT_CARD);
}

function isCreditCardRequired(orderDetails = store.getState().order.orderDetails) {
    const paymentMessages = orderDetails.paymentGroups.paymentMessages || [];

    return paymentMessages.some(payment => payment.messageContext === orderUtils.PAYMENT_MESSAGES.CREDITCARD_REQUIRED);
}

function getCreditCardRequiredMessage(paymentMessages) {
    return paymentMessages?.filter(message => message.messageContext === orderUtils.PAYMENT_MESSAGES.CREDITCARD_REQUIRED)?.[0]?.messages?.[0];
}

function getGiftCardAmountNotEnoughMessage(paymentMessages) {
    return paymentMessages?.filter(message => message.messageContext === orderUtils.PAYMENT_MESSAGES.GIFTCARD_NOT_ENOUGH)?.[0]?.messages?.[0];
}

function isStoreCreditApplied() {
    const orderDetails = store.getState().order.orderDetails;
    const paymentGroupsEntries = orderDetails.paymentGroups.paymentGroupsEntries || [];

    return paymentGroupsEntries.some(payment => payment.paymentGroupType === orderUtils.PAYMENT_GROUP_TYPE.STORE_CREDIT);
}

//checks if the whole payment checkout section is complete
function isPaymentSectionComplete() {
    const { orderDetails, paymentOptions } = store.getState().order;

    // if Klarna, Afterpay, Paze or Venmo are a selected payment method -> always mark
    // Payment Section as incomplete.

    const paymentTypes = ['klarna', 'afterpay', 'paze', 'venmo'];
    const selectedButNotDefault = paymentTypes.some(type => {
        const group = orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE[type.toUpperCase()]);
        const isDefault = paymentOptions.defaultPayment === type;

        return group && !isDefault;
    });

    // keeps the payment section expanded
    if (selectedButNotDefault) {
        return false;
    }

    return isPaymentInOrderComplete();
}

function isOrderComplete() {
    const orderDetails = store.getState().order.orderDetails;

    return orderDetails.header.isComplete;
}

function disablePlaceOrderButtonBasedOnCheckoutCompleteness() {
    const placeOrderButtonDisabledState = store.getState().order.isPlaceOrderDisabled;
    const shouldPlaceOrderBeDisabled = !isOrderComplete();

    if (placeOrderButtonDisabledState !== shouldPlaceOrderBeDisabled) {
        store.dispatch(OrderActions.togglePlaceOrderDisabled(shouldPlaceOrderBeDisabled));
    }
}

// params are orderDetails.header.profile
function isAccountComplete() {
    const orderDetails = store.getState().order.orderDetails;

    return orderDetails.header.profile && orderDetails.header.profile.isComplete;
}

// This function checks if any information is missing on the Checkout Accordion,
// and opens any section that needs data to be entered
/* eslint-disable-next-line complexity */
function changeCheckoutUrlBasedOnOrderCompleteness(isShipOptionsFirstTimeForNewUser, isGiftShipOptionsFirstTimeForNewUser, isCheckoutFirstTime) {
    // TODO 18.1: Add checks for physical gift cards
    let newPath = CHECKOUT_PATH;
    const currentPath = store.getState().historyLocation.path;

    const orderDetails = store.getState().order.orderDetails;
    const physicalGiftCard = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
    const hardGoodShipGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
    const sameDayShipGroup = orderUtils.getSameDayShippingGroup(orderDetails);
    const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
    const isSephoraCardType = orderUtils.isSephoraCardType(creditCardPaymentGroup);
    const isSephoraCardEdit = Storage.session.getItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD);
    const shouldEditSephoraCard = isSephoraCardEdit && !isSephoraCardType;

    if (physicalGiftCard && !isGiftCardAddressComplete()) {
        newPath += `/${CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.path}`;
    } else if (physicalGiftCard && (isGiftShipOptionsFirstTimeForNewUser || !isGiftCardShipOptionsComplete())) {
        newPath += `/${CHECKOUT_SECTIONS.GIFT_CARD_OPTIONS.path}`;
    } else if (hardGoodShipGroup && !isShipAddressComplete()) {
        newPath += `/${CHECKOUT_SECTIONS.SHIP_ADDRESS.path}`;
    } else if (sameDayShipGroup && !isSameDayShipAddressComplete()) {
        newPath += `/${CHECKOUT_SECTIONS.DELIVER_TO.path}`;
    } else if (
        isCheckoutFirstTime &&
        hasAVS(userUtils.getShippingCountry().countryCode) &&
        !isGuestOrder() &&
        getProp(hardGoodShipGroup, 'address.isAddressVerified') === false
    ) {
        newPath += `/${CHECKOUT_SECTIONS.SHIP_ADDRESS.path}`;
        store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
    } else if (hardGoodShipGroup && isShipOptionsFirstTimeForNewUser) {
        newPath += `/${CHECKOUT_SECTIONS.SHIP_OPTIONS.path}`;
    } else if (shouldEditSephoraCard || !isPaymentSectionComplete() || isGuestOrder()) {
        newPath += `/${CHECKOUT_SECTIONS.PAYMENT.path}`;
    } else if (!isAccountComplete()) {
        newPath += `/${CHECKOUT_SECTIONS.ACCOUNT.path}`;
    } else if (isOrderComplete()) {
        // if existing user enters /checkout/sub_section in her browser and her order is complete
        // then replace location with /checkout
        if (currentPath !== CHECKOUT_PATH) {
            store.dispatch(historyLocationActions.replaceLocation({ path: CHECKOUT_PATH }));
        }

        return;
    }

    // check is necessary to ensure that if the user lands on /checkout and then we redirect her
    // to another section, when she clicks back on the browser button she does not end up on
    // /checkout but on the previous page
    if (currentPath === CHECKOUT_PATH) {
        store.dispatch(historyLocationActions.replaceLocation({ path: newPath }));
    } else {
        store.dispatch(historyLocationActions.goTo({ path: newPath }));
    }
}

function checkAndOrderCreditCardsUpdate() {
    const orderDetails = store.getState().order.orderDetails;
    const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
    const isSephoraCardType = orderUtils.isSephoraCardType(creditCardPaymentGroup);
    const isSephoraCardEdit = Storage.session.getItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD);
    const shouldEditSephoraCard = isSephoraCardEdit && !isSephoraCardType;

    if (shouldEditSephoraCard || !isPaymentSectionComplete() || isGuestOrder()) {
        getOrderPayments(orderDetails?.header?.orderId);
    }
}

function isZeroFee(fee = '') {
    return typeof fee === 'string' && SHIPPING_FEE_REGEX.test(fee.trim());
}

function setShippingFee(shippingFee) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Checkout');

    return isZeroFee(shippingFee) ? getText('free') : shippingFee;
}

function isMoreThanJustCC(priceInfo) {
    const moreFields = ['giftCardAmount', 'eGiftCardAmount', 'storeCardAmount'];

    return Object.keys(priceInfo).some(field => moreFields.indexOf(field) > -1);
}

function getGuestProfile() {
    return store.getState().order.orderDetails.header.guestProfile;
}

function getTokenizerUrls() {
    const { tokenizerUrlForAmex, tokenizerUrlForMasterCard, tokenizerUrlForVisa } = store.getState().order.orderDetails.header;

    const tokenizerUrls = {
        [orderUtils.CREDIT_CARD_TYPES.AMERICAN_EXPRESS.name]: tokenizerUrlForAmex,
        [orderUtils.CREDIT_CARD_TYPES.MASTERCARD.name]: tokenizerUrlForMasterCard,
        [orderUtils.CREDIT_CARD_TYPES.VISA.name]: tokenizerUrlForVisa
    };

    return tokenizerUrls;
}

function reinitializeOrder(profileId) {
    const orderDetails = store.getState().order.orderDetails;
    let payPalPaymentSelected = orderUtils.getPayPalPaymentGroup(orderDetails) || {};
    payPalPaymentSelected = payPalPaymentSelected.isComplete;

    return new Promise((resolve, reject) => {
        initializeCheckout({
            profileId: profileId,
            isPaypalFlow: payPalPaymentSelected,
            ropisCheckout: basketUtils.isPickup()
        })
            .then(data => {
                initOrderSuccess(data);
                checkoutApi
                    .getOrderDetails(data.orderId)
                    .then(newOrderDetails => {
                        store.dispatch(OrderActions.updateOrder(newOrderDetails));
                        resolve();
                    })
                    .catch(reject);
            })
            .catch(initOrderFailure);
    });
}

function setShippingMethod(shipMethodData, fireAnalytics, successCallback, onCloseCallback) {
    checkoutApi
        .setShippingMethod(shipMethodData)
        .then(() => {
            fireAnalytics();
            successCallback();
        })
        .catch(e => {
            onCloseCallback(e);
        });
}

function fireFlexiblePaymentsAnalytics(errorMessage, paymentVendor) {
    const lastAsyncPageLoadData = anaUtils.getLastAsyncPageLoadData();
    const data = {
        bindingMethods: linkTrackingError,
        errorMessages: [`${paymentVendor}:${errorMessage}`.slice(0, 100)],
        eventStrings: [anaConstants.Event.EVENT_71],
        fieldErrors: [anaConstants.PAGE_DETAIL.FLEXIBLE_PAYMENTS],
        linkName: 'error',
        usePreviousPageName: true
    };

    if (lastAsyncPageLoadData && lastAsyncPageLoadData.previousPage) {
        data.previousPage = lastAsyncPageLoadData.previousPage;
    }

    processEvent.process(anaConstants.LINK_TRACKING_EVENT, { data });
}

function isAfterpayEnabledForThisProfile(orderDetails) {
    return orderDetails.items?.isAfterpayEnabledForProfile;
}

function refreshCheckoutOrderDetails(orderId) {
    checkoutApi.getOrderDetails(orderId).then(newOrderDetails => {
        store.dispatch(OrderActions.updateOrder(newOrderDetails));
    });
}

function getDefaultShippingMethodId({ shippingMethodId, shippingMethods }) {
    return shippingMethodId || shippingMethods[0]?.shippingMethodId;
}

function computeDeliveryGroups(_shippingGroup, shippingGroupType, shippingMethod, createDeliveryGroup) {
    const items = _shippingGroup?.items || Empty.Array;

    if (createDeliveryGroup) {
        const deliveryGroup = [{ items }];

        return deliveryGroup;
    }

    let shippingGroup = _shippingGroup;

    if (shippingGroupType === SHIPPING_GROUPS.GIFT) {
        // For `GiftCardShippingGroup`, extract `estimatedMinDeliveryDate` and
        // `estimatedMaxDeliveryDate` from the shipping method and add them to `deliveryGroups`.
        shippingGroup = orderUtils.addEstimatedDeliveryToDeliveryGroups(_shippingGroup);
    }

    // The shippingMethod will be passed to the SplitEDDShippingMethod component
    // when rendering the list of shipping methods.
    // In this scenario, deliveryGroups will be computed from shippingMethod;
    // otherwise, they will be derived from shippingGroup.shippingMethod.
    const deliveryGroups = shippingMethod?.deliveryGroups || shippingGroup?.shippingMethod?.deliveryGroups;

    if (!deliveryGroups) {
        return Empty.Array;
    }

    const result = deliveryGroups.map(deliveryGroup => {
        const { promiseDate = '' } = deliveryGroup;
        const promiseDateValue = dateUtils.getPromiseDate(promiseDate);
        const extraProps = {
            promiseDateValue
        };

        const fullItemsData = [];
        const groupItems = deliveryGroup?.items || Empty.Array;

        for (const groupItem of groupItems) {
            const fullItemData = items.find(item => item?.sku?.skuId === groupItem.skuId);

            if (fullItemData) {
                fullItemsData.push({ ...fullItemData, ...groupItem });
            }
        }

        return { ...deliveryGroup, ...extraProps, items: fullItemsData };
    });

    return result;
}

function seperateItemsinDeliveryGroupByFullfullment(deliveryGroups, fullfillmentType) {
    const result = deliveryGroups.map(group => {
        const items = group?.items;
        const filteredItems = [];

        for (const item of items) {
            if (fullfillmentType === FULLFILLMENT_TYPE.AR && item.isReplenishment) {
                filteredItems.push(item);
            }

            if (fullfillmentType === FULLFILLMENT_TYPE.GIS && !item.isReplenishment) {
                filteredItems.push(item);
            }
        }

        return { ...group, items: filteredItems };
    });

    return result;
}

function getPromiseDateCutOffDescription(promiseDateCutOffDescription) {
    if (!promiseDateCutOffDescription) {
        return '';
    }

    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Checkout');
    const description = getText('ifYouOrderWithin', [promiseDateCutOffDescription.toLowerCase()]);

    return description;
}

function hasDeliveryGroups(shippingMethods = []) {
    const DELIVERY_GROUPS_KEY = 'deliveryGroups';

    if (shippingMethods.length === 0) {
        return false;
    }

    const result = shippingMethods.every(shippingMethod => {
        const deliveryGroups = shippingMethod[DELIVERY_GROUPS_KEY] || Empty.Array;

        return deliveryGroups.length > 0;
    });

    return result;
}

const checkoutUtils = {
    reinitializeOrder,
    initializeCheckout,
    initializeSignedInCheckout,
    initializeAnonymousCheckout,
    initOrderSuccess,
    initOrderFailure,
    placeOrderSuccess,
    placeOrderFailure,
    changeCheckoutUrlBasedOnOrderCompleteness,
    checkAndOrderCreditCardsUpdate,
    CHECKOUT_PATH,
    CHECKOUT_PATH_ROPIS,
    CHECKOUT_SECTIONS,
    MESSAGE_CONTEXT,
    isZeroFee,
    setShippingFee,
    isGiftCardShipOptionsComplete,
    isShipAddressComplete,
    isSameDayShipAddressComplete,
    isAccountComplete,
    isPaymentInOrderComplete,
    isPaymentSectionComplete,
    isGiftCardApplied,
    isCreditCardRequired,
    isStoreCreditApplied,
    isGiftCardAddressComplete,
    setOrderMergedMsgViewed: value => (orderMergedMsgViewed = value),
    isMoreThanJustCC,
    isGuestOrder,
    getGuestProfile,
    getTokenizerUrls,
    disablePlaceOrderButtonBasedOnCheckoutCompleteness,
    setShippingMethod,
    fireFlexiblePaymentsAnalytics,
    isAfterpayEnabledForThisProfile,
    refreshCheckoutOrderDetails,
    getDefaultShippingMethodId,
    computeDeliveryGroups,
    getPromiseDateCutOffDescription,
    hasDeliveryGroups,
    FULLFILLMENT_TYPE,
    seperateItemsinDeliveryGroupByFullfullment,
    renderFrictionlessPaymentErrorView,
    getGiftCardAmountNotEnoughMessage,
    getCreditCardRequiredMessage
};

export default checkoutUtils;
