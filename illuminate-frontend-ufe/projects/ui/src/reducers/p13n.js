import {
    SET_INITIALIZATION,
    SET_P13N_DATA_FOR_PREVIEW,
    SET_P13N_DATA,
    SET_P13N_VARIATIONS,
    SET_ACTIVE_P13N_VARIATION,
    SET_SID_DATA,
    UPDATE_SID_DATA
} from 'constants/actionTypes/personalization';

const initialState = {
    isInitialized: false,
    variations: {},
    activeVariations: {},
    sid: [],
    data: []
};

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case SET_INITIALIZATION:
            return Object.assign({}, state, {
                isInitialized: payload
            });

        case SET_P13N_DATA_FOR_PREVIEW:
            return Object.assign({}, state, {
                isInitialized: true,
                data: [...state.data, ...payload]
            });

        case SET_P13N_DATA:
            return Object.assign({}, state, {
                isInitialized: true,
                headData: payload
            });

        case SET_P13N_VARIATIONS:
            return Object.assign({}, state, {
                variations: {
                    ...state.variations,
                    ...payload
                }
            });

        case SET_ACTIVE_P13N_VARIATION:
            return Object.assign({}, state, {
                activeVariations: {
                    ...state.activeVariations,
                    ...payload
                }
            });

        case SET_SID_DATA:
            return Object.assign({}, state, {
                sid: [...state.sid, payload]
            });

        case UPDATE_SID_DATA: {
            const nextState = {
                ...state
            };

            nextState.sid[nextState.sid.indexOf(payload.prevSid)] = payload.currentSid;

            return nextState;
        }

        default:
            return state;
    }
};

export default reducer;
