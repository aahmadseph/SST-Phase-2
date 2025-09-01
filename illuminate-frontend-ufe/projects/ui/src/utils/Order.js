import skuUtils from 'utils/Sku';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import safelyReadProperty from 'analytics/utils/safelyReadProperty';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import Empty from 'constants/empty';
import { DELIVERY_METHOD_TYPES } from 'constants/RwdBasket';
import Helpers from 'utils/Helpers';
import Actions from 'Actions';
import FormsUtils from 'utils/Forms';
import OrderUtils from 'utils/Order';

// const store = require('Store').default;
// Do not require ^^^ 'Store' module here like this because
// it can be not initialized at the time when current module is required
//
// Example:
//  app.js =>
//      require('ReduxProvider.jsx') =>
//          require('Store.js') =>
//              require('reducers.js') =>
//                  require('reducers/order.js') =>
//                      require('utils/Order.js') =>
//                          require('Store.js') - here is a circular dependency!!! :-(
//
// Because of that 'store' const at line #6 will be initialized with empty object and
// invocation of store.getState() from any util function will lead to exception.
// We should never ever use/work with Redux state via direct reference to "require('Store')" in new files/code
// From 07.21.2021 project uses 'react-redux' library so please use 'connect' function to read data from store.
// From now ^^^ this is the only correct way of getting data from Redux store for new implementations.
// If you think you need "require('Store')" in your new file then probably you are doing something wrong!

// Workaround for getting access to Redux store for old code if you have circular dependency issue.
const getStoreState = () => require('store/Store').default.getState();

const { getProp } = Helpers;
const BASKET_TYPES = {
    PREBASKET: 'prebasket',
    DC_BASKET: 'distribution center basket',
    ROPIS_BASKET: 'reserve and pick up basket',
    BOPIS_BASKET: 'buy online and pick up basket',
    SAMEDAY_BASKET: 'SameDay',
    STANDARD_BASKET: 'ShipToHome'
};

const ORDER_TYPES = {
    STANDARD: 'standard',
    SAME_DAY: 'same day',
    BOPIS: 'bopis'
};

const ROPIS_CONSTANTS = {
    ORDER_STATUS: {
        COMPLETED: 'completed',
        ACTIVE: 'active',
        PENDING: 'pending'
    },
    HEADER_LEVEL_ORDER_STATUS: {
        PICKED_UP: 'Picked Up',
        READY_FOR_PICK_UP: 'Ready for Pickup',
        PROCESSING: 'Processing',
        CANCELED: 'Canceled'
    },
    PICKUP_METHOD_IDS: {
        IN_STORE: '0',
        CURBSIDE_CONCIERGE: '1'
    }
};

const HEADER_LEVEL_SDD_ORDER_STATUS = {
    PROCESSING: 'Processing',
    ON_ITS_WAY: 'On Its Way',
    DELIVERED: 'Delivered'
};

const HEADER_LEVEL_STANDARD_ORDER_STATUS = {
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered'
};

const PAYMENT_GROUP_TYPE = {
    CREDIT_CARD: 'CreditCardPaymentGroup',
    DEBIT_CARD: 'DebitCardPaymentGroup',
    STORE_CREDIT: 'StoreCreditPaymentGroup',
    GIFT_CARD: 'GiftCardPaymentGroup',
    EGIFT_CARD: 'ElectronicGiftCardPaymentGroup',
    PAYPAL: 'PayPalPaymentGroup',
    APPLEPAY: 'ApplePayPaymentGroup',
    KLARNA: 'KlarnaPaymentGroup',
    AFTERPAY: 'AfterpayPaymentGroup',
    PAZE: 'PazePaymentGroup',
    VENMO: 'VenmoPaymentGroup',
    CASH: 'Cash'
};

const PAYMENT_FLAGS = {
    isPayWithPayPal: PAYMENT_GROUP_TYPE.PAYPAL,
    isPayWithApplePay: PAYMENT_GROUP_TYPE.APPLEPAY,
    isPayWithKlarna: PAYMENT_GROUP_TYPE.KLARNA,
    isPayWithAfterpay: PAYMENT_GROUP_TYPE.AFTERPAY,
    isPayWithPaze: PAYMENT_GROUP_TYPE.PAZE,
    isPayWithVenmo: PAYMENT_GROUP_TYPE.VENMO,
    isNewUserPayWithCreditCard: PAYMENT_GROUP_TYPE.CREDIT_CARD
};

const PAYMENT_MESSAGES = {
    CREDITCARD_REQUIRED: 'checkout.replenishment.creditcard.required',
    GIFTCARD_NOT_ENOUGH: 'payment.GC.not.enough'
};

const SHIPPING_GROUPS = {
    HARD_GOOD: 'HardGoodShippingGroup',
    GIFT: 'GiftCardShippingGroup',
    ELECTRONIC: 'ElectronicShippingGroup',
    SAME_DAY: 'SameDayShippingGroup',
    SDU_ELECTRONIC: 'SDUElectronicShippingGroup'
};

const SHIPPING_METHOD_TYPES = {
    PLAY: 'Play! by Sephora',
    SAME_DAY: 'Same Day Delivery',
    SCHEDULED_SAME_DAY: 'Schedule a Delivery Window',
    FREE_ROUGE_SAME_DAY: 'Free Rouge Same Day Delivery',
    HAL: 'HAL'
};

const SHIPPING_METHOD_ID = {
    PLAY_SHIP_METHOD_ID: ['9000030', '9000031', '9000032', '9000033', '9000034'],
    SCHEDULED_SAME_DAY: '11000115'
};

const PAYMENT_TYPE = {
    CREDIT_CARD: {
        sephora: 'sephora',
        visa: 'visa',
        masterCard: 'master-card',
        americanExpress: 'american-express',
        discover: 'discover'
    },
    DEBIT_CARD: {
        debit: 'debit',
        visa: 'visa',
        masterCard: 'master-card',
        americanExpress: 'american-express',
        discover: 'discover'
    },
    OTHER: {
        storeCredit: PAYMENT_GROUP_TYPE.STORE_CREDIT,
        payPal: PAYMENT_GROUP_TYPE.PAYPAL,
        applePay: PAYMENT_GROUP_TYPE.APPLEPAY,
        klarna: PAYMENT_GROUP_TYPE.KLARNA,
        afterpay: PAYMENT_GROUP_TYPE.AFTERPAY,
        giftCard: PAYMENT_GROUP_TYPE.GIFT_CARD,
        egiftCard: PAYMENT_GROUP_TYPE.EGIFT_CARD,
        paze: PAYMENT_GROUP_TYPE.PAZE,
        venmo: PAYMENT_GROUP_TYPE.VENMO,
        cash: PAYMENT_GROUP_TYPE.CASH
    }
};

