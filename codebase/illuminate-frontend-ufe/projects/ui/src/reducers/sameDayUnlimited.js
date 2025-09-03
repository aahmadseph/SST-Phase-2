import { UPDATE_SDU_SUBSCRIPTION, LOAD_BCC_CONTENT } from 'constants/actionTypes/sameDayUnlimited';

const initialState = {
    SDUsubscription: {},
    bccContent: {}
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_SDU_SUBSCRIPTION: {
            return {
                ...state,
                SDUsubscription: payload
            };
        }
        case LOAD_BCC_CONTENT: {
            return {
                ...state,
                bccContent: payload.regions
            };
        }
        default: {
            return state;
        }
    }
};

export default {
    reducer,
    initialState
};
