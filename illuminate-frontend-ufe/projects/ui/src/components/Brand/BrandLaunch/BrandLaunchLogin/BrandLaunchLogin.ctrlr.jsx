/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Text, Link, Icon
} from 'components/ui';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Markdown from 'components/Markdown/Markdown';
import FormValidator from 'utils/FormValidator';
import ErrorList from 'components/ErrorList';
import HelperUtils from 'utils/Helpers';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';

const { BRAND_LAUNCH_PAGENAME, DEFAULT_PAGETYPE } = anaConsts.SMS;
const { isCanada } = LanguageLocaleUtils;

const MAX_VISIBLE_PHONE_DIGITS = 3;

class BrandLaunchLogin extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            errorMessages: [],
            displayNotYouLink: false,
            passwordFocused: false,
            email: '',
            password: '',
            showMobileConfirmModal: false,
            formattedPhone: '',
            mobile: null
        };
    }

    formatPhoneNumber = e => {
        const inputValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
        this.setState({
            formattedPhone: formattedPhone,
            mobile: e.target.value
        });
    };

    getHiddenPhoneNumber = () => {
        const { mobile } = this.state;

        if (!mobile || mobile.length < MAX_VISIBLE_PHONE_DIGITS) {
            return '••• ••• ••••';
        }

        return `••• ••• •${mobile.substr(mobile.length - MAX_VISIBLE_PHONE_DIGITS)}`;
    };

    handleCreateAccountClick = () => {
        this.props.showSignInModal({ isOpen: false });

        this.props.showRegisterModal({
            isOpen: true
        });
    };

    forgotPassword = () => {
        this.props.showSignInModal({ isOpen: false });
        this.props.showForgotPasswordModal(true, this.loginInput.getValue());
    };

    handleEmailInputChange = e => {
        e.preventDefault();
        this.setState({
            email: e.target.value,
            displayNotYouLink: false
        });
    };

    handlePasswordInputChange = e => {
        e.preventDefault();
        this.setState({ password: e.target.value });
    };

    textAlertsFailureCallback = err => {
        if (err.errorMessages) {
            this.setState({ errorMessages: err.errorMessages });
        } else {
            this.setState({ errorMessages: [this.props.textResources.submissionError] });
        }
    };

    handleSubmitPhone = e => {
        e.preventDefault();
        const maskedPhoneNumber = this.getHiddenPhoneNumber();

        if (this.isValidPhoneOnly()) {
            this.props.submitSMSForm(this.state.mobile, BRAND_LAUNCH_PAGENAME, maskedPhoneNumber, this.textAlertsFailureCallback, DEFAULT_PAGETYPE);
        }
    };

    handleSignIn = e => {
        e.preventDefault();

        if (this.isValid()) {
            this.props.submitSignInForm(
                this.state.email,
                this.state.password,
                null,
                false,
                () => this.handleSubmitPhone(e),
                this.textAlertsFailureCallback,
                false,
                null,
                false,
                false,
                null,
                null
            );
        }
    };

    isValid = () => {
        const fieldsForValidation = [this.loginInput, this.passwordInput, this.mobileInput];
        const errors = FormValidator.getErrors(fieldsForValidation);

        return !errors.fields.length;
    };

    isValidPhoneOnly = () => {
        const fieldsForValidation = [this.mobileInput];
        const errors = FormValidator.getErrors(fieldsForValidation);

        return !errors.fields.length;
    };

    validatePhone = mobile => {
        if (FormValidator.isEmpty(mobile)) {
            return this.props.enterMobileErrorMessage;
        }

        if (mobile.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
            return this.props.enterMobileErrorMessage;
        }

        return null;
    };

    handleSetPasswordFocused = passwordFocused => () => {
        this.setState({ passwordFocused });
    };

    render() {
        const {
            user,
            isAnonymous,
            stepOne,
            buttonSignIn,
            buttonSendAlerts,
            noAccount,
            createAccount,
            emailAddressLabel,
            notYouMessage,
            passwordLabel,
            hidePasswordLinkAriaLabel,
            showPasswordLinkAriaLabel,
            enterPasswordErrorMessage,
            forgotPassword,
            stepTwo,
            mobileLabel,
            lead,
            disclaimerCA,
            disclaimerUS
        } = this.props;

        const isEmailDisabled = this.props.isEmailDisabled || false;
        const userInitialized = user.isInitialized;

        return (
            <>
                <Text
                    is='p'
                    marginBottom={4}
                    children={lead}
                />
                <Box
                    maxWidth={[null, 343]}
                    marginBottom={[4, 5]}
                >
                    {userInitialized && !isAnonymous && (
                        <Box
                            is='form'
                            noValidate={true}
                            onSubmit={this.handleSubmitPhone}
                        >
                            <ErrorList errorMessages={this.state.errorMessages} />
                            <TextInput
                                type='tel'
                                label={mobileLabel}
                                required={true}
                                ref={c => {
                                    if (c !== null) {
                                        this.mobileInput = c;
                                    }
                                }}
                                value={this.state.formattedPhone}
                                onChange={this.formatPhoneNumber}
                                validate={this.validatePhone}
                            />
                            <Button
                                variant='primary'
                                block={true}
                                type='submit'
                                children={buttonSendAlerts}
                            />
                        </Box>
                    )}

                    {(!userInitialized || isAnonymous) && (
                        <Box
                            is='form'
                            lineHeight='tight'
                            noValidate={true}
                            onSubmit={this.handleSignIn}
                            style={!userInitialized ? { visibility: 'hidden' } : null}
                        >
                            <ErrorList errorMessages={this.state.errorMessages} />
                            <Text
                                is='h2'
                                display='block'
                                fontWeight='bold'
                                fontSize='md'
                                marginBottom={1}
                                children={stepOne}
                            />

                            <Text
                                is='p'
                                marginBottom={4}
                            >
                                {noAccount}{' '}
                                <Link
                                    color='blue'
                                    padding={1}
                                    margin={-1}
                                    underline={true}
                                    onClick={this.handleCreateAccountClick}
                                    children={createAccount}
                                />
                            </Text>

                            <InputEmail
                                label={emailAddressLabel}
                                name='username'
                                disabled={isEmailDisabled}
                                onChange={this.handleEmailInputChange}
                                infoLink={
                                    this.state.displayNotYouLink && {
                                        children: notYouMessage,
                                        onClick: this.signOut
                                    }
                                }
                                ref={c => {
                                    if (c !== null) {
                                        this.loginInput = c;
                                    }
                                }}
                            />

                            <TextInput
                                marginBottom={null}
                                label={passwordLabel}
                                required={true}
                                autoComplete='current-password'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck={false}
                                type={this.state.showPassword ? 'text' : 'password'}
                                name='password'
                                id='signin_password'
                                infoLink={{
                                    ['aria-label']: this.state.showPassword ? hidePasswordLinkAriaLabel : showPasswordLinkAriaLabel,
                                    color: this.state.showPassword || 'gray',
                                    onClick: () => {
                                        this.setState({ showPassword: !this.state.showPassword });
                                        const passwordField = document.getElementById('signin_password');

                                        if (passwordField) {
                                            passwordField.focus();
                                        }
                                    },
                                    lineHeight: 0,
                                    children: (
                                        <Icon
                                            name={this.state.showPassword ? 'eye' : 'eyeCrossed'}
                                            color={this.state.passwordFocused ? 'black' : 'gray'}
                                        />
                                    )
                                }}
                                value={this.state.password}
                                ref={c => {
                                    if (c !== null) {
                                        this.passwordInput = c;
                                    }
                                }}
                                onChange={this.handlePasswordInputChange}
                                onFocus={this.handleSetPasswordFocused(true)}
                                onBlur={this.handleSetPasswordFocused(false)}
                                validate={password => {
                                    if (FormValidator.isEmpty(password)) {
                                        return enterPasswordErrorMessage;
                                    }

                                    return null;
                                }}
                            />
                            <Box marginTop={1}>
                                <Link
                                    color='blue'
                                    padding={1}
                                    margin={-1}
                                    onClick={this.forgotPassword}
                                    children={forgotPassword}
                                />
                            </Box>
                            <Text
                                is='h2'
                                fontWeight='bold'
                                fontSize='md'
                                marginY={4}
                                children={stepTwo}
                            />
                            <TextInput
                                type='tel'
                                label={mobileLabel}
                                required={true}
                                name='mobile'
                                ref={c => {
                                    if (c !== null) {
                                        this.mobileInput = c;
                                    }
                                }}
                                value={this.state.formattedPhone}
                                onChange={this.formatPhoneNumber}
                                validate={this.validatePhone}
                            />
                            <Button
                                variant='primary'
                                block={true}
                                type='submit'
                                children={buttonSignIn}
                            />
                        </Box>
                    )}
                </Box>

                <Markdown
                    targetWindow='new'
                    content={isCanada() ? disclaimerCA : disclaimerUS}
                    fontSize='xs'
                    style={!userInitialized ? { visibility: 'hidden' } : null}
                />
            </>
        );
    }
}