const CREDIT_CARD_TYPES = {
    SEPHORA: {
        name: 'sephora',
        displayName: 'Sephora Card'
    },
    VISA: {
        name: 'visa',
        displayName: 'VISA'
    },
    MASTERCARD: {
        name: 'masterCard',
        displayName: 'MasterCard'
    },
    DISCOVER: {
        name: 'discover',
        displayName: 'Discover'
    },
    AMERICAN_EXPRESS: {
        name: 'americanExpress',
        displayName: 'American Express'
    }
};

const ALL_CARD_TYPES = Object.assign(
    {
        [SEPHORA_CARD_TYPES.PRIVATE_LABEL]: {
            name: 'sephora',
            displayName: SEPHORA_CARD_TYPES.PRIVATE_LABEL
        },
        [SEPHORA_CARD_TYPES.PRIVATE_LABEL_TEMP]: {
            name: 'sephora',
            displayName: SEPHORA_CARD_TYPES.PRIVATE_LABEL_TEMP
        },
        [SEPHORA_CARD_TYPES.CO_BRANDED]: {
            name: 'sephora',
            displayName: SEPHORA_CARD_TYPES.CO_BRANDED
        },
        [SEPHORA_CARD_TYPES.CO_BRANDED_TEMP]: {
            name: 'sephora',
            displayName: SEPHORA_CARD_TYPES.CO_BRANDED_TEMP
        }
    },
    CREDIT_CARD_TYPES
);

const PAYMENT_GROUPS = { CREDIT_CARD: 'CreditCardPaymentGroup' };

const ORDER_TRACKING_BUTTON_STATES = {
    PENDING: 'Pending',
    CANCELED: 'Cancelled',
    ACTIVE: 'Active',
    DELIVERED: 'Delivered'
};

const ZERO_CHECKOUT_OPTIONS = {
    US: '$0.00',
    CA_EN: '$0.00',
    CA_FR: '0,00 $'
};

const CARD_TYPES = {
    CreditCard: 'CreditCardPaymentGroup',
    PayPal: 'PayPalPaymentGroup',
    Klarna: 'KlarnaPaymentGroup',
    Afterpay: 'AfterpayPaymentGroup',
    Paze: 'Paze',
    Venmo: 'VenmoPaymentGroup'
};

const TAX_TYPES = ['pifFee', 'southEEAfee', 'franchiseFee'];

const ORDER_DETAILS_REQUESTS_ORIGIN = {
    ORD_DETAILS_PAGE: 'ORD_DETAILS',
    ORD_CONFIRMATION_PAGE: 'ORD_CONFIRM'
};

const paymentGroupOptions = () => {
    return {
        [CARD_TYPES.PayPal]: {
            img: {
                alt: 'Pay Pal',
                logo: 'payPal'
            },
            text: 'paypalAccount'
        },
        [CARD_TYPES.Venmo]: {
            img: {
                alt: 'Venmo',
                logo: 'venmo'
            },
            text: 'venmoAccount'
        },
        [CARD_TYPES.Klarna]: {
            img: {
                alt: 'Klarna',
                logo: 'klarna'
            },
            text: 'paidWith'
        },
        [CARD_TYPES.Afterpay]: {
            img: {
                alt: 'Afterpay',
                logo: localeUtils.isUS() ? 'no-border/afterpaycashapp' : 'afterpay'
            },
            text: 'paidWith'
        },
        [CARD_TYPES.Paze]: {
            img: {
                alt: 'Paze',
                logo: 'paze'
            },
            text: 'paidWith'
        }
    };
};

function isAlternativePaymentMethod(paymentGroupType, paymentGroup) {
    return (
        paymentGroupType === CARD_TYPES.PayPal ||
        (paymentGroup.isApplePay && paymentGroup.paymentDisplayInfo) ||
        (paymentGroup.isPaze && paymentGroup.paymentDisplayInfo) ||
        paymentGroupType === CARD_TYPES.Klarna ||
        paymentGroupType === CARD_TYPES.Afterpay ||
        paymentGroupType === CARD_TYPES.Venmo ||
        paymentGroupType === CARD_TYPES.Paze
    );
}

function alternativePaymentAltSrc(paymentGroupType, paymentGroup) {
    const alt = paymentGroup.isApplePay ? 'Apple Pay' : paymentGroup.isPaze ? 'Paze' : paymentGroupOptions()[paymentGroupType].img.alt;
    const src = `/img/ufe/payments/${
        paymentGroup.isApplePay ? 'applePay' : paymentGroup.isPaze ? 'paze' : paymentGroupOptions()[paymentGroupType].img.logo
    }.svg`;

    return {
        alt,
        src
    };
}

function alternativePaymentText(paymentGroupType, paymentGroup) {
    return paymentGroup.isApplePay
        ? 'applePay'
        : paymentGroup.isPaze
            ? paymentGroupOptions()[paymentGroup.paymentDisplayInfo].text
            : paymentGroupOptions()[paymentGroupType].text;
}

function alternativePaymentInfo(paymentGroupType, paymentGroup) {
    if (paymentGroup.isApplePay || paymentGroup.isPaze) {
        return paymentGroup.paymentDisplayInfo;
    } else if (paymentGroupType === CARD_TYPES.PayPal) {
        return paymentGroup.email;
    } else if (paymentGroupType === CARD_TYPES.Klarna) {
        return 'Klarna';
    } else if (paymentGroupType === CARD_TYPES.Afterpay) {
        return 'Afterpay';
    } else if (paymentGroupType === CARD_TYPES.Venmo) {
        return paymentGroup.email;
    } else {
        return '';
    }
}

function isDisabled(status) {
    return status === ORDER_TRACKING_BUTTON_STATES.PENDING || status === ORDER_TRACKING_BUTTON_STATES.CANCELED;
}

function isActive(status) {
    return status === ORDER_TRACKING_BUTTON_STATES.ACTIVE;
}

function isCanceled(status) {
    return status === ORDER_TRACKING_BUTTON_STATES.CANCELED;
}

function isDelivered(status) {
    return status === ORDER_TRACKING_BUTTON_STATES.DELIVERED;
}

