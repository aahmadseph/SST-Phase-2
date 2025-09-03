import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import decorators from 'utils/decorators';
import checkoutApi from 'services/api/checkout';
import OrderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';
import Actions from 'actions/Actions';
import store from 'store/Store';
import resourceWrapper from 'utils/framework/resourceWrapper';
import Flush from 'utils/localStorage/Flush';
import locationUtils from 'utils/Location';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import {
    SDD_ERRORS, PAYMENT_ERRORS, BOPIS_PICKUP_ERRORS, SECTION_NAMES
} from 'constants/frictionlessCheckout';
import {
    Divider, Flex, Link, Text
} from 'components/ui';
import ChatEntry from 'components/Content/CustomerService/ChatWithUs/ChatEntry';
import { CHAT_ENTRY } from 'constants/chat';
import orderUtils from 'utils/Order';
import ErrorConstants from 'utils/ErrorConstants';
const { ERROR_KEYS, ERROR_CODES } = ErrorConstants;

const getText = localeUtils.getLocaleResourceFile('utils/locales/FrictionlessCheckout/locales', 'FrictionlessCheckout');

const maxAmountToCheckout = Sephora.configurationSettings.afterpayConfigurations?.maxAmountToCheckout || 2000;
const PAYMENT_GROUPS = { CREDIT_CARD: 'CreditCardPaymentGroup' };

const paymentServices = {
    payWithKlarna: {
        paymentService: 'Klarna',
        paymentName: 'payWithKlarna',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.KLARNA,
        limit: 1000
    },
    payWithAfterpay: {
        paymentService: 'Afterpay',
        paymentName: 'payWithAfterpay',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY,
        limit: maxAmountToCheckout
    },
    payWithPaze: {
        paymentService: 'Paze',
        paymentName: 'payWithPaze',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.PAZE,
        limit: maxAmountToCheckout
    },
    payWithVenmo: {
        paymentService: 'Venmo',
        paymentName: 'payWithVenmo',
        paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.VENMO,
        limit: maxAmountToCheckout
    }
};

function setShippingMethod({
    orderId, newShippingMethodId, shippingGroupId, successCallback, failureCallback, message, updateWaiveShipping
}) {
    let shipOptionsSendData = {
        orderId,
        shippingGroupId,
        shippingMethodId: newShippingMethodId
    };

    if (Sephora.isAgent && Sephora.isAgentAuthorizedRole) {
        //If it is Sephora Mirror and extension is installed, waive shipping and handling checkbox is displayed
        shipOptionsSendData = {
            ...shipOptionsSendData,
            waiveShippingFee: message || false
        };
        updateWaiveShipping(message || false);
    }

    return decorators
        .withInterstice(
            checkoutApi.setShippingMethod,
            INTERSTICE_DELAY_MS
        )(shipOptionsSendData)
        .then(() => {
            successCallback();
        })
        .catch(errorData => failureCallback(errorData));
}

function checkPromoEligibility(checkedShippingMethod, orderDetails) {
    const { items = {} } = orderDetails;
    const { promoShippingMethods = [], appliedPromotions = [] } = items;

    const ineligibleShippingPromotions = appliedPromotions
        .filter(
            appliedPromo =>
                appliedPromo.promoShippingMethods &&
                appliedPromo.promoShippingMethods.every(promoMethod => promoMethod !== checkedShippingMethod.shippingMethodType)
        )
        .map(ineligiblePromo => ineligiblePromo.couponCode);

    if (promoShippingMethods.length && ineligibleShippingPromotions.length) {
        return false;
    }

    return true;
}

function getPaymentSectionProps(paymentName, checkoutEnabled) {
    const sectionProps = paymentServices[paymentName] ? { ...paymentServices[paymentName] } : {};
    sectionProps.paymentCheckoutEnabled = checkoutEnabled;
    sectionProps.limit = localeUtils.isFRCanada()
        ? `${sectionProps.limit}${localeUtils.CURRENCY_SYMBOLS.CA_FR}`
        : `${localeUtils.CURRENCY_SYMBOLS.US}${sectionProps.limit}`;

    return sectionProps;
}

function validateCreditCardErrors(payment) {
    if (!payment.isMigrated) {
        return getText('creditCardMigratedError');
    }

    return null;
}

function validatePaymentGroup(paymentGroups, messages, isOrderComplete) {
    const handlerMapper = {
        [PAYMENT_GROUPS.CREDIT_CARD]: validateCreditCardErrors
    };

    const errorMessages = [];

    paymentGroups.forEach(currentPaymentGroup => {
        if (handlerMapper[currentPaymentGroup?.paymentGroupType]) {
            const values = handlerMapper[currentPaymentGroup?.paymentGroupType](currentPaymentGroup?.paymentGroup);

            if (values) {
                errorMessages.push(values);
            }
        }
    });

    if (messages?.type === 'error') {
        errorMessages.push(...messages?.messages);
    }

    if (!messages && !isOrderComplete) {
        errorMessages.push(getText('cardMissingDetailsDefault'));
    }

    return errorMessages.length > 0 ? errorMessages : getText('defaultMessage');
}

