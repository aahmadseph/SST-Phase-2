import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import analyticsUtils from 'analytics/utils';
import orderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import {
    SDD_ERRORS, PAYMENT_ERRORS, BOPIS_PICKUP_ERRORS, SECTION_NAMES
} from 'constants/frictionlessCheckout';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import ErrorConstants from 'utils/ErrorConstants';
import store from 'Store';

const { hasHalAddress } = orderUtils;
const getText = localeUtils.getLocaleResourceFile('utils/locales/FrictionlessCheckout/locales', 'FrictionlessCheckout');

function setChangeLinkAnalytics(pageDetail) {
    const pageType = anaConsts.PAGE_TYPES.CHECKOUT;
    const pageName = `${pageType}:${pageDetail}:n/a:*`.toLowerCase();

    const eventStrings = [anaConsts.Event.SC_CHECKOUT.toLowerCase()];
    const prop55 = `checkout-place order:${pageDetail}:change`.toLowerCase();

    if (hasHalAddress()) {
        eventStrings.push(anaConsts.Event.EVENT_247);
    }

    const data = {
        pageType,
        pageName,
        eventStrings,
        pageDetail,
        previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName || 'checkout:place order:n/a:*',
        linkData: prop55
    };

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data });
}

function setAlternatePickupAnalytics(analyticsActionInfo, type = anaConsts.LINK_TRACKING_EVENT) {
    const isLinkTracking = type === anaConsts.LINK_TRACKING_EVENT;
    const isPageLoad = type === anaConsts.ASYNC_PAGE_LOAD;

    const payload = {
        data: {
            pageName: anaConsts.ALT_PICKUP.PAGE_NAME,
            pageType: anaConsts.PAGE_TYPES.BOPIS_CHECKOUT,
            pageDetail: anaConsts.PAGE_DETAIL.ALTERNATE_PICKUP
        }
    };

    if (isLinkTracking) {
        payload.data.linkName = analyticsActionInfo;
        payload.data.actionInfo = analyticsActionInfo;
    } else if (isPageLoad) {
        payload.data.linkData = analyticsActionInfo;
        payload.data.previousPageName = digitalData.page.attributes.previousPageData.pageName;
    }

    return processEvent.process(type, payload);
}

function setGiftCardPaymentAnalytics() {
    const pageType = anaConsts.PAGE_TYPES.CHECKOUT;
    const pageDetail = anaConsts.PAGE_NAMES.GIFT_CARD_PAYMENT;

    const eventStrings = [anaConsts.Event.SC_CHECKOUT];

    if (hasHalAddress()) {
        eventStrings.push(anaConsts.Event.EVENT_247);
    }

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageType,
            pageDetail,
            eventStrings,
            pageName: `${pageType}:${pageDetail}:n/a:*`.toLowerCase(),
            previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName
        }
    });
}

function setSubstitueModalClickAnalytics() {
    const pageType = anaConsts.PAGE_TYPES.CHECKOUT;
    const pageDetail = anaConsts.PAGE_TYPES.ITEM_SUBSTITUTION_MODAL;
    const pageName = `${pageType}:${pageDetail}:n/a:*`.toLowerCase();

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageType,
            pageName,
            pageDetail
        }
    });
}

function linkTrackingEventForErrors(componentName, message) {
    if (Array.isArray(message) && message?.length > 0) {
        message.forEach(msg => {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    fieldErrors: `${anaConsts.FIELD_ERRORS.CHECKOUT_PLACE_ORDER}:n/a:${componentName.replaceAll('_', ' ')}`.toLowerCase(), //prop28
                    errorMessages: msg?.toLowerCase(), //prop48
                    actionInfo: anaConsts.ACTION_INFO.PLACE_ORDER_BTN_CLICK //prop55
                }
            });
        });
    } else {
        const data = {
            fieldErrors: `${anaConsts.FIELD_ERRORS.CHECKOUT_PLACE_ORDER}:n/a:${componentName.replaceAll('_', ' ')}`.toLowerCase(), //prop28
            errorMessages: message?.toLowerCase(), //prop48
            actionInfo: anaConsts.ACTION_INFO.PLACE_ORDER_BTN_CLICK //prop55
        };

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data
        });
    }
}