function getShipmentDate(orderData) {
    return orderData.shippingGroups[0].shipmentDate;
}

function getOrderTotal() {
    const priceInfo = getStoreState().order.orderDetails.priceInfo;

    return priceInfo.orderTotal;
}

function getCreditCardTotal(orderDetails) {
    const details = orderDetails || getStoreState().order.orderDetails;

    return details.priceInfo.creditCardAmount;
}

function getPayPalAmount(orderDetails) {
    const details = orderDetails || getStoreState().order.orderDetails;

    return details.priceInfo.paypalAmount;
}

function getOrderId() {
    const { header = {} } = getStoreState().order.orderDetails;

    return header.orderId;
}

function getSelfCancelationReasons() {
    const { header = {} } = getStoreState().order.orderDetails;

    return header.selfCancellationReasonCodes;
}

function getOrderDetailsUrl(orderId) {
    return `/profile/orderdetail/${orderId}`;
}

function getAllPurchasesUrl() {
    return '/account/orders/';
}

function getOrderHistoryUrl() {
    return '/profile/MyAccount/Orders';
}

// used in my account for play
function getPaymentDisplayInfo(paymentData) {
    if (paymentData.paymentGroupsEntries && paymentData.paymentGroupsEntries.length) {
        if (paymentData.paymentGroupsEntries[0].paymentGroupType === 'PayPalPaymentGroup') {
            return 'PayPal Account ' + paymentData.paymentGroupsEntries[0].paymentGroup.email;
        } else {
            return paymentData.paymentGroupsEntries[0].paymentGroup.paymentDisplayInfo;
        }
    }

    return false;
}

function getCreditCardPaymentGroup(orderDetails) {
    const paymentGroupsEntries = orderDetails.paymentGroups && orderDetails.paymentGroups.paymentGroupsEntries;

    if (paymentGroupsEntries) {
        for (let i = 0; i < paymentGroupsEntries.length; i++) {
            if (paymentGroupsEntries[i].paymentGroupType === PAYMENT_GROUPS.CREDIT_CARD) {
                return paymentGroupsEntries[i].paymentGroup;
            }
        }
    }

    return null;
}

function getAvailablePaymentLogos(isAfterpayEnabled = false, isKlarnaEnabled = false, isPayPalPayLaterEligibleEnabled = false) {
    const firstPaymentLogo = isKlarnaEnabled
        ? 'klarnaLogo'
        : isAfterpayEnabled
            ? 'afterpayLogo'
            : isPayPalPayLaterEligibleEnabled
                ? 'paypalLogo'
                : undefined;

    const secondPaymentLogo = isKlarnaEnabled
        ? isAfterpayEnabled
            ? 'afterpayLogo'
            : isPayPalPayLaterEligibleEnabled
                ? 'paypalLogo'
                : undefined
        : isAfterpayEnabled
            ? isPayPalPayLaterEligibleEnabled
                ? 'paypalLogo'
                : undefined
            : undefined;

    const thirdPaymentLogo = isKlarnaEnabled
        ? isAfterpayEnabled
            ? isPayPalPayLaterEligibleEnabled
                ? 'paypalLogo'
                : undefined
            : undefined
        : undefined;

    return [firstPaymentLogo, secondPaymentLogo, thirdPaymentLogo];
}

function getPayPalPaymentGroup(orderDetails) {
    const paymentGroupsEntries = orderDetails.paymentGroups && orderDetails.paymentGroups.paymentGroupsEntries;

    if (paymentGroupsEntries) {
        for (let i = 0; i < paymentGroupsEntries.length; i++) {
            if (paymentGroupsEntries[i].paymentGroupType === PAYMENT_GROUP_TYPE.PAYPAL) {
                return paymentGroupsEntries[i].paymentGroup;
            }
        }
    }

    return null;
}

function getPaymentGroup(orderDetails, type) {
    const entry = (orderDetails.paymentGroups?.paymentGroupsEntries || []).find(x => x.paymentGroupType === type);

    return entry ? entry.paymentGroup : null;
}

function getGiftCardPaymentGroups(orderDetails) {
    const giftCardPaymentGroups = [];
    const paymentGroupsEntries = orderDetails.paymentGroups && orderDetails.paymentGroups.paymentGroupsEntries;

    if (paymentGroupsEntries) {
        for (let i = 0; i < paymentGroupsEntries.length; i++) {
            if (paymentGroupsEntries[i].paymentGroupType === PAYMENT_GROUP_TYPE.GIFT_CARD) {
                giftCardPaymentGroups.push(paymentGroupsEntries[i].paymentGroup);
            }
        }
    }

    return giftCardPaymentGroups;
}

function getStoreCredits(orderDetails) {
    return (orderDetails.paymentGroups && orderDetails.paymentGroups.storeCredits) || [];
}

function getTrackingUrl(orderDetails) {
    const trackingUrl = orderDetails.shippingGroups.filter(group => !!group.trackingUrl);

    return trackingUrl.length > 0 ? trackingUrl[0].trackingUrl : null;
}

function getCreditCardAddress(orderDetails) {
    const creditCardGroup = getCreditCardPaymentGroup(orderDetails);

    if (creditCardGroup) {
        return creditCardGroup.address;
    }

    return false;
}

function allowUpdatedShippingCalculationsMsg(orderDetails) {
    const shipGroups = orderDetails.shippingGroups;

    return shipGroups.isPromiseDateInfoNoteEnabled;
}

function getShippingGroup(orderDetails, shippingType) {
    const shipGroupsEntries = orderDetails?.shippingGroups?.shippingGroupsEntries;

    if (shipGroupsEntries) {
        for (let i = 0; i < shipGroupsEntries.length; i++) {
            if (shipGroupsEntries[i].shippingGroupType === shippingType) {
                return shipGroupsEntries[i].shippingGroup;
            }
        }
    }

    return null;
}

function getHardGoodShippingGroup(orderDetails) {
    return getShippingGroup(orderDetails, SHIPPING_GROUPS.HARD_GOOD);
}

function getElectronicsShippingGroup(orderDetails) {
    return getShippingGroup(orderDetails, SHIPPING_GROUPS.ELECTRONIC);
}

function getSameDayShippingGroup(orderDetails) {
    return getShippingGroup(orderDetails, SHIPPING_GROUPS.SAME_DAY);
}

