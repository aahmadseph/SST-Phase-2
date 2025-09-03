/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';

const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;

class InputEmail extends BaseClass {
    render() {
        const {
            name = 'email', login, validate, isAdsRestricted, ...props
        } = this.props;

        const emailMaxLength = isAdsRestricted ? FIELD_LENGTHS.emailAdsRestricted : FIELD_LENGTHS.email;

        return (
            <TextInput
                {...props}
                required={true}
                autoComplete='email'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck={false}
                type='email'
                name={name}
                value={login ? login : ''}
                maxLength={emailMaxLength}
                ref={input => (this.input = input)}
                validateError={
                    validate ||
                    function (email) {
                        if (FormValidator.isEmpty(email)) {
                            return ErrorConstants.ERROR_CODES.EMAIL_EMPTY;
                        } else if (!FormValidator.isValidEmailAddress(email)) {
                            return ErrorConstants.ERROR_CODES.EMAIL_INVALID;
                        }

                        const maxLength = FIELD_LENGTHS.emailAdsRestricted;

                        if (isAdsRestricted && !FormValidator.isValidLength(email, 1, maxLength)) {
                            return ErrorConstants.ERROR_CODES.EMAIL_ADS_LONG;
                        }

                        return null;
                    }
                }
                validate={
                    validate ||
                    function (email) {
                        if (FormValidator.isEmpty(email)) {
                            return ErrorConstants.ERRORS.EMAIL_EMPTY.message();
                        } else if (!FormValidator.isValidEmailAddress(email)) {
                            return ErrorConstants.ERRORS.EMAIL_INVALID.message();
                        }

                        return null;
                    }
                }
            />
        );
    }

    getValue = () => {
        return this.input.getValue();
    };

    validateError = () => {
        return this.input && this.input.validateError();
    };

    empty = () => {
        return this.input.empty();
    };

    focus = () => {
        return this.input.focus();
    };

    validateErrorWithCode = () => {
        return this.input.props.validateError ? this.input.props.validateError(this.input.getValue()) : null;
    };

    showError = (error, value) => {
        this.input && this.input.showError(error, value);
    };
}

export default wrapComponent(InputEmail, 'InputEmail', true);