function trackPlaceOrderErrorAnalytics(errorData) {
    const { key, errorMessages } = errorData;

    const defaultErrorMessage = getText('defaultErrorMessage');

    let errorZoneDescription = 'modal';

    if (key) {
        if (SDD_ERRORS.includes(key)) {
            errorZoneDescription = SECTION_NAMES.SDD;
        } else if (PAYMENT_ERRORS.includes(key)) {
            errorZoneDescription = SECTION_NAMES.PAYMENT;
        } else if (BOPIS_PICKUP_ERRORS.includes(key)) {
            errorZoneDescription = SECTION_NAMES.BOPIS_PICKUP_INFO;
        }
    }

    const userDisplayedMessage = errorMessages?.length > 0 ? errorMessages.join(' ') : defaultErrorMessage;

    const analyticsData = {
        fieldErrors: `${anaConsts.FIELD_ERRORS.CHECKOUT_PLACE_ORDER}:${key || 'api.error'}:${errorZoneDescription.replaceAll(
            '_',
            ' '
        )}`.toLowerCase(), //prop28
        errorMessages: userDisplayedMessage?.toLowerCase(), // prop48,
        actionInfo: anaConsts.ACTION_INFO.PLACE_ORDER_BTN_CLICK // prop55
    };

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: analyticsData
    });
}

function errorTrackingBeforeAPICall(errors) {
    Object.entries(errors).forEach(([key, value]) => {
        linkTrackingEventForErrors(key, value);
    });
}

function setAddOrEditShippingAddressAnalytics(isEditAddress = false, linkText = '', isGiftCardSection) {
    const pageType = anaConsts.PAGE_TYPES.CHECKOUT;
    const pageDetail = isGiftCardSection ? 'gift card shipping' : isEditAddress ? 'shipping-edit address' : 'shipping-add address';
    const link = `${pageType}:${pageDetail}:${linkText.toLowerCase()}`;
    const pageName = `${pageType}:${pageDetail}:n/a:*`;

    const data = {
        pageType,
        pageDetail,
        linkName: link,
        pageName,
        previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName || 'checkout:place order:n/a:*'
    };

    digitalData.page.attributes.sephoraPageInfo.pageName = pageName;

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data });
}

function setPlaceOrderBtnClickanalytics({ isSuccess, hasErrorMessage }) {
    const paymentMethod = FrictionlessUtils.getPaymentMethodName();

    let actionInfo = anaConsts.ACTION_INFO.CHECKOUT_PLACE_ORDER;

    if (paymentMethod?.length > 0) {
        actionInfo += `:${paymentMethod}`;
    }

    const data = {
        actionInfo: actionInfo?.toLowerCase()
    };

    if (!isSuccess && !hasErrorMessage) {
        data.eventStrings = anaConsts.Event.EVENT_294;
    }

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data
    });
}

//Parse through the error object to get what we need in the format we need it in
function getErrorMessages(errors = {}) {
    const errorMessages = [];
    const ERROR_LEVEL = ErrorConstants.ERROR_LEVEL;
    Object.keys(ERROR_LEVEL).forEach(errorLevel => {
        Object.keys(errors[errorLevel]).forEach(errorKey => {
            errorMessages.push(errors[errorLevel][errorKey].message);
        });
    });

    return errorMessages;
}

function setSectionLevelErrorAnalytics(componentName, componentErrors = []) {
    const errors = store.getState().errors;
    const errorMsgs = componentErrors.length ? componentErrors : getErrorMessages(errors);

    if (Array.isArray(errorMsgs) && errorMsgs?.length > 0) {
        errorMsgs.forEach(message => {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    fieldErrors: `${anaConsts.FIELD_ERRORS.CHECKOUT_PLACE_ORDER}:n/a:${componentName.replaceAll('_', ' ')}`.toLowerCase(), //prop28
                    errorMessages: message?.toLowerCase()
                }
            });
        });
    } else {
        const data = {
            fieldErrors: `${anaConsts.FIELD_ERRORS.CHECKOUT_PLACE_ORDER}:n/a:${componentName.replaceAll('_', ' ')}`.toLowerCase(), //prop28
            errorMessages: errorMsgs?.toLowerCase()
        };
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data
        });
    }
}

function setAnalyticsForOrderConfirmation(defaultPayment, isDefaultPaymentBeingUsed) {
    const nextPageData = {
        defaultPayment
    };

    if (isDefaultPaymentBeingUsed) {
        nextPageData.events = [anaConsts.Event.DEFAULT_PAYMENT_METHOD_USED];
    }

    analyticsUtils.setNextPageData(nextPageData);
}

export default {
    setAlternatePickupAnalytics,
    setChangeLinkAnalytics,
    setSubstitueModalClickAnalytics,
    setGiftCardPaymentAnalytics,
    errorTrackingBeforeAPICall,
    trackPlaceOrderErrorAnalytics,
    setAddOrEditShippingAddressAnalytics,
    setPlaceOrderBtnClickanalytics,
    setSectionLevelErrorAnalytics,
    setAnalyticsForOrderConfirmation
};
