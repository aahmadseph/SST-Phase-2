/* currently serves only Checkout errors, but can be reused globally */
import ReactDom from 'react-dom';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsActions from 'actions/ErrorsActions';
import Actions from 'actions/Actions';
import store from 'store/Store';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import uiUtils from 'utils/UI';

const {
    ERROR_LEVEL, ERROR_KEYS, ERROR_CODES, ERROR_LOCATION, ERRORS, INLINE_ERRORS, INLINE_ERROR_KEYS
} = ErrorConstants;

/**
 * Gets error from errors vocabulary
 * @param errorCode
 */
function getError(errorCode) {
    return ERRORS[errorCode];
}

/**
 * Tries to focus on error field\place
 */
function focusError(error) {
    const { getComp } = error;
    const { focus = () => {} } = getComp() || {};
    focus();
}

const getPropValFromError = function (error, prop, comp) {
    return typeof error[prop] === 'function' ? error[prop](comp && comp.props) : error[prop];
};

/**
 * If error is found, it is saved in Store with initial error data (code, message, etc) and
 * extra data, added from component
 */
function addError(errorCode, errorData, comp, message, errorId) {
    const error = {
        ...errorData,
        message: message ? message : getPropValFromError(errorData, 'message', comp),
        getComp: () => comp,
        location: ERROR_LOCATION.AFTER,
        errorId,
        errorKey: errorCode
    };
    store.dispatch(ErrorsActions.addError(error, errorCode));
}

function removeError(errorCode) {
    store.dispatch(ErrorsActions.removeError(errorCode));
}

function errorsLoop(errors, callback) {
    Object.keys(ERROR_LEVEL).forEach(errorLevel => {
        Object.keys(errors[errorLevel]).forEach(errorKey => {
            const error = errors[errorLevel][errorKey];
            callback(error, errorKey);
        });
    });
}

function getMessage(code) {
    const error = getError(code);

    return typeof error?.message === 'function' ? error.message() : typeof error?.message === 'string' ? error.message : '';
}

/**
 * Collects errors from fields or components array. Component should have validateErrorWithCode
 * function, which returns error code or false if no errors found
 * @param fieldComps
 */
function collectClientFieldErrors(fieldComps) {
    fieldComps.forEach(function (comp) {
        if (comp && comp.validateErrorWithCode) {
            const errorCode = comp.validateErrorWithCode();
            const error = getError(errorCode);

            if (error) {
                addError(errorCode, error, comp);
            } else {
                const possibleErrorCodes = comp.getPossibleErrorCodes ? comp.getPossibleErrorCodes() : null;

                if (possibleErrorCodes) {
                    possibleErrorCodes.forEach(removeError);
                }
            }
        }
    });
}

/**
 * Collects errors from backend. Supports all needed sources in response
 * @param errorData - response of backend
 * @param comp - component where error occurs
 */
function collectBackEndErrors(errorData, comp) {
    const addErrorFields = function (error, errorFields) {
        // Temporary for analytics purpose
        return Object.assign({}, error, { errorFields: errorFields });
    };
    const {
        errors = {}, paymentGroups = {}, errorMessages = [], errorFields = [], errorCode: errorId
    } = errorData;
    const unknownErrors = errorMessages;
    const allErrorMessages = [];

    const addBackEndError = function (error, errorCode, initMessage, errorIdNumber) {
        const message = initMessage instanceof Array ? initMessage.join(' ') : initMessage;

        if (allErrorMessages.indexOf(message) >= 0) {
            // avoid duplication of error messages
            return;
        }

        if (error) {
            addError(errorCode, addErrorFields(error, errorFields), comp, message, errorIdNumber);
        } else {
            addBackEndError(getError(ERROR_CODES.UNKNOWN), ERROR_CODES.UNKNOWN, message, errorIdNumber);
        }

        allErrorMessages.push(message);
    };
    Object.keys(errors).forEach(errorCode => {
        if (errorCode !== 'message') {
            const error = getError(errorCode);
            let message = errors[errorCode] instanceof Array ? errors[errorCode].join(' ') : errors[errorCode];

            //special circumstance where CE was unable to return all
            //restrictedShipping messages in the errors object
            if (errorCode === ERROR_CODES.RESTRICTED_SHIPPING) {
                unknownErrors.forEach(unknownErrorsMessage => {
                    if (message.indexOf(unknownErrorsMessage) === -1) {
                        message += ' ' + unknownErrorsMessage;
                    }
                });
            }

            addBackEndError(error, errorCode, message || errors.message, errorId);
        }
    });
    const { paymentMessages = [] } = paymentGroups;
    paymentMessages.forEach(messageData => {
        const error = getError(messageData.messageContext);
        const { messages = [] } = messageData;
        addBackEndError(error, messageData.messageContext, messages.join(' '));
    });

    if (unknownErrors.length) {
        unknownErrors.forEach(message => {
            const error = getError(ERROR_CODES.UNKNOWN);

            if (allErrorMessages.indexOf(message) === -1) {
                // avoid duplication of error messages
                addBackEndError(error, ERROR_CODES.UNKNOWN, message);
            }
        });
    }
}

