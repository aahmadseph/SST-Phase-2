import { SET_GALLERY_PROFILE_CONTENT } from 'constants/actionTypes/myProfile';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_GALLERY_PROFILE_CONTENT: {
            return payload;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
