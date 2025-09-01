import errorsReducer from 'reducers/errors';
const { ACTION_TYPES: TYPES } = errorsReducer;

function addError(error, errorCode) {
    return {
        type: TYPES.ADD_ERROR,
        error: error,
        errorCode: errorCode
    };
}

function removeError(errorCode) {
    return {
        type: TYPES.REMOVE_ERROR,
        errorCode: errorCode
    };
}

function clearErrors(level) {
    return {
        type: TYPES.CLEAR_ERRORS,
        level: level
    };
}

function validateErrors(errors) {
    return {
        type: TYPES.VALIDATE_ERRORS,
        errors: errors
    };
}

export default {
    TYPES,
    addError,
    removeError,
    clearErrors,
    validateErrors
};