function getHardGoodShippingAddress(orderDetails) {
    const hardGoodShipGroup = getHardGoodShippingGroup(orderDetails);

    if (hardGoodShipGroup) {
        return hardGoodShipGroup.address;
    }

    return null;
}

function getBasket(basketType, orderDetails) {
    return (orderDetails.items?.itemsByBasket || []).find(item => item.basketType === basketType) || Empty.Object;
}

function getSameDayDeliveryBasket(orderDetails) {
    return getBasket(BASKET_TYPES.SAMEDAY_BASKET, orderDetails);
}

function getStandardBasket(orderDetails) {
    return getBasket(BASKET_TYPES.STANDARD_BASKET, orderDetails);
}

function hasSameDayDeliveryItems(orderDetails) {
    const sddBasket = getSameDayDeliveryBasket(orderDetails);

    return (sddBasket.items || []).length > 0;
}

function hasStandardDeliveryItems(orderDetails) {
    const basket = getStandardBasket(orderDetails);

    return (basket.items || []).length > 0;
}

function hasStandardNonAutoReplenishItems(orderDetails) {
    const basket = getStandardBasket(orderDetails);

    return basket.items.some(item => !item.isReplenishment);
}

function isSDUOnlyOrder(orderDetails) {
    const { itemCount } = orderDetails.items;
    const sddBasket = getSameDayDeliveryBasket(orderDetails);

    return itemCount === 1 && sddBasket.items && sddBasket.items[0].sku.type === 'SDU';
}

function hasSDUOnlyInSddBasket(orderDetails) {
    const sddBasket = getSameDayDeliveryBasket(orderDetails);

    return sddBasket.items?.length === 1 && sddBasket.items[0].sku.type === 'SDU';
}

function getSameDayShippingAddress(orderDetails) {
    const sameDayShipGroup = getSameDayShippingGroup(orderDetails);

    if (sameDayShipGroup) {
        return sameDayShipGroup.address;
    }

    return null;
}

function getNonPromoItemsCount(orderDetails) {
    let itemsCount = orderDetails.items.itemCount;
    orderDetails.items.items.forEach(item => {
        if (skuUtils.isGwp(item.sku)) {
            itemsCount--;
        }
    });

    return itemsCount;
}

function getBasketLevelRewardMessage() {
    const { items = {} } = getStoreState().order.orderDetails;
    const basketLevelRWmessage =
        items.basketLevelMessages && items.basketLevelMessages.filter(msg => msg.messageContext === 'basket.RWPromoUsageMsg');

    return basketLevelRWmessage && basketLevelRWmessage.length ? basketLevelRWmessage[0].messages.join(',') : '';
}

function isZeroPrice(price) {
    const zeroOptions = Object.values(ZERO_CHECKOUT_OPTIONS);

    return !price || zeroOptions.some(opt => price.indexOf(opt) === 0);
}

function isZeroCheckout() {
    return isZeroPrice(getOrderTotal());
}

// all of the helper functions below are from
// mobile-web/public/js/app/resources/checkout/Order.js

function isPlayOrder() {
    const { header = {} } = getStoreState().order.orderDetails;

    return header.isPlaySubscriptionOrder;
}

function isPlayEditOrder() {
    const { header = {} } = getStoreState().order.orderDetails;

    return header.isPlaySubscriptionUpdateOrder;
}

function isPlayTCChecked() {
    const editData = getStoreState().editData || {};

    return editData[FormsUtils.FORMS.CHECKOUT.PLAY_TC_CHECKBOX];
}

function getPhysicalGiftCardShippingGroup(orderDetails) {
    const shipGroupEntries = orderDetails.shippingGroups?.shippingGroupsEntries;

    if (shipGroupEntries) {
        for (let i = 0; i < shipGroupEntries.length; i++) {
            if (shipGroupEntries[i].shippingGroupType === SHIPPING_GROUPS.GIFT) {
                return shipGroupEntries[i].shippingGroup;
            }
        }
    }

    return null;
}

function getPromisedDelivery(shippingGroup) {
    const promiseDate = getProp(shippingGroup, 'shippingMethod.promiseDate', false);

    if (promiseDate) {
        return dateUtils.getPromiseDate(promiseDate, true);
    }

    return null;
}

function getEstimatedDelivery(shippingGroup) {
    const shipMethod = shippingGroup.shippingMethod;

    if (shipMethod && shipMethod.shippingMethodId && SHIPPING_METHOD_ID.PLAY_SHIP_METHOD_ID.some(id => shipMethod.shippingMethodId === id)) {
        return `${shipMethod.shippingMethodType} ${shipMethod.shippingMethodDescription}`;
    } else if (shipMethod) {
        const { estimatedMinDeliveryDate, estimatedMaxDeliveryDate } = shipMethod;

        const estimatedMinDate = dateUtils.getEstimatedDeliveryString(estimatedMinDeliveryDate);
        const estimatedMaxDate = dateUtils.getEstimatedDeliveryString(estimatedMaxDeliveryDate);

        return estimatedMinDeliveryDate === estimatedMaxDeliveryDate ? estimatedMinDate : `${estimatedMinDate} to ${estimatedMaxDate}`;
    } else {
        return null;
    }
}

function isFreeRougeSameDayDelivery(sameDayDeliveryMethod) {
    return sameDayDeliveryMethod.shippingMethodType === SHIPPING_METHOD_TYPES.FREE_ROUGE_SAME_DAY;
}

function isElectronicShippingGroup(shippingGroup) {
    const shipGroupType = shippingGroup.shippingGroupType;

    if (shipGroupType === SHIPPING_GROUPS.ELECTRONIC) {
        return true;
    }

    return false;
}

function isShippableOrder(orderDetails) {
    const { HARD_GOOD, GIFT } = SHIPPING_GROUPS;
    const shipGroupsEntries = orderDetails.shippingGroups?.shippingGroupsEntries;

    if (shipGroupsEntries) {
        return shipGroupsEntries.some(group => {
            return [HARD_GOOD, GIFT].indexOf(group.shippingGroupType) > -1;
        });
    } else {
        return false;
    }
}

function isGiftCardOnly() {
    const orderDetails = getStoreState().order.orderDetails;
    const shipGroupsEntries = orderDetails.shippingGroups?.shippingGroupsEntries;
    let isGCOnly = typeof shipGroupsEntries !== 'undefined';

    if (shipGroupsEntries) {
        for (let i = 0; i < shipGroupsEntries.length; i++) {
            const group = shipGroupsEntries[i];

            if (group.shippingGroupType !== SHIPPING_GROUPS.GIFT) {
                isGCOnly = false;

                break;
            }
        }
    }

    return isGCOnly;
}