function clearErrors(level) {
    function clearError(error) {
        if (error.errorElement) {
            error.errorElement.remove();
        }

        const comp = error.getComp();

        if (comp && comp.showError) {
            comp.showError(null);
        }
    }

    const errors = store.getState().errors;
    errorsLoop(errors, error => clearError(error));
    store.dispatch(ErrorsActions.clearErrors(level));
}

/**
 * if error is not shown by component this method will try to show it anyways with standard styles
 * if error level is global we show it as a info modal
 * @param error
 */
// eslint-disable-next-line no-unused-vars
function placeErrorByDefault(error) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Errors');
    const comp = error.getComp();
    const { showInfoModal } = Actions;
    const label = getPropValFromError(error, 'label', comp);
    const message = getPropValFromError(error, 'message', comp);

    // process errors without passed comp reference
    // @TODO considering line 222 this should be never happeinnig, but according to tests it does:
    // HeadlessChrome 0.0.0 (Mac OS X 10.14.2) GiftCards ReCaptcha if form contains validation
    // errors OnSubmit, do not execute ReCaptcha FAILED
    // leave for future investigation
    if (!comp || (!comp.showError && error.level !== ERROR_LEVEL.GLOBAL)) {
        store.dispatch(
            showInfoModal({
                isOpen: true,
                title: label || getText('error'),
                message: message,
                buttonText: 'Ok'
            })
        );

        return;
    }

    const element = ReactDom.findDOMNode(comp);
    const errorElement = document.createElement('div');
    errorElement.innerHTML = message;
    errorElement.style.color = colors.red;
    errorElement.style.border = colors.red + ' 1px solid';

    switch (error.level) {
        case ERROR_LEVEL.FIELD:
            switch (error.location) {
                case ERROR_LOCATION.AFTER:
                    error.errorElement = element.parentNode.appendChild(errorElement);

                    break;
                case ERROR_LOCATION.BEFORE:
                    error.errorElement = element.parentNode.insertBefore(errorElement, comp);

                    break;
                case ERROR_LOCATION.REPLACE:
                    error.errorElement = element.parentNode.replaceChild(errorElement, comp);

                    break;
                default:
            }

            break;
        case ERROR_LEVEL.FORM:
            switch (error.location) {
                case ERROR_LOCATION.AFTER:
                    error.errorElement = element.appendChild(errorElement);

                    break;
                case ERROR_LOCATION.BEFORE:
                    error.errorElement = element.insertBefore(errorElement, element.firstChild);

                    break;
                case ERROR_LOCATION.REPLACE:
                    error.errorElement = element.parentNode.replaceChild(errorElement, element);

                    break;
                default:
            }

            break;
        case ERROR_LEVEL.GLOBAL:
            store.dispatch(
                showInfoModal({
                    isOpen: true,
                    title: label || getText('error'),
                    message: message,
                    buttonText: 'Ok'
                })
            );

            break;
        default:
    }
}

function showInlineGlobalError(errorId, errorKey) {
    return INLINE_ERRORS.includes(errorId) || INLINE_ERROR_KEYS.includes(errorKey);
}

function jumpToErrorRef(ref) {
    setTimeout(() => {
        ref && uiUtils.scrollTo({ ref });
    });
}

