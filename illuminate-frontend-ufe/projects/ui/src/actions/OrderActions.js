import {
    GIFT_CARD_APPLIED,
    ORDER_ERRORS,
    ORDER_REVIEW_TOGGLE,
    PAYMENT_CARD_NUMBER_CHANGED,
    PAYMENT_CARDS_DETECTED,
    SECTION_SAVED,
    SET_PLACE_ORDER_PRE_HOOK,
    SUBMITTED_ORDER,
    TOGGLE_CVC_INFO_MODAL,
    TOGGLE_PLACE_ORDER,
    UPDATE_DELIVERY_INSTRUCTIONS,
    UPDATE_ORDER,
    UPDATE_SHIPPING_METHODS,
    VALIDATE_ADDRESS,
    CREATE_DRAFT_HAL_ADDRESS,
    REMOVE_HAL_ADDRESS,
    SHOW_SCHEDULED_DELIVERY_UNAVAILABLE,
    UPDATE_CURRENT_HAL_ADDRESS,
    UPDATE_ADDRESS_LIST_WITH_HAL_ADDRESS,
    UPDATE_SEPHORA_TERMS,
    UPDATE_AUTOREPLENISH_TERMS,
    UPDATE_VERBAL_CONSENT,
    UPDATE_SDU_TERMS,
    UPDATE_AGENT_AWARE_TERMS,
    SET_SELECTED_DELIVERY_ISSUE,
    SET_DELIVERY_ISSUES,
    SET_DELIVERY_ISSUE_MODAL_SCREEN,
    SET_RETURN_ELIGIBILITY,
    SET_DELIVERY_ISSUE_ERROR,
    SET_LAST_SHIPPING_ADDRESS_ID,
    UPDATE_ORDER_HEADER,
    UPDATE_WAIVE_SHIPPING,
    SWAP_PAYPAL_TO_CREDIT,
    SET_SECTION_ERRORS,
    CLEAR_SECTION_ERRORS,
    SET_ACTIVE_SECTION,
    CLEAR_NAMED_SECTION_ERRORS
} from 'constants/actionTypes/order';
import { INTERSTICE_DELAY_MS, DELIVERY_ISSUES_MODAL } from 'components/Checkout/constants';
import Decorators from 'utils/decorators';
import OrderUtils from 'utils/Order';
import checkoutApi from 'services/api/checkout';
const { getReturnEligibility, getReturnReasons, updateDeliveryInstructions } = checkoutApi;

import Actions from 'Actions';

const SHIPPING_GROUPS = {
    HARDGOOD: 'HardGoodShippingGroup',
    GIFT: 'GiftCardShippingGroup',
    ELECTRONIC: 'ElectronicShippingGroup',
    SAME_DAY: 'SameDayShippingGroup'
};

const updateSephoraTerms = payload => ({
    type: UPDATE_SEPHORA_TERMS,
    payload
});

const updateAutoReplenishTerms = payload => {
    return {
        type: UPDATE_AUTOREPLENISH_TERMS,
        payload
    };
};

const updateVerbalConsent = payload => {
    return {
        type: UPDATE_VERBAL_CONSENT,
        payload
    };
};

const updateSDUTerms = payload => {
    return {
        type: UPDATE_SDU_TERMS,
        payload
    };
};
const updateAgentAwareTerms = payload => {
    if (Sephora.isAgent) {
        return {
            type: UPDATE_AGENT_AWARE_TERMS,
            payload
        };
    }

    return {};
};
const updateOrder = orderDetails => ({
    type: UPDATE_ORDER,
    orderDetails
});

const updateOrderHeader = orderHeaderDetails => ({
    type: UPDATE_ORDER_HEADER,
    orderHeaderDetails
});

const orderSubmitted = submittedDetails => ({
    type: SUBMITTED_ORDER,
    submittedDetails
});

const togglePlaceOrderDisabled = isPlaceOrderDisabled => ({
    type: TOGGLE_PLACE_ORDER,
    isPlaceOrderDisabled: isPlaceOrderDisabled
});

const orderErrors = errors => ({
    type: ORDER_ERRORS,
    orderErrors: errors
});

const sectionSaved = (section, component, isUpdateOrder = true, isPaymentSectionComplete) => ({
    type: SECTION_SAVED,
    section,
    component,
    isUpdateOrder,
    isPaymentSectionComplete
});

const orderReviewIsActive = isActive => ({
    type: ORDER_REVIEW_TOGGLE,
    isActive
});

const paymentCardNumberChanged = cardNumber => ({
    type: PAYMENT_CARD_NUMBER_CHANGED,
    cardNumber
});

const paymentCardsDetected = cardTypes => ({
    type: PAYMENT_CARDS_DETECTED,
    cardTypes: cardTypes
});

const saveDeliveryInstructions = deliveryInstructions => (dispatch, getState) => {
    const updateDeliveryInstructionsWrapped = Decorators.withInterstice(updateDeliveryInstructions, INTERSTICE_DELAY_MS);
    const {
        order: { orderDetails }
    } = getState();
    const { shippingGroupId } = OrderUtils.getSameDayShippingGroup(orderDetails);
    const result = updateDeliveryInstructionsWrapped(deliveryInstructions, shippingGroupId).then(() => {
        dispatch({
            type: UPDATE_DELIVERY_INSTRUCTIONS,
            payload: { deliveryInstructions }
        });
    });

    return result;
};

const updateShippingMethods = (shippingMethods, shippingGroup) => ({
    type: UPDATE_SHIPPING_METHODS,
    shippingMethods,
    shippingGroup
});

