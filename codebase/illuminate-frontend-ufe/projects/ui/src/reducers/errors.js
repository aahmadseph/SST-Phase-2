import ErrorConstants from 'utils/ErrorConstants';

const ACTION_TYPES = {
    ADD_ERROR: 'ADD_ERROR',
    REMOVE_ERROR: 'REMOVE_ERROR',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
    VALIDATE_ERRORS: 'VALIDATE_ERRORS'
};

const initialState = {
    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
    [ErrorConstants.ERROR_LEVEL.FORM]: {},
    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.ADD_ERROR: {
            const { errorCode, error } = action;
            const errorsObj = Object.assign({}, state[error.level]);
            errorsObj[errorCode] = error;

            return Object.assign({}, state, { [error.level]: errorsObj });
        }
        case ACTION_TYPES.REMOVE_ERROR: {
            const { errorCode } = action;
            Object.keys(state).forEach(errorLevel => {
                delete state[errorLevel][errorCode];
            });

            return Object.assign({}, state);
        }
        case ACTION_TYPES.CLEAR_ERRORS: {
            const { level } = action;

            if (level) {
                return Object.assign({}, state, { [level]: {} });
            } else {
                return Object.assign({}, state, {
                    [ErrorConstants.ERROR_LEVEL.GLOBAL]: {},
                    [ErrorConstants.ERROR_LEVEL.FORM]: {},
                    [ErrorConstants.ERROR_LEVEL.FIELD]: {}
                });
            }
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