function placeError(error, errorKey, isJumpToError) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Errors');
    const comp = error.getComp();
    const message = getPropValFromError(error, 'message', comp);
    const value = getPropValFromError(error, 'value', comp);
    const label = getPropValFromError(error, 'label', comp);
    const isFrictionlessCheckoutPage = Location.isFrictionlessCheckoutPage();

    // even if error.level === ERROR_LEVEL.GLOBAL showError() has a higher priority
    // to decide how the error should be represented
    if (comp && comp.showError) {
        comp.showError(message, value, errorKey);

        isJumpToError && jumpToErrorRef({ current: comp.inputElementRef });
    } else {
        const showDialog = !showInlineGlobalError(error.errorId, errorKey);

        if (showDialog) {
            const { showInfoModal } = Actions;
            const htmlMessage = message.replace(/\n/g, '<br />');
            const forceHtmlMessage = message !== htmlMessage;

            const redirectToBasket = () => {
                if (
                    errorKey === ERROR_CODES.NOT_ENOUGH_BI_POINTS ||
                    errorKey === ERROR_CODES.NOT_ENOUGH_POINTS_ERROR ||
                    (errorKey === ERROR_CODES.INVALID_ORDER && !isFrictionlessCheckoutPage) ||
                    // errorKey for this errors is unknown
                    error.errorId === ERROR_KEYS.SAME_DAY_DISABLED ||
                    error.errorId === ERROR_KEYS.SDU_MISSING_PROFILE_DETAILS
                ) {
                    Location.setLocation('/basket');
                }
            };
            store.dispatch(
                showInfoModal({
                    isOpen: true,
                    isHtml: forceHtmlMessage,
                    title: label || getText('error'),
                    message: forceHtmlMessage ? htmlMessage : message,
                    buttonText: getText('ok'),
                    cancelCallback: redirectToBasket,
                    callback: redirectToBasket
                })
            );
        }
    }
}

/**
 * Validates and shows all errors collected up to the moment in Store
 * Returns true if errors are found
 * @returns {boolean}
 */
function validate(fieldsForValidation, shouldDispatchErrors = true, isJumpToError = false) {
    const errors = store.getState().errors;
    shouldDispatchErrors && store.dispatch(ErrorsActions.validateErrors(errors));
    let hasErrors = false;
    errorsLoop(errors, (error, errorKey) => {
        if (!fieldsForValidation || fieldsForValidation.indexOf(error.getComp()) > -1) {
            hasErrors = true;
            placeError(error, errorKey, isJumpToError);
        }
    });

    return hasErrors;
}

/**
 * Finds error in store by error code
 */
function findError(errorCode, errorLevel = ERROR_LEVEL.FIELD) {
    const errors = store.getState().errors;

    return errors[errorLevel][errorCode];
}

/**
 * Bundled method to call all steps of backend errors collect and validate
 */
function collectAndValidateBackEndErrors(errorData, comp) {
    clearErrors();
    collectBackEndErrors(errorData, comp);

    return validate();
}

function isFormattedError(message) {
    return typeof message === 'string' && /^\*\*(.+)\*\*/.test(message.trim());
}

/**
 * Tries to split formatted error message
 * Returns array consist of a first part and the rest of message.
 * If message is not a formatted error returns [null, <original message>]
 * @returns {array}
 */
function splitFormattedError(message) {
    let title = null;
    let outputMessage = message;

    if (isFormattedError(outputMessage)) {
        const messageParts = outputMessage.split('**');
        title = messageParts[1];
        outputMessage = messageParts[2];
    }

    return [title, outputMessage];
}

function getBackendError(errors = [], messageContext) {
    if (!Array.isArray(errors) || !errors.length) {
        return null;
    }

    let errorMsg = '';
    const filteredErrors = errors.filter(error => error.messageContext === messageContext);

    for (const error of filteredErrors) {
        errorMsg += error.messages.join(' ');
    }

    return errorMsg;
}

function renderGenericErrorModal(message) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Errors');

    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: getText('error'),
            message,
            buttonText: getText('ok'),
            showCloseButton: true
        })
    );
}

export default {
    clearErrors,
    collectAndValidateBackEndErrors,
    collectBackEndErrors,
    collectClientFieldErrors,
    ERROR_CODES,
    ERROR_LEVEL,
    ERROR_LOCATION,
    findError,
    focusError,
    getBackendError,
    getError,
    getMessage,
    isFormattedError,
    showInlineGlobalError,
    splitFormattedError,
    validate,
    renderGenericErrorModal
};
