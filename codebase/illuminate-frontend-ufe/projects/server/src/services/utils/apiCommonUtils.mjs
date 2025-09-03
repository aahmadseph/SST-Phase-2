import { safelyParse } from '#server/utils/serverUtils.mjs';

const FAILED_REQUEST_ERROR = 'Failed request. Try again.';
const UNKNOWN_ERROR = 'Unknown error.';

function buildJsonError(code = -1, message = '', key = null) {
    const errorMessage = !message ? '' : message;
    const jsonError = {
        errorCode: code,
        errorMessages: [errorMessage],
        ...(key && { errorKey: key })
    };

    return jsonError;
}

function extractError(error = {}) {
    // https://confluence.sephora.com/wiki/display/FEE/Example+api+error+responses+in+Woody

    const result = {
        errorCode: -2,
        errorMessage: UNKNOWN_ERROR,
        longErrorMessage: null
    };

    const data = safelyParse(error?.data);

    if (data?.errorCode && data?.errorMessages) {
        // 1. Standard backend error
        result.errorCode = data.errorCode;
        result.errorMessage = data.errorMessages[0];
    } else if (error?.message) {
        // 2. Internal error
        result.errorMessage = error.message;
    } else if (error?.err && error?.failed) {
        // 3. Failed request
        result.longErrorMessage = error.err;
        result.errorMessage = FAILED_REQUEST_ERROR;

        if (error?.statusCode) {
            result.errorCode = error?.statusCode;
        }
    } else if (error?.errMsg) {
        // 4. Generic error.
        // See apiRequest.mjs: "in the event that we have no err object we handle this semi gracefully".
        result.errorMessage = error.errMsg;

        if (error?.statusCode) {
            result.errorCode = error.statusCode;
        }
    }

    return result;
}

export {
    buildJsonError, extractError
};