BrandLaunchLogin.propTypes = {
    isAnonymous: PropTypes.bool.isRequired,
    stepOne: PropTypes.string.isRequired,
    buttonSignIn: PropTypes.string.isRequired,
    buttonSendAlerts: PropTypes.string.isRequired,
    noAccount: PropTypes.string.isRequired,
    createAccount: PropTypes.string.isRequired,
    emailAddressLabel: PropTypes.string.isRequired,
    notYouMessage: PropTypes.string.isRequired,
    passwordLabel: PropTypes.string.isRequired,
    hidePasswordLinkAriaLabel: PropTypes.string.isRequired,
    showPasswordLinkAriaLabel: PropTypes.string.isRequired,
    enterPasswordErrorMessage: PropTypes.string.isRequired,
    enterMobileErrorMessage: PropTypes.string.isRequired,
    forgotPassword: PropTypes.string.isRequired,
    stepTwo: PropTypes.string.isRequired,
    mobileLabel: PropTypes.string.isRequired,
    submissionError: PropTypes.string.isRequired,
    showSignInModal: PropTypes.func.isRequired,
    showRegisterModal: PropTypes.func.isRequired,
    showForgotPasswordModal: PropTypes.func.isRequired,
    submitSMSForm: PropTypes.func.isRequired,
    submitSignInForm: PropTypes.func.isRequired
};

export default wrapComponent(BrandLaunchLogin, 'BrandLaunchLogin', true);
