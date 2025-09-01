import {
    UPDATE,
    DRAFT_STORE_DETAILS,
    DRAFT_ZIP_CODE,
    CLEAR_UPPER_FUNNEL_DRAFT,
    UPDATE_SMS_STATUS,
    TOGGLE_SELECT_AS_DEFAULT_PAYMENT,
    ADD_SUBSCRIBED_EMAIL,
    UPDATE_SEGMENTS,
    ADD_CC_REWARDS,
    UPDATE_PASSKEYS,
    UPDATE_TAX_STATUS,
    UPDATE_DEFAULT_SA_DATA
} from 'constants/actionTypes/user';
import Empty from 'constants/empty';

const initialState = {
    profileLocale: '',
    isInitialized: false,
    selectedAsDefaultPaymentName: '',
    ccRewards: {}
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case UPDATE:
            return Object.assign({}, state, action.data);
        case DRAFT_STORE_DETAILS: {
            const { preferredStoreInfo } = state;
            const nextState = {
                ...state,
                preferredStoreInfo: {
                    ...preferredStoreInfo,
                    draft: {
                        ...action.payload
                    }
                }
            };

            return nextState;
        }
        case UPDATE_SMS_STATUS: {
            const nextState = {
                ...state,
                smsStatus: action.payload
            };

            return nextState;
        }
        case ADD_SUBSCRIBED_EMAIL: {
            const nextState = {
                ...state,
                subscribedAnonEmail: action.payload
            };

            return nextState;
        }
        case CLEAR_UPPER_FUNNEL_DRAFT: {
            const { preferredStoreInfo } = state;
            const nextState = {
                ...state,
                draft: {},
                preferredStoreInfo: {
                    ...preferredStoreInfo,
                    draft: {}
                }
            };

            return nextState;
        }
        case DRAFT_ZIP_CODE: {
            const nextState = {
                ...state,
                draft: { preferredZipCode: action.payload }
            };

            return nextState;
        }
        case TOGGLE_SELECT_AS_DEFAULT_PAYMENT:
            return {
                ...state,
                selectedAsDefaultPaymentName: action.payload.paymentName === state.selectedAsDefaultPaymentName ? '' : action.payload.paymentName
            };
        case UPDATE_SEGMENTS:
            return {
                ...state,
                segments: action.payload
            };
        case ADD_CC_REWARDS:
            return {
                ...state,
                ccRewards: action.data
            };
        case UPDATE_PASSKEYS: {
            return {
                ...state,
                passkeys: action.payload
            };
        }
        case UPDATE_TAX_STATUS: {
            return {
                ...state,
                tax: action.payload
            };
        }
        case UPDATE_DEFAULT_SA_DATA: {
            const { defaultSAZipCode, defaultSACountryCode } = action.payload || Empty.Object;

            return {
                ...state,
                defaultSAZipCode,
                defaultSACountryCode
            };
        }

        default:
            return state;
    }
};

export default reducer;
