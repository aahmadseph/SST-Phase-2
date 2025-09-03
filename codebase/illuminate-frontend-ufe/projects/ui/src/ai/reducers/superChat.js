const ACTION_TYPES = {
    SHOW_SUPER_CHAT: 'SHOW_SUPER_CHAT',
    SUPER_CHAT_CONFIG: 'SUPER_CHAT_CONFIG'
};

const initialState = {
    showSuperChat: false,
    productInfo: null,
    entryPointData: null,
    prompts: [],
    config: {}
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ACTION_TYPES.SHOW_SUPER_CHAT: {
            return {
                ...state,
                showSuperChat: payload.showSuperChat,
                prompts: payload.prompts,
                entryPointData: payload.entryPointData
            };
        }
        case ACTION_TYPES.SUPER_CHAT_CONFIG: {
            return {
                ...state,
                config: payload
            };
        }

        default: {
            return state;
        }
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
