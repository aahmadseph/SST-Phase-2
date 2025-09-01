import {
    TOGGLE_SELECTED, SET_READY, SHOW_INLINE_ERROR, RESET_VENMO_ERROR
} from 'constants/actionTypes/venmo';
import Actions from 'Actions';
import checkoutApi from 'services/api/checkout';
import checkoutUtils from 'utils/Checkout';

function toggleSelect(isSelected) {
    return {
        type: TOGGLE_SELECTED,
        isSelected
    };
}

function showInlineError(errorMessage) {
    return {
        type: SHOW_INLINE_ERROR,
        error: {
            errorMessage
        }
    };
}

function showModalError(message, title, buttonText) {
    return Actions.showInfoModal({
        isOpen: true,
        isHtml: true,
        title,
        message,
        buttonText
    });
}

function resetError() {
    return {
        type: RESET_VENMO_ERROR
    };
}

function setReady(readyStatus) {
    return {
        type: SET_READY,
        isReady: readyStatus
    };
}

async function placeOrder() {
    const submittedDetails = await checkoutApi.placeOrder({ originOfOrder: 'web' });
    checkoutUtils.placeOrderSuccess(submittedDetails);
}

export default {
    toggleSelect,
    setReady,
    showInlineError,
    resetError,
    showModalError,
    placeOrder
};