const swapPaypalToCredit = () => ({
    type: SWAP_PAYPAL_TO_CREDIT
});

const validateAddress = (addressId, uiAddress) => ({
    type: VALIDATE_ADDRESS,
    addressId,
    uiAddress
});

const showCVCInfoModal = isOpen => ({
    type: TOGGLE_CVC_INFO_MODAL,
    isOpen
});

const setPlaceOrderPreHook = placeOrderPreHook => ({
    type: SET_PLACE_ORDER_PRE_HOOK,
    placeOrderPreHook
});

const giftCardApplied = () => ({ type: GIFT_CARD_APPLIED });

const createDraftHalAddress = (address, shippingGroupId, halOperatingHours) => dispatch => {
    return new Promise(resolve => {
        dispatch({
            type: CREATE_DRAFT_HAL_ADDRESS,
            address,
            shippingGroupId,
            halOperatingHours
        });
        resolve();
    });
};

const removeHalAddress = () => ({
    type: REMOVE_HAL_ADDRESS
});

const updateCurrentHalAddress = halAddress => {
    return {
        type: UPDATE_CURRENT_HAL_ADDRESS,
        payload: {
            halAddress
        }
    };
};

const updateAddressListWithHalAddress = () => ({
    type: UPDATE_ADDRESS_LIST_WITH_HAL_ADDRESS
});

const showScheduledDeliveryUnavailable = message => ({
    type: SHOW_SCHEDULED_DELIVERY_UNAVAILABLE,
    payload: { message: message }
});

const setDeliveryIssues = deliveryIssues => ({
    type: SET_DELIVERY_ISSUES,
    payload: { deliveryIssues: deliveryIssues }
});

const setSelectedDeliveryIssue = issue => ({
    type: SET_SELECTED_DELIVERY_ISSUE,
    payload: { selectedDeliveryIssue: issue }
});

const loadDeliveryIssues = () => dispatch => {
    return getReturnReasons()
        .then(re => {
            dispatch(setDeliveryIssues(re.returnReasons));
            dispatch(
                Actions.showDeliveryIssueModal({
                    isOpen: true
                })
            );
        })
        .catch(_ => {
            dispatch(Actions.showDeliveryIssueModal({ isOpen: true }));
            dispatch(setDeliveryIssueModalScreen(DELIVERY_ISSUES_MODAL.somethingWrongMessageScreen));
        });
};

const setReturnEligibilty = returnEligibility => ({
    type: SET_RETURN_ELIGIBILITY,
    payload: { returnEligibility: returnEligibility }
});

const loadReturnEligibilty = (reasonCode, orderId) => dispatch => {
    dispatch(Actions.showInterstice(true));

    return getReturnEligibility(reasonCode, orderId)
        .then(re => {
            dispatch(setReturnEligibilty(re));
        })
        .catch(e => {
            //Log error for Dynatrace
            // eslint-disable-next-line no-console
            console.error(
                `SelfService_NCR_Eligibility_API:/selfReturn/orders/${orderId}/eligibility?reasonCode=${reasonCode},c:${e?.errorCode},m:${e?.errorMessages?.[0]}`
            );
            dispatch(
                setReturnEligibilty({
                    apiError: true
                })
            );
        })
        .finally(() => {
            dispatch(Actions.showInterstice(false));
        });
};

const setDeliveryIssueError = error => ({
    type: SET_DELIVERY_ISSUE_ERROR,
    payload: error
});

const setDeliveryIssueModalScreen = screenName => ({
    type: SET_DELIVERY_ISSUE_MODAL_SCREEN,
    payload: { deliveryIssueModalScreen: screenName }
});

const setLastUsedShippingAddressId = addressId => ({
    type: SET_LAST_SHIPPING_ADDRESS_ID,
    payload: { addressId }
});

const updateWaiveShipping = waiveShippingFee => ({
    type: UPDATE_WAIVE_SHIPPING,
    waiveShippingFee
});

const setCheckoutSectionErrors = payload => ({
    type: SET_SECTION_ERRORS,
    payload
});

const clearCheckoutSectionErrors = () => ({
    type: CLEAR_SECTION_ERRORS
});

const setCheckoutActiveSection = payload => ({
    type: SET_ACTIVE_SECTION,
    payload
});

const clearNamedSectionErrors = payload => ({
    type: CLEAR_NAMED_SECTION_ERRORS,
    payload
});

export default {
    giftCardApplied,
    orderErrors,
    orderReviewIsActive,
    orderSubmitted,
    paymentCardNumberChanged,
    paymentCardsDetected,
    saveDeliveryInstructions,
    sectionSaved,
    setPlaceOrderPreHook,
    SHIPPING_GROUPS,
    showCVCInfoModal,
    togglePlaceOrderDisabled,
    updateOrder,
    updateShippingMethods,
    validateAddress,
    createDraftHalAddress,
    removeHalAddress,
    updateCurrentHalAddress,
    updateAddressListWithHalAddress,
    showScheduledDeliveryUnavailable,
    updateSephoraTerms,
    updateAutoReplenishTerms,
    updateVerbalConsent,
    updateSDUTerms,
    updateAgentAwareTerms,
    setSelectedDeliveryIssue,
    setDeliveryIssues,
    loadDeliveryIssues,
    setDeliveryIssueModalScreen,
    setReturnEligibilty,
    loadReturnEligibilty,
    setDeliveryIssueError,
    setLastUsedShippingAddressId,
    updateOrderHeader,
    updateWaiveShipping,
    swapPaypalToCredit,
    setCheckoutSectionErrors,
    clearCheckoutSectionErrors,
    setCheckoutActiveSection,
    clearNamedSectionErrors
};
