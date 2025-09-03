import {
    TOGGLE_SELECTED, SET_READY, SHOW_INLINE_ERROR, RESET_PAZE_ERROR
} from 'constants/actionTypes/paze';
import pazeUtils from 'utils/Paze';
import decorators from 'utils/decorators';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import { INTERSTICE_DELAY_MS, PAZE_ERROR_MESSAGES } from 'components/Checkout/constants';
import enhancedContentPageBindings from 'analytics/bindingMethods/pages/enhancedContent/enhancedContentPageBindings';
import localeUtils from 'utils/LanguageLocale';

function toggleSelect(isSelected) {
    return {
        type: TOGGLE_SELECTED,
        isSelected
    };
}

function showInlineError(errorMessage) {
    enhancedContentPageBindings.fireLinkTrackingAnalytics({
        fieldErrors: ['payments'], //prop28
        errorMessages: `paze:${errorMessage}` //prop48
    });

    return {
        type: SHOW_INLINE_ERROR,
        error: {
            errorMessage
        }
    };
}

function resetError() {
    return {
        type: RESET_PAZE_ERROR
    };
}

function showModalError(errorMessage) {
    const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Display/locales', 'PaymentDisplay');
    enhancedContentPageBindings.fireLinkTrackingAnalytics({
        fieldErrors: ['payments'], //prop28
        errorMessages: errorMessage //prop48
    });

    return Actions.showInfoModal({
        isOpen: true,
        title: getText('pazeErrorTitle'),
        message: getText('pazeErrorMessage'),
        buttonText: getText('pazeErrorOk'),
        footerColumns: 1
    });
}

function setReady(readyStatus) {
    return {
        type: SET_READY,
        isReady: readyStatus
    };
}

const loadIframe =
    ({ errorMessage }) =>
        dispatch => {
            decorators
                .withInterstice(pazeUtils.initPaymentGroup, INTERSTICE_DELAY_MS)()
                .then(order => {
                    dispatch(OrderActions.updateOrder(order));
                    dispatch(setReady(false));
                    pazeUtils
                        .initCheckoutWidget()
                        .then(() => {
                            dispatch(setReady(true));
                        })
                        .catch(error => {
                            dispatch(showModalError());
                            dispatch(setReady(false));
                            // eslint-disable-next-line no-console
                            console.error(error);
                        });
                })
                .catch(error => {
                    dispatch(Actions.showInterstice(false));
                    dispatch(setReady(false));
                    dispatch(showInlineError(errorMessage));
                    //eslint-disable-next-line no-console
                    console.error(error);
                });
        };

const placeOrder =
    ({ errorMessage, transactionAmount }) =>
        dispatch => {
            return pazeUtils
                .showPopup({ transactionAmount })
                .then(data => {
                // TODO PAZE: This log is for backend to have access to the data
                    if (data && data.paze) {
                        return data;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    const { reason } = error || {};

                    switch (reason) {
                    // Show a modal error when the order fails to authorize through Paze
                        case PAZE_ERROR_MESSAGES.inaccesible:
                        case PAZE_ERROR_MESSAGES.invalidData:
                            dispatch(showInlineError(errorMessage));
                            dispatch(Actions.showInterstice(false));
                            dispatch(showModalError(reason));

                            break;

                        case PAZE_ERROR_MESSAGES.incompleteCheckout:
                        // Don't show an error when the user closes Paze window before
                        // completing checkout process
                            break;

                        default:
                        // eslint-disable-next-line no-console
                            console.error(error, errorMessage);
                            dispatch(showInlineError(errorMessage));
                            dispatch(Actions.showInterstice(false));

                            break;
                    }

                    return null;
                });
        };

export default {
    toggleSelect,
    setReady,
    loadIframe,
    placeOrder,
    showInlineError,
    resetError
};