function isHazardous(orderItems = []) {
    return !!orderItems.filter(item => item.sku.isHazmat).length;
}

function isRestrictedInCalifornia(orderItems = []) {
    return !!orderItems.filter(item => item.sku.isProp65).length;
}

function userHasSavedPayPalAccount(orderDetails) {
    //Need to check that profile exists in case of guest checkout
    return orderDetails.header.profile && orderDetails.header.profile.hasSavedPaypal;
}

function getGuestEmail(orderDetails) {
    return orderDetails.header.guestProfile && orderDetails.header.guestProfile.email;
}

function containsRestrictedItem() {
    const orderItems = getStoreState().order.orderDetails.items.items;

    return !!orderItems.filter(item => item.sku.isPaypalRestricted).length;
}

function getAvailableBiPoints() {
    const basket = getStoreState().order.orderDetails.items;

    return basket.netBeautyBankPointsAvailable ? basket.netBeautyBankPointsAvailable : 0;
}

function getGuestAvailableBiPoints() {
    const basket = getStoreState().order.orderDetails.items;

    return basket.potentialBeautyBankPoints ? basket.potentialBeautyBankPoints : 0;
}

function isPayPalSaveToAccountChecked() {
    const orderDetails = getStoreState().order.orderDetails;

    //need to return true if user has saved paypal account so that
    //if user updates to a new paypal account it saves to profile
    //otherwise we need to check if 'save to account' box has been checked
    if (userHasSavedPayPalAccount(orderDetails)) {
        return true;
    } else {
        const editData = getStoreState().editData || {};

        return editData[FormsUtils.FORMS.CHECKOUT.PAYPAL_SAVE_CHECKBOX];
    }
}

function getGlobalPromoCount(items) {
    let promoCount = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].isGlobalPromotion) {
            promoCount++;
        }
    }

    return promoCount;
}

function getThirdPartyCreditCard(creditCard) {
    const cardType = creditCard?.cardType?.toLowerCase();

    const cardDetected = Object.keys(ALL_CARD_TYPES).find(card => ALL_CARD_TYPES[card].displayName.toLowerCase() === cardType);

    return cardDetected ? ALL_CARD_TYPES[cardDetected].name : '';
}

function getCardTypeDisplayName(cardTypeName) {
    const cardType = cardTypeName?.toLowerCase();

    const cardDetected = Object.keys(ALL_CARD_TYPES).find(card => ALL_CARD_TYPES[card].name.toLowerCase() === cardType);

    return cardDetected ? ALL_CARD_TYPES[cardDetected].displayName : '';
}

function isShipmentRestriction(orderDetails) {
    let shippingRestrictionMessages;
    const hardGoodShippingGroup = getHardGoodShippingGroup(orderDetails);

    if (hardGoodShippingGroup && hardGoodShippingGroup.shipmentWarningMessages) {
        shippingRestrictionMessages = hardGoodShippingGroup.shipmentWarningMessages.filter(message => {
            return message.messageContext === 'shippingRestriction';
        });
    }

    return shippingRestrictionMessages && !!shippingRestrictionMessages.length;
}

function isPayPalEnabled(orderDetails) {
    return orderDetails.header?.isPaypalPaymentEnabled && Sephora.configurationSettings.isPayPalEnabled;
}

function hasAmountDue(orderDetails) {
    return !!getCreditCardTotal(orderDetails) || !!getPayPalAmount(orderDetails);
}

function isKlarnaEnabledForThisOrder(orderDetails) {
    const details = orderDetails || getStoreState().order.orderDetails;

    return details.items?.isKlarnaCheckoutEnabled && hasAmountDue(details);
}

function isAfterpayEnabledForThisOrder(orderDetails) {
    const details = orderDetails || getStoreState().order.orderDetails;

    return details.items?.isAfterpayCheckoutEnabled && hasAmountDue(details);
}

function isPazeEnabledForThisOrder(orderDetails) {
    const details = orderDetails || getStoreState().order.orderDetails;

    return details.items?.isPazeCheckoutEnabled;
}

// eslint-disable-next-line no-unused-vars
function isVenmoEnabledForThisOrder(orderDetails) {
    const hasAutoReplenishItemInBasket = OrderUtils.hasAutoReplenishItems(orderDetails);
    const hasSDUIn = OrderUtils.hasSDUInBasket(orderDetails);
    const hasSubscriptionItems = hasAutoReplenishItemInBasket || hasSDUIn;
    // TODO VENMO: NOT YET IMPLEMENTED BY BACKEND
    const details = orderDetails || getStoreState().order.orderDetails;
    const isVenmoEnabledFromCnc = details?.items?.isVenmoEligible;

    return !this.isZeroCheckout() && isVenmoEnabledFromCnc && !hasSubscriptionItems;
}

function hasPromoCodes(orderDetails) {
    const details = orderDetails ? orderDetails : getStoreState().order.orderDetails;
    const appliedPromotions = details.promotion && details.promotion.appliedPromotions ? details.promotion.appliedPromotions : [];

    return appliedPromotions.length > 0;
}

function shouldShowPromotion() {
    const isPlayCheckout = this.isPlayOrder() || this.isPlayEditOrder();

    return !isPlayCheckout && (!this.isZeroCheckout() || this.hasPromoCodes()) && !this.isGiftCardOnly();
}

const detectSephoraCard = card => {
    const { sephCBVIBinRange, sephPLCCBinRange } = Sephora.fantasticPlasticConfigurations;

    const ranges = {
        [sephCBVIBinRange]: SEPHORA_CARD_TYPES.CO_BRANDED,
        [sephPLCCBinRange]: SEPHORA_CARD_TYPES.PRIVATE_LABEL
    };

    const binRange = String(card).substring(0, 6);

    return ranges[binRange];
};

const whichSephoraCard = type => card => detectSephoraCard(card) === type;
const isCoBranded = whichSephoraCard(SEPHORA_CARD_TYPES.CO_BRANDED);
const isPrivateLabel = whichSephoraCard(SEPHORA_CARD_TYPES.PRIVATE_LABEL);

const isSephoraCardNumber = card => detectSephoraCard(card) !== undefined;

function isSephoraCardType(creditCard) {
    const sephoraCardTypes = Object.values(SEPHORA_CARD_TYPES);

    return creditCard && sephoraCardTypes.indexOf(creditCard.cardType) !== -1;
}

