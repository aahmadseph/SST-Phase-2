import {
    SHOW_SAVED_MESSAGE,
    UPDATE_BI_ACCOUNT,
    SET_ACCOUNT_HISTORY_SLICE,
    SET_CUSTOMER_LIMIT,
    SET_CUSTOMER_LIMIT_ERROR
} from 'constants/actionTypes/profile';

const initialState = {
    biAccount: null,
    accountHistorySlice: null,
    showSavedMessage: false,
    customerLimit: {
        currency: null,
        balance: {
            initial: null,
            initialExpiryDate: null,
            totalSpend: null,
            available: null
        },
        error: null
    }
};

const reducer = function (state = initialState, action) {
    const payload = action.payload;

    switch (action.type) {
        // Profile-related actions
        case UPDATE_BI_ACCOUNT:
            return {
                ...state,
                biAccount: action.biAccount
            };

        case SET_ACCOUNT_HISTORY_SLICE:
            return {
                ...state,
                accountHistorySlice: action.accountHistorySlice
            };

        case SHOW_SAVED_MESSAGE:
            return {
                ...state,
                showSavedMessage: action.isSave
            };

        // Customer limit-related actions
        case SET_CUSTOMER_LIMIT:
            return {
                ...state,
                customerLimit: {
                    currency: payload.currency,
                    balance: {
                        initial: payload.balance.initial,
                        initialExpiryDate: payload.balance.initialExpiryDate,
                        totalSpend: payload.balance.totalSpend,
                        available: payload.balance.available
                    },
                    error: null // Clear any previous errors on successful fetch
                }
            };

        case SET_CUSTOMER_LIMIT_ERROR:
            return {
                ...state,
                customerLimit: {
                    ...state.customerLimit,
                    error: payload?.error
                }
            };

        default:
            return state;
    }
};

export default reducer;
