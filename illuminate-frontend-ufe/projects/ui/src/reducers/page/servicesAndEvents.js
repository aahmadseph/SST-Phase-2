import { SET_SERVICES_AND_EVENTS } from 'constants/actionTypes/servicesAndEvents';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_SERVICES_AND_EVENTS: {
            const { data } = payload;

            return data;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
