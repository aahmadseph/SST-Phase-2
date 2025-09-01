import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import localeUtils from 'utils/LanguageLocale';
import bccEmailSMSOptInService from 'services/api/bccEmailSmsOptIn';

import { Box, Flex, Button } from 'components/ui';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import TextInput from 'components/Inputs/TextInput/TextInput';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import Markdown from 'components/Markdown/Markdown';

class BccEmailSmsOptIn extends BaseClass {
    state = {
        emailFocused: false,
        showSuccess: false,
        showError: false,
        formattedPhone: '',
        successMsg: null,
        errorMsg: null
    };

    formatPhoneNumber = e => {
        const inputValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
        this.setState({ formattedPhone: formattedPhone });
    };

    isFormValid = () => {
        const emailInputValue = this.emailInput?.getValue() || '';
        const phoneNumberInputValue = this.phoneInput?.getValue() || '';

        this.setState({
            showError: false,
            showSuccess: false,
            errorMsg: null
        });

        if (emailInputValue.length > 0 && phoneNumberInputValue.length === 0) {
            return !this.emailInput.validateError();
        } else if (phoneNumberInputValue.length > 0 && emailInputValue.length === 0) {
            return !this.phoneInput.validateError();
        } else if (emailInputValue.length === 0 && phoneNumberInputValue.length === 0) {
            const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccEmailSmsOptIn/locales', 'BccEmailSmsOptIn');
            const errorMsg = getText('errorMsg');
            this.setState({
                showError: true,
                showSuccess: false,
                errorMsg: errorMsg
            });

            return false;
        } else {
            return !this.emailInput?.validateError() && !this.phoneInput?.validateError();
        }
    };

    handleSubmit = e => {
        e.preventDefault();

        if (this.isFormValid()) {
            const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccEmailSmsOptIn/locales', 'BccEmailSmsOptIn');

            const emailInputValue = this.emailInput?.getValue() || '';
            const phoneNumberInputValue = this.phoneInput?.getValue().replace(/[()]|-| /g, '') || '';
            const currentLocale = localeUtils.getCurrentLanguageCountryCode();
            const pageName = digitalData.page.pageInfo.pageName;

            bccEmailSMSOptInService
                .submitEmailSMSOptInForm({
                    email: emailInputValue,
                    phoneNumber: phoneNumberInputValue,
                    pageName: pageName,
                    locale: currentLocale
                })
                .then(() => {
                    let extraSuccessMsg;

                    if (emailInputValue.length > 0 && phoneNumberInputValue.length === 0) {
                        extraSuccessMsg = getText('successMsgEmail');
                    } else if (phoneNumberInputValue.length > 0 && emailInputValue.length === 0) {
                        extraSuccessMsg = getText('successMsgPhone');
                    } else {
                        extraSuccessMsg = false;
                    }

                    const successMsg = extraSuccessMsg ? `${getText('successMsg')} ${extraSuccessMsg}.` : `${getText('successMsg')}.`;
                    /* eslint-disable no-unused-expressions */
                    this.emailInput?.input.setValue('');
                    this.phoneInput?.setValue('');
                    /* eslint-disable no-unused-expressions */
                    this.setState({
                        showError: false,
                        showSuccess: true,
                        formattedPhone: '',
                        successMsg: successMsg,
                        errorMsg: null
                    });
                })
                .catch(err => {
                    this.setState({
                        showError: true,
                        showSuccess: false,
                        errorMsg: err && err.errorMessages && err.errorMessages[0]
                    });
                });
        }
    };

    handleSetEmailFocused = emailFocused => () => {
        this.setState({ emailFocused });
    };

    render() {
        const { emailDisclaimer = '', phoneDisclaimer = '', showEmailField, showMobileNumberField } = this.props;

        const { showSuccess, showError, errorMsg, successMsg } = this.state;

        const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccEmailSmsOptIn/locales', 'BccEmailSmsOptIn');

        const disclaimerText = `${emailDisclaimer}${phoneDisclaimer}`;

        return (
            <Box
                is='form'
                lineHeight='tight'
                onSubmit={this.handleSubmit}
                noValidate
            >
                <Flex>
                    {showEmailField && (
                        <InputEmail
                            marginBottom={null}
                            customStyle={{
                                root: {
                                    flex: 1,
                                    marginRight: -1
                                },
                                innerWrap: showMobileNumberField && [
                                    {
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0
                                    },
                                    this.state.emailFocused && {
                                        position: 'relative',
                                        zIndex: 1
                                    }
                                ]
                            }}
                            onFocus={this.handleSetEmailFocused(true)}
                            onBlur={this.handleSetEmailFocused(false)}
                            placeholder={getText('emailAddresLabel')}
                            name='email'
                            ref={c => (this.emailInput = c)}
                            invalid={showError}
                        />
                    )}
                    {showMobileNumberField && (
                        <TextInput
                            marginBottom={null}
                            customStyle={{
                                root: {
                                    flex: 1
                                },
                                innerWrap: showEmailField && {
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                }
                            }}
                            placeholder={getText('phoneNumber')}
                            name='mobilePhone'
                            autoComplete='tel'
                            autoCorrect='off'
                            type='tel'
                            value={this.state.formattedPhone}
                            maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onChange={this.formatPhoneNumber}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            ref={c => (this.phoneInput = c)}
                            invalid={showError}
                            validate={phoneNumber => {
                                return phoneNumber.length !== FormValidator.FIELD_LENGTHS.formattedPhone ? getText('phoneInputErrorMsg') : false;
                            }}
                        />
                    )}
                </Flex>
                {(showSuccess || showError) && <InputMsg color={showError && 'error'}>{showSuccess && successMsg ? successMsg : errorMsg}</InputMsg>}
                <Button
                    marginTop={2}
                    type='submit'
                    size='sm'
                    variant='primary'
                    block={true}
                    children={getText('signUp')}
                />
                <Markdown
                    marginTop={2}
                    color='gray'
                    fontSize='10px' // not part of design system
                    lineHeight='tight'
                    content={disclaimerText}
                />
            </Box>
        );
    }
}

export default wrapComponent(BccEmailSmsOptIn, 'BccEmailSmsOptIn', true);
