import afterpayUtils from 'utils/Afterpay';
import basketUtils from 'utils/Basket';
import decorators from 'utils/decorators';
import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import {
    SHOW_ERROR, RESET_ERROR, TOGGLE_SELECTED, SET_READY
} from 'constants/actionTypes/afterpay';

function toggleSelect(isSelected) {
    return {
        type: TOGGLE_SELECTED,
        isSelected
    };
}

function showError(errorMessage, fireAnalytics = false) {
    return {
        type: SHOW_ERROR,
        error: {
            errorMessage,
            fireAnalytics
        }
    };
}

function resetError() {
    return {
        type: RESET_ERROR
    };
}

function setReady(readyStatus) {
    return {
        type: SET_READY,
        isReady: readyStatus
    };
}

const loadWidget = (id, ammount, errorMessage) => dispatch => {
    decorators
        .withInterstice(afterpayUtils.initPaymentGroup, INTERSTICE_DELAY_MS)()
        .then(order => {
            dispatch(OrderActions.updateOrder(order));
            dispatch(setReady(false));
            afterpayUtils
                .initCheckoutWidget(id, basketUtils.removeCurrency(ammount), () => dispatch(showError(errorMessage, true)))
                .then(() => {
                    dispatch(setReady(true));
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    dispatch(showError(errorMessage, true));
                });
        })
        .catch(error => {
            dispatch(Actions.showInterstice(false));
            //eslint-disable-next-line no-console
            console.error(error);
            dispatch(showError(errorMessage, true));
        });
};

const updateWidget = ammount => {
    afterpayUtils.updateCheckoutWidget(basketUtils.removeCurrency(ammount));
};

const placeOrder =
    ({ errorMessage }) =>
        dispatch => {
            if (Sephora.isDesktop()) {
                dispatch(Actions.showInterstice(true));
            }

            return afterpayUtils
                .showPopup()
                .then(data => {
                    if (data.status === 'SUCCESS') {
                        return data;
                    } else {
                        dispatch(Actions.showInterstice(false));

                        return null;
                    }
                })
                .catch(error => {
                // eslint-disable-next-line no-console
                    console.error(error);
                    dispatch(Actions.showInterstice(false));
                    dispatch(showError(errorMessage, true));

                    return null;
                });
        };

export default {
    toggleSelect,
    showError,
    resetError,
    setReady,
    loadWidget,
    updateWidget,
    placeOrder
};
