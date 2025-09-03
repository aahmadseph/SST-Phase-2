import { SET_GALLERY_CONTENT, SET_GALLERY_BANNER_CONTENT } from 'constants/actionTypes/gallery';

const initialState = {};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_GALLERY_CONTENT: {
            return payload;
        }
        case SET_GALLERY_BANNER_CONTENT: {
            return {
                ...state,
                ...payload
            };
        }
        default: {
            return state;
        }
    }
};

export default reducer;