function setErrorsFromCheckoutAPI(errorData) {
    const sectionErrors = {};

    if (errorData?.errors?.invalidAddress && errorData?.errorCode === -10180 && SDD_ERRORS.includes(errorData?.key)) {
        sectionErrors[SECTION_NAMES.SDD] = errorData?.errorMessages?.join(' ');
    }

    if (errorData?.scheduledAddrChangeMessage) {
        sectionErrors[SECTION_NAMES.SDD] = errorData?.scheduledAddrChangeMessage?.[0]?.messages?.join(' ');
    }

    if (errorData?.errors?.sameDaySkuOOSException) {
        sectionErrors[SECTION_NAMES.SDD] = errorData?.errorMessages?.join(' ');
    }

    return sectionErrors;
}

function setDeliverToErrors(message) {
    const sectionErrors = {};
    sectionErrors[SECTION_NAMES.DELIVER_TO] = message;

    return sectionErrors;
}

function checkForCheckoutSectionsCompleteness(orderDetails, isCvvRequired = false) {
    const sectionErrors = {};

    const hasSDD = orderDetails?.header?.isSameDayOrder;
    const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(orderDetails);
    const isPaymentNotComplete = orderDetails?.paymentGroups?.paymentGroupsEntries?.some(
        paymentGroup => paymentGroup?.paymentGroup.isComplete === false
    );
    const isBopisOrder = orderDetails?.header?.isBopisOrder;

    // Ensure if-conditions follow the checkout layout order.
    // Start with "Deliver To" if it's the first section, and so on.
    // This keeps SectionErrors keys aligned with layout sequence,
    // enabling smooth scroll to the first error.

    if (orderDetails.header.isAddressMisMatch) {
        //address mismatch error
        sectionErrors.addressMismatch = getText('defaultMessage');
    }

    if (!orderDetails?.shippingGroups?.shippingGroupsEntries?.[0]?.shippingGroup?.isComplete && !isBopisOrder && !isSDUOnlyOrder) {
        // Deliver To section inComplete error
        sectionErrors[SECTION_NAMES.DELIVER_TO] = getText('defaultMessage');
    }

    if (hasSDD && !orderDetails?.shippingGroups?.shippingGroupsEntries?.[0]?.shippingGroup?.shippingMethod?.isComplete) {
        // SDD Incomplete error
        sectionErrors[SECTION_NAMES.SDD] = getText('defaultMessage');
    }

    if (!orderDetails?.header?.shippingGroups?.[0]?.shippingMethod?.isComplete && !isBopisOrder && !isSDUOnlyOrder) {
        // Shipping method incomplete error
        sectionErrors[SECTION_NAMES.SHIPPING_METHOD] = getText('defaultMessage');
    }

    if (isPaymentNotComplete || orderDetails?.paymentGroups?.paymentMessages?.length > 0) {
        // payment method incomplete error
        sectionErrors[SECTION_NAMES.PAYMENT] = validatePaymentGroup(
            orderDetails?.paymentGroups?.paymentGroupsEntries,
            orderDetails?.paymentGroups?.paymentMessages?.[0],
            orderDetails?.header?.isComplete
        );
    }

    if (isCvvRequired) {
        sectionErrors[SECTION_NAMES.PAYMENT] = getText('confirmCVV');
    }

    if (!orderDetails?.items?.isBIPointsAvailable) {
        // BI Points unavailable error.
        sectionErrors[SECTION_NAMES.BI_BENEFITS] = getText('BIUnavailable');
    }

    return sectionErrors;
}

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

function isGuestOrder() {
    return store.getState().order.orderDetails.header.isGuestOrder;
}

const redirectToBasket = () => {
    //remove basket cache so that OOS items show up on basket page with warning message
    Flush.flushBasket();
    const path = '/basket';

    locationUtils.setLocation(path);
};

const redirectOnSpecificErrors = error => {
    if (
        error.key === ERROR_CODES.NOT_ENOUGH_BI_POINTS ||
        error.key === ERROR_CODES.NOT_ENOUGH_POINTS_ERROR ||
        // errorKey for this errors is unknown
        error.errorCode === ERROR_KEYS.SAME_DAY_DISABLED ||
        error.errorCode === ERROR_KEYS.SDU_MISSING_PROFILE_DETAILS
    ) {
        redirectToBasket();
    }
};

