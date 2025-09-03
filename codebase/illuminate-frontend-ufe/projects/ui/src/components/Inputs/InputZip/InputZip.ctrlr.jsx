/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import localeUtils from 'utils/LanguageLocale';

class InputZip extends BaseClass {
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Inputs/InputZip/locales', 'InputZip');

        const {
            emptyZipError, invalidZipError, isOnlineOnly, value, placeholder, hidePlaceHolder, ...props
        } = this.props;

        const isCanada = localeUtils.isCanada();
        const locale = isCanada ? 'CA' : 'US';
        const zipMaxLength = isCanada ? 7 : 10;
        const placeHolderMessage = isOnlineOnly ? getText('placeholderOnline') : isCanada ? getText('placeholderCa') : getText('placeholderUs');

        const emptyZipMsg = emptyZipError ? emptyZipError : getText('messageEmpty');

        const invalidZipMsg = invalidZipError ? invalidZipError : getText('messageInvalid');

        return (
            <TextInput
                {...props}
                autoComplete='postal-code'
                autoCorrect='off'
                name='zipCode'
                placeholder={placeholder ? placeholder : !hidePlaceHolder && placeHolderMessage}
                maxLength={zipMaxLength}
                ref={input => (this.input = input)}
                value={isOnlineOnly ? '' : value}
                validate={
                    this.props.validate ||
                    function (zipCode) {
                        if (FormValidator.isEmpty(zipCode)) {
                            return emptyZipMsg;
                        } else if (!FormValidator.isValidZipCode(zipCode, locale)) {
                            return invalidZipMsg;
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
        return this.input.validateError();
    };

    empty = () => {
        return this.input.empty();
    };

    focus = () => {
        return this.input.focus();
    };
}

export default wrapComponent(InputZip, 'InputZip', true);
