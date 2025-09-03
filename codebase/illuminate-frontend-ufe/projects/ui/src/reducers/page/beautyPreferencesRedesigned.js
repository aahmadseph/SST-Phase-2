import { SET_BEAUTY_PREFERENCES_REDESIGNED } from 'constants/actionTypes/beautyPreferencesRedesigned';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_BEAUTY_PREFERENCES_REDESIGNED: {
            return { ...state, ...payload };
        }

        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
