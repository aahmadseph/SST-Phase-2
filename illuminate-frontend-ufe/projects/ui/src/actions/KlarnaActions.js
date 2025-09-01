import Actions from 'Actions';
import OrderActions from 'actions/OrderActions';
import klarnaUtils from 'utils/Klarna';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

import {
    SHOW_ERROR, TOGGLE_SHIPPING, TOGGLE_SELECTED, SET_READY
} from 'constants/actionTypes/klarna';

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

function setReady(readyStatus) {
    return {
        type: SET_READY,
        isReady: readyStatus
    };
}

function toggleShipping(useMyShippingAddress) {
    return {
        type: TOGGLE_SHIPPING,
        useMyShippingAddress
    };
}

const backgroundInit = errorMessage => dispatch => {
    dispatch(setReady(false));
    decorators
        .withInterstice(klarnaUtils.initPaymentGroup, INTERSTICE_DELAY_MS)()
        .then(({ session, order }) => {
            dispatch(OrderActions.updateOrder(order));
            klarnaUtils
                .load('backgroundPaymentWidget', session.clientToken)
                .then(() => dispatch(setReady(true)))
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

const placeOrder =
    ({ errorMessage, denialMessage }) =>
        (dispatch, getState) => {
            dispatch(Actions.showInterstice(true));
            const { orderDetails } = getState().order;
            const { useMyShippingAddress } = getState().klarna;

            return klarnaUtils
                .authorize(orderDetails, useMyShippingAddress)
                .then(data => {
                    if (data.authorization_token) {
                        return data;
                    } else {
                    // If we fail to retrieve the authorization token, we return an
                    // empty object so that backend tries to get the authorization token
                    // themselves
                    // eslint-disable-next-line camelcase
                        data.authorization_token = '';

                        return data;
                    }
                })
                .catch(error => {
                    dispatch(Actions.showInterstice(false));
                    const message = error?.type === klarnaUtils.ERROR_TYPES.AUTH_DENIAL && denialMessage ? denialMessage : errorMessage;
                    dispatch(showError(message, true));

                    return null;
                });
        };

export default {
    showError,
    toggleShipping,
    toggleSelect,
    backgroundInit,
    placeOrder
};
