import { SET_SMART_SKIN_SCAN_CONTENT } from 'constants/actionTypes/smartSkinScan';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_SMART_SKIN_SCAN_CONTENT: {
            return payload;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