function isSephoraTempCardType(creditCard) {
    const sephoraTempCardTypes = [SEPHORA_CARD_TYPES.PRIVATE_LABEL_TEMP, SEPHORA_CARD_TYPES.CO_BRANDED_TEMP];

    return creditCard && sephoraTempCardTypes.indexOf(creditCard.cardType) !== -1;
}

function getTempSephoraCardMessage() {
    const orderDetails = getStoreState().order.orderDetails;
    const headerPaymentGroups = orderDetails.header.paymentGroups || [];

    for (let i = 0; i < headerPaymentGroups.length; i++) {
        const group = headerPaymentGroups[i];

        if (group.tempSephCardUsageMsg && group.tempSephCardUsageMsg.length) {
            return group.tempSephCardUsageMsg[0];
        }
    }

    return null;
}

function getMerchandiseSubtotalAsNumber() {
    const merchSubTotal = getStoreState().order.orderDetails.priceInfo.merchandiseSubtotal || '0.00';

    return isZeroCheckout() ? 0 : Number(merchSubTotal.replace(/[^0-9.,-]+/g, '').replace(/,/g, ''));
}

function hasRRC(orderDetails) {
    return orderDetails.promotion.appliedPromotions.some(promo => promo.displayName === 'Rouge Reward');
}

function hasCCR(orderDetails) {
    return orderDetails.promotion.appliedPromotions.some(promo => promo.promotionType === 'CCR');
}

function getZipCode(shipGroups) {
    let zipCode = '';

    for (const group of shipGroups) {
        if (safelyReadProperty('shippingGroup.address.postalCode', group) !== '') {
            zipCode += safelyReadProperty('shippingGroup.address.postalCode', group);

            break;
        }
    }

    return zipCode;
}

async function showOrderCancelationModal(orderId) {
    //Will be part of circular dependency refactor
    const { dispatch } = (await import(/* webpackMode: "eager" */ 'store/Store')).default;
    dispatch(Actions.showOrderCancelationModal(true, orderId, getSelfCancelationReasons()));
}

function hasHalAddress(details) {
    const orderDetails = details || getStoreState().order.orderDetails;
    const shipGroupsEntries = orderDetails?.shippingGroups?.shippingGroupsEntries || [];
    const result = shipGroupsEntries.some(shipGroupEntry => shipGroupEntry?.shippingGroup?.address?.addressType === SHIPPING_METHOD_TYPES.HAL);

    return result;
}

function hasHalDraftAddress(orderDetails) {
    const orderHasHalAddress = hasHalAddress(orderDetails);

    if (orderHasHalAddress) {
        const hardGoodShippingGroup = getHardGoodShippingGroup(orderDetails);
        const isDraft = Boolean(hardGoodShippingGroup?.address?.isDraft);

        return isDraft;
    }

    return false;
}

function isHalAddress(address = {}) {
    // This function checks if addressType is 'HAL'(FEDEX)
    // This function checks from the address sent
    const addressType = address?.addressType;

    return addressType === SHIPPING_METHOD_TYPES.HAL;
}

function isHalAvailable(isHalAvailableInOrder, isCAPAvailable) {
    /*
        https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=345335309

        CAAP should be proposed to the user if
            util/configuration.isCapEnabled=true and
            util/configuration.isRampupEnabled=true and
            profileEligibleAPI.eligible=true and
            order.isHalAvailable=true
        CAAP should be proposed to the user if
            util/configuration.isRampupEnabled=false and
            util/configuration.isCapEnabled=true and
            order.isHalAvailable=true
        CAAP should not be proposed otherwise.

        For US, just check for isHalAvailable which comes from
        orderDetails.header
    */
    const { isCapEnabled, isRampupEnabled } = Sephora.configurationSettings;

    if (localeUtils.isCanada()) {
        if (isCapEnabled) {
            if (isRampupEnabled) {
                return isHalAvailableInOrder && isCAPAvailable;
            } else {
                return isHalAvailableInOrder;
            }
        } else {
            return false;
        }
    }

    // US Orders
    return isHalAvailableInOrder;
}

function whatDefaultAddressAfterHal(isGuestOrder) {
    // this function determines what default value addresses should have
    // on orderdetails if user selects a different address other than
    // a hal address
    return isGuestOrder ? undefined : {};
}

function getSameDayShippingMethod(orderShippingMethods) {
    return orderShippingMethods.find(
        shipMethod =>
            shipMethod.shippingMethodType === SHIPPING_METHOD_TYPES.SAME_DAY ||
            shipMethod.shippingMethodType === SHIPPING_METHOD_TYPES.FREE_ROUGE_SAME_DAY
    );
}

function getScheduledSameDayShippingMethod(orderShippingMethods) {
    return orderShippingMethods.find(shipMethod => shipMethod.shippingMethodType === SHIPPING_METHOD_TYPES.SCHEDULED_SAME_DAY);
}

function hasAutoReplenishItems(orderDetails) {
    const details = orderDetails || getStoreState().order.orderDetails;

    return details?.items?.items?.some(item => item.isReplenishment);
}

function hasSDUInBasket(orderDetails) {
    return orderDetails?.items?.items?.some(item => item.sku.type === 'SDU');
}

function allItemsInBasketAreReplen(orderDetails) {
    return orderDetails.items?.items?.every(item => item.isReplenishment);
}

function getOccupationalTax(orderDetails) {
    const priceInfo = orderDetails?.priceInfo;

    const occupationalTaxItems = {};

    for (const item in priceInfo) {
        if (Object.hasOwnProperty.call(priceInfo, item)) {
            const value = priceInfo[item];

            if (TAX_TYPES.includes(item)) {
                occupationalTaxItems[item] = value;
            }
        }
    }

    return occupationalTaxItems;
}

function getPaymentNameByType(paymentType) {
    return Object.keys(PAYMENT_TYPE.OTHER).find(x => paymentType.indexOf(PAYMENT_TYPE.OTHER[x]) !== -1) || Empty.String;
}

