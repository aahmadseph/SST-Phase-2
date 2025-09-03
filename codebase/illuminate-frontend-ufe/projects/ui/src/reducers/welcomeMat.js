const ACTION_TYPES = { UPDATE_WELCOME: 'UPDATE_WELCOME' };

const initialState = {};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_WELCOME: {
            const { welcomeMat, fromCache } = action;

            if (welcomeMat === null) {
                return null;
            }

            return { ...welcomeMat, fromCache };
        }

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
