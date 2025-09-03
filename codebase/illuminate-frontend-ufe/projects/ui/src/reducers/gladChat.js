import { UPDATE_GLADCHAT_STATE } from 'constants/actionTypes/gladChat';

const initialState = {};

const gladChat = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_GLADCHAT_STATE: {
            return payload;
        }
        default: {
            return state;
        }
    }
};

export default gladChat;