function getRDF({
    feesAsArray = [], priceInfo = {}, orderDetails = {}, isCheckout = false, isOrderConfirmation = false
}) {
    const shipGroupsEntries = orderDetails?.shippingGroups?.shippingGroupsEntries;
    const hasSameDayDeliveryShippingGroup = getSameDayShippingGroup(orderDetails);
    const maxShippingGroupEntries = hasSDUInBasket(orderDetails) ? 3 : hasSameDayDeliveryShippingGroup ? 2 : 0;

    // Either for SDD only or SDD + other Shipping Group, we want to grab the total RDF since currently we display a combined order total section
    if (shipGroupsEntries?.length <= maxShippingGroupEntries || isCheckout || !isOrderConfirmation) {
        const feeFound = feesAsArray.find(fee => fee.feeName === 'RDF');
        const returnFee = feeFound || {};

        return returnFee.feeAmount;
    } else {
        // If not the case above, we grab the individual RDFs from the shipping groups since each order
        // total section is displayed separately for each shipping group
        return priceInfo.retailDeliveryFee;
    }
}

function isItemInOrder(skuId) {
    const { items = {} } = getStoreState().order.orderDetails;

    if (items?.itemCount > 0) {
        return items.items.filter(item => item.sku.skuId === skuId).length > 0;
    } else {
        return false;
    }
}

function getItemsByType(type) {
    const { items = {} } = getStoreState().order.orderDetails;
    const itemsByType = (items.items || []).filter(item => {
        if ((item.sku.type || '').toLowerCase() === type) {
            return true;
        }

        return false;
    });

    return itemsByType;
}

function isOrderExpired(orderDetails = {}) {
    const hasErrors = Boolean(orderDetails.priceInfo?.errorCode || orderDetails.priceInfo?.errors);

    return hasErrors;
}

function getOrderItemsWithoutSamples(orderDetails = {}) {
    const orderItems = orderDetails?.items?.items;

    const itemsWithoutSamples = (orderItems || []).filter(item => {
        if ((item.sku.type || '').toLowerCase() === skuUtils.skuTypes.SAMPLE) {
            return false;
        }

        return true;
    });

    return itemsWithoutSamples;
}

async function calculateMerchandiseSubtotal({ merchandiseSubtotal, giftCardSubtotal }) {
    // UFE must add giftCardSubtotal to overall subtotal
    // (ILLUPH-95940, AC 1.1), (INFL-1283)
    const { removeCurrency, getCurrency } = (await import(/* webpackMode: "eager" */ 'utils/Basket')).default;

    if (!giftCardSubtotal) {
        return merchandiseSubtotal;
    } else if (!merchandiseSubtotal) {
        return giftCardSubtotal;
    }

    const amount = Number(removeCurrency(merchandiseSubtotal)) + Number(removeCurrency(giftCardSubtotal));

    return getCurrency(merchandiseSubtotal) + Number(amount).toFixed(2);
}

function getStoreDetails() {
    const { storeDetails = {} } = getStoreState().order?.orderDetails?.pickup;

    return storeDetails;
}

function getOrderShippingMethod(headerArg = null, items = []) {
    const header = headerArg || getStoreState().order.orderDetails.header;
    const isAutoReplenOrder = OrderUtils.hasAutoReplenishItems({ items });

    if (isAutoReplenOrder) {
        return DELIVERY_METHOD_TYPES.AUTOREPLENISH;
    } else if (header.isBopisOrder || header.isRopisOrder) {
        return DELIVERY_METHOD_TYPES.BOPIS;
    } else if (header.isSameDayOrder) {
        return DELIVERY_METHOD_TYPES.SAMEDAY;
    } else {
        return DELIVERY_METHOD_TYPES.STANDARD;
    }
}

function isBopis() {
    const { header = {} } = getStoreState().order.orderDetails;

    return header.isBopisOrder;
}

function isSdd() {
    const { header = {} } = getStoreState().order.orderDetails;

    return header.isSameDayOrder;
}

function isShipToHome() {
    const { shippingGroups = {} } = getStoreState().order.orderDetails;

    const entries = shippingGroups.shippingGroupsEntries || Empty.Array;

    return entries.some(shippingGroupEntry => shippingGroupEntry?.shippingGroup?.shippingGroupType === SHIPPING_GROUPS.HARD_GOOD);
}

function hasSubstitutions() {
    // The containsLineSubstitutions property exists only when the order details come from OXS (Order Experience Services),
    // and indicates if the order has substitutions. If the details come from the Cart Service, though, this property is not present,
    // and we should check maxAmountToBeAuthorized. However, this value is unreliable in OXS because it should be 0 for orders
    // without substitutions, but that's not always the case, so instead we iterate through order's items.
    const items = getStoreState().order.orderDetails.items.items;

    return items.some(item => item.substituteSku !== undefined);
}

function isOrderPickedUp() {
    const order = getStoreState().order.orderDetails.header;

    return order.status === ROPIS_CONSTANTS.HEADER_LEVEL_ORDER_STATUS.PICKED_UP;
}

function isOrderProcessing() {
    const order = getStoreState().order.orderDetails.header;

    return order.status === ROPIS_CONSTANTS.HEADER_LEVEL_ORDER_STATUS.PROCESSING;
}

function isZeroDollarOrderWithCVVValidation() {
    const order = getStoreState().order;
    const { orderDetails, paymentOptions } = order;
    const hasCreditCards = (paymentOptions?.creditCards || []).length;
    const isZeroDollarOrder = isZeroCheckout();
    const noOrderComplete = !orderDetails?.header?.isComplete;

    let validation = isZeroDollarOrder && noOrderComplete;

    if (hasCreditCards) {
        const orderCreditCard = getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
        const noPaymentComplete = !orderCreditCard.isComplete;
        validation = validation && noPaymentComplete;
    }

    return validation;
}

function addEstimatedDeliveryToDeliveryGroups(shippingGroup) {
    const estimatedMinDeliveryDate = shippingGroup?.shippingMethod?.estimatedMinDeliveryDate;
    const estimatedMaxDeliveryDate = shippingGroup?.shippingMethod?.estimatedMaxDeliveryDate;

    if (estimatedMinDeliveryDate && estimatedMaxDeliveryDate && estimatedMinDeliveryDate !== estimatedMaxDeliveryDate) {
        const deliveryGroups = shippingGroup?.shippingMethod?.deliveryGroups || Empty.Array;
        const deliveryGroupsWithEstimatedDelivery = deliveryGroups.map(deliveryGroup => {
            return {
                ...deliveryGroup,
                estimatedMinDeliveryDate,
                estimatedMaxDeliveryDate,
                estimatedDeliveryDateRange: dateUtils.getEstimatedDeliveryDateRange(estimatedMinDeliveryDate, estimatedMaxDeliveryDate),
                showEstimatedDeliveryDateRange: true
            };
        });

        if (deliveryGroupsWithEstimatedDelivery.length > 0) {
            const updatedShippingGroup = {
                ...shippingGroup,
                shippingMethod: {
                    ...shippingGroup.shippingMethod,
                    deliveryGroups: deliveryGroupsWithEstimatedDelivery
                }
            };

            return updatedShippingGroup;
        }
    }

    return shippingGroup;
}