function getOrderFraudError(errorData) {
    const defaultErrorMessage = getText('defaultErrorMessage');
    const { errorCode, errorMessages, key: errorKey } = errorData || Empty.Object;

    let isOrderDeclined = false;
    let orderDeclineAction = Empty.Function;

    if (errorKey && Object.hasOwn(ORDER_FRAUD_ERROR_MAP, errorKey) && errorCode === -8) {
        const { modalTitle, modalMessage } = ORDER_FRAUD_ERROR_MAP[errorKey];

        isOrderDeclined = true;

        orderDeclineAction = () => {
            const isGuestCheckout = isGuestOrder();

            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText(isGuestCheckout ? 'error' : modalTitle),
                    message: isGuestCheckout
                        ? getText('guestErrorMessage')
                        : modalMessage
                            ? modalMessage()
                            : errorMessages?.length > 0
                                ? errorMessages?.join(' ')
                                : defaultErrorMessage,
                    buttonText: getText('ok'),
                    callback: redirectToBasket,
                    cancelCallback: redirectToBasket
                })
            );
        };
    }

    return {
        isOrderDeclined,
        orderDeclineAction
    };
}

function isSectionLevelError(key) {
    return [...SDD_ERRORS, ...PAYMENT_ERRORS, ...BOPIS_PICKUP_ERRORS].includes(key);
}

function openInfoModal(errorData) {
    const errorMessage = errorData?.errorMessages?.join(' ');
    const htmlMessage = errorMessage.replace(/\n/g, '<br />');
    const forceHtmlMessage = errorMessage !== htmlMessage;
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            isHtml: forceHtmlMessage,
            title: getText('error'),
            message: forceHtmlMessage ? htmlMessage : errorMessage,
            buttonText: getText('ok'),
            cancelCallback: () => redirectOnSpecificErrors(errorData),
            callback: () => redirectOnSpecificErrors(errorData)
        })
    );
}

function getErrorStatesFromSubmitOrderAPI(errorData) {
    const { key, errorMessages } = errorData;
    const { isOrderDeclined, orderDeclineAction } = getOrderFraudError(errorData);
    const defaultErrorMessage = getText('defaultErrorMessage');

    if (errorData) {
        FrictionlessCheckoutBindings.trackPlaceOrderErrorAnalytics(errorData);
    }

    if (isOrderDeclined) {
        orderDeclineAction();

        return null;
    } else if (isSectionLevelError(key)) {
        let sectionName = '';
        const sectionErrors = {};

        // Ensure if-conditions follow the checkout layout order.
        // Start with "Deliver To" if it's the first section, and so on.
        // This keeps SectionErrors keys aligned with layout sequence,
        // enabling smooth scroll to the first error.

        if (BOPIS_PICKUP_ERRORS.includes(key)) {
            sectionName = SECTION_NAMES.BOPIS_PICKUP_INFO;
        }

        if (SDD_ERRORS.includes(key)) {
            sectionName = SECTION_NAMES.SDD;
        }

        if (PAYMENT_ERRORS.includes(key)) {
            sectionName = SECTION_NAMES.PAYMENT;
        }

        sectionErrors[sectionName] = errorMessages?.length > 0 ? errorMessages?.join(' ') : defaultErrorMessage;

        return sectionErrors;
    } else {
        if (!errorData?.errorMessages?.length) {
            //adds default error message when there are no messages from API call.
            errorData.errorMessages = [defaultErrorMessage];
        }

        openInfoModal(errorData);

        return null;
    }
}

function getPaymentMethodName() {
    const orderDetails = store.getState().order.orderDetails;
    const paymentGroupEntry = orderDetails?.paymentGroups?.paymentGroupsEntries?.[0];

    if (paymentGroupEntry?.paymentGroupType === PAYMENT_GROUPS.CREDIT_CARD) {
        return 'standard';
    } else {
        return `continue with ${paymentGroupEntry?.paymentGroup?.paymentDisplayInfo}`;
    }
}

function getPromosData() {
    const promotions = store.getState()?.order?.orderDetails?.promotion || Empty.Object;
    const promoCodes = [],
        promoDisplayName = [],
        promotionIds = [],
        promotionTypes = [],
        sephoraPromotionTypes = [];

    if (Array.isArray(promotions.appliedPromotions)) {
        promotions.appliedPromotions.forEach(
            ({
                couponCode = null, displayName = null, promotionId = null, promotionType = null, sephoraPromotionType = null
            }) => {
                promoCodes.push(couponCode);
                promoDisplayName.push(displayName);
                promotionIds.push(promotionId);
                promotionTypes.push(promotionType);
                sephoraPromotionTypes.push(sephoraPromotionType);
            }
        );
    }

    return {
        promoCodes,
        promoDisplayName,
        promotionIds,
        promotionTypes,
        sephoraPromotionTypes
    };
}

export default {
    checkPromoEligibility,
    setShippingMethod,
    getPaymentSectionProps,
    paymentServices,
    checkForCheckoutSectionsCompleteness,
    getErrorStatesFromSubmitOrderAPI,
    SECTION_NAMES,
    getOrderFraudError,
    setErrorsFromCheckoutAPI,
    getPaymentMethodName,
    getPromosData,
    validatePaymentGroup,
    setDeliverToErrors
};