function combineShippingGroupsItemsAndDeliveryGroups(orderDetails, sourceShippingGroup, destinationShippingGroup) {
    try {
        let source = getShippingGroup(orderDetails, sourceShippingGroup);
        const destination = getShippingGroup(orderDetails, destinationShippingGroup);

        // For `GiftCardShippingGroup`, extract `estimatedMinDeliveryDate` and
        // `estimatedMaxDeliveryDate` from the shipping method and add them to `deliveryGroups`.
        if (sourceShippingGroup === SHIPPING_GROUPS.GIFT) {
            source = addEstimatedDeliveryToDeliveryGroups(source);
        }

        const combined = {
            ...destination,
            items: [...(destination?.items || Empty.Array), ...(source?.items || Empty.Array)],
            shippingMethod: {
                ...destination?.shippingMethod,
                deliveryGroups: [
                    ...(destination?.shippingMethod?.deliveryGroups || Empty.Array),
                    ...(source?.shippingMethod?.deliveryGroups || Empty.Array)
                ]
            }
        };

        return combined;
    } catch (e) {
        return null;
    }
}

function removeShippingGroup(shippingGroupsEntries, shippingGroupType) {
    if (!shippingGroupsEntries?.length) {
        return shippingGroupsEntries;
    }

    const result = shippingGroupsEntries.filter(shippingGroup => {
        return shippingGroup.shippingGroupType !== shippingGroupType;
    });

    return result;
}

export default {
    ROPIS_CONSTANTS,
    HEADER_LEVEL_SDD_ORDER_STATUS,
    HEADER_LEVEL_STANDARD_ORDER_STATUS,
    ORDER_TYPES,
    isDisabled,
    isActive,
    isCanceled,
    isDelivered,
    getShipmentDate,
    getOrderId,
    getOrderTotal,
    getOrderDetailsUrl,
    getOrderHistoryUrl,
    getAllPurchasesUrl,
    getPaymentDisplayInfo,
    getCreditCardAddress,
    getHardGoodShippingAddress,
    getHardGoodShippingGroup,
    getSameDayShippingGroup,
    getSameDayShippingAddress,
    getPhysicalGiftCardShippingGroup,
    getCreditCardPaymentGroup,
    getAvailablePaymentLogos,
    getPayPalPaymentGroup,
    getPaymentGroup,
    getGiftCardPaymentGroups,
    getStoreCredits,
    getTrackingUrl,
    getBasketLevelRewardMessage,
    isZeroCheckout,
    isFreeRougeSameDayDelivery,
    isElectronicShippingGroup,
    isShippableOrder,
    isPlayOrder,
    isPlayTCChecked,
    isPlayEditOrder,
    isHazardous,
    isRestrictedInCalifornia,
    isPayPalEnabled,
    isKlarnaEnabledForThisOrder,
    isAfterpayEnabledForThisOrder,
    isPazeEnabledForThisOrder,
    isVenmoEnabledForThisOrder,
    hasAmountDue,
    getNonPromoItemsCount,
    getPromisedDelivery,
    getEstimatedDelivery,
    userHasSavedPayPalAccount,
    containsRestrictedItem,
    isGiftCardOnly,
    shouldShowPromotion,
    getAvailableBiPoints,
    getGuestAvailableBiPoints,
    isPayPalSaveToAccountChecked,
    getGlobalPromoCount,
    getSelfCancelationReasons,
    getGuestEmail,
    getThirdPartyCreditCard,
    isShipmentRestriction,
    getCreditCardTotal,
    getPayPalAmount,
    hasPromoCodes,
    isCoBranded,
    isPrivateLabel,
    detectSephoraCard,
    isSephoraCardNumber,
    isSephoraCardType,
    isSephoraTempCardType,
    getTempSephoraCardMessage,
    isAlternativePaymentMethod,
    alternativePaymentAltSrc,
    alternativePaymentText,
    alternativePaymentInfo,
    PAYMENT_TYPE,
    CREDIT_CARD_TYPES,
    CARD_TYPES,
    PAYMENT_GROUP_TYPE,
    PAYMENT_FLAGS,
    PAYMENT_MESSAGES,
    SHIPPING_GROUPS,
    SHIPPING_METHOD_TYPES,
    SHIPPING_METHOD_ID,
    PAYMENT_GROUPS,
    ZERO_CHECKOUT_OPTIONS,
    ORDER_TRACKING_BUTTON_STATES,
    ORDER_DETAILS_REQUESTS_ORIGIN,
    getMerchandiseSubtotalAsNumber,
    allowUpdatedShippingCalculationsMsg,
    hasRRC,
    isZeroPrice,
    getZipCode,
    showOrderCancelationModal,
    getBasket,
    getSameDayDeliveryBasket,
    getStandardBasket,
    hasSameDayDeliveryItems,
    hasStandardDeliveryItems,
    hasStandardNonAutoReplenishItems,
    hasHalAddress,
    hasHalDraftAddress,
    isHalAddress,
    isHalAvailable,
    whatDefaultAddressAfterHal,
    getSameDayShippingMethod,
    getScheduledSameDayShippingMethod,
    hasAutoReplenishItems,
    hasSDUInBasket,
    allItemsInBasketAreReplen,
    getOccupationalTax,
    getPaymentNameByType,
    isSDUOnlyOrder,
    hasSDUOnlyInSddBasket,
    getRDF,
    getOrderShippingMethod,
    isItemInOrder,
    getItemsByType,
    isOrderExpired,
    getOrderItemsWithoutSamples,
    calculateMerchandiseSubtotal,
    getStoreDetails,
    isZeroDollarOrderWithCVVValidation,
    isBopis,
    isSdd,
    isShipToHome,
    getCardTypeDisplayName,
    hasSubstitutions,
    isOrderPickedUp,
    isOrderProcessing,
    addEstimatedDeliveryToDeliveryGroups,
    combineShippingGroupsItemsAndDeliveryGroups,
    removeShippingGroup,
    hasCCR,
    getElectronicsShippingGroup
};
