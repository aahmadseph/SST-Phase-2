/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors } from 'style/config';
import {
    Box, Button, Grid, Text, Link
} from 'components/ui';
import ErrorList from 'components/ErrorList';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Copy from 'components/Content/Copy';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import PasswordRevealInput from 'components/Inputs/PasswordRevealInput';
import FormValidator from 'utils/FormValidator';
import userUtils from 'utils/User';
import { mediaQueries } from 'style/config';
import helpers from 'utils/Helpers';
import analyticsConstants from 'analytics/constants';
import Location from 'utils/Location';

const {
    SMS_PAGENAME_PAGETYPE,
    SMS: {
        TEXT_ALERT_PAGENAME, BRAND_LAUNCH_PAGENAME, CF_GLOBAL_PAGENAME, FOOTER_PAGENAME, REWARDS_BAZAAR, APP_DOWNLOAD, ROUGE_PREVIEW
    }
} = analyticsConstants;
const { specialCharacterRegex, getHiddenPhoneNumber } = helpers;

class SMSOptIn extends BaseClass {
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
            mobile: null,
            presetLogin: '',
            origin: null
        };
    }

    componentDidMount() {
        this.setState({
            displayNotYouLink: userUtils.isRecognized(),
            presetLogin: this.props.user.login
        });

        const analyticsOrigin = new URLSearchParams(global.window?.location.search).get('origin');

        if (analyticsOrigin) {
            this.setState({ origin: analyticsOrigin });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.user.isInitialized !== prevProps.user.isInitialized) {
            this.setState({
                displayNotYouLink: userUtils.isRecognized(),
                presetLogin: this.props.user.login
            });
        }
    }

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

    forgotPassword = () => {
        this.props.showSignInModal({ isOpen: false });
        this.props.showForgotPasswordModal(true, this.loginInput.getValue());
    };

    textAlertsFailureCallback = err => {
        if (userUtils.isPhoneRejectedError(err)) {
            this.mobileInput.showError(this.props.phoneNumberRejected);
        } else if (err.errorMessages) {
            this.setState({ errorMessages: err.errorMessages });
        } else {
            this.setState({ errorMessages: [this.props.submissionError] });
        }
    };

    handleSignIn = e => {
        e.preventDefault();
        this.setState({
            errorMessages: []
        });

        if (this.isValid()) {
            this.props.submitSignInForm(
                this.state.email,
                this.state.password,
                null,
                false,
                () => this.handleSubmitPhone(e, 'NotSignedInRewardsBazar'),
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

    handleCreateAccountClick = () => {
        this.props.showSignInModal({ isOpen: false });

        this.props.showRegisterModal({
            isOpen: true
        });
    };

    renderAnonymousForm(isModal) {
        const {
            noAccount,
            createAccount,
            emailAddressLabel,
            notYouMessage,
            passwordLabel,
            enterPasswordErrorMessage,
            forgotPassword,
            stepOne,
            stepTwo
        } = this.props;

        return (
            <Box
                is='form'
                lineHeight='tight'
                noValidate={true}
                onSubmit={this.handleSignIn}
                marginTop={5}
                style={!this.props.user.isInitialized ? { visibility: 'hidden' } : null}
            >
                <Text
                    is='p'
                    fontWeight='bold'
                    children={stepOne}
                />
                <Text
                    is='p'
                    marginTop={1}
                    marginBottom={4}
                >
                    {`${noAccount} `}
                    <Link
                        color='blue'
                        underline={true}
                        onClick={this.handleCreateAccountClick}
                        children={createAccount}
                    />
                </Text>
                <ErrorList errorMessages={this.state.errorMessages} />
                <Grid
                    columns={!isModal && [null, 3]}
                    gap={!isModal && [0, 4]}
                >
                    <InputEmail
                        label={emailAddressLabel}
                        name='username'
                        disabled={false}
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
                    <PasswordRevealInput
                        marginBottom={null}
                        label={passwordLabel}
                        required={true}
                        autoComplete='current-password'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck={false}
                        name='password'
                        id='signin_password'
                        value={this.state.password}
                        ref={c => {
                            if (c !== null) {
                                this.passwordInput = c;
                            }
                        }}
                        onChange={this.handlePasswordInputChange}
                        validate={password => {
                            if (FormValidator.isEmpty(password)) {
                                return enterPasswordErrorMessage;
                            }

                            return null;
                        }}
                    />
                    <Link
                        color='blue'
                        height={'44px'}
                        onClick={this.forgotPassword}
                        children={`${forgotPassword}?`}
                        css={
                            isModal
                                ? {
                                    textAlign: 'right'
                                }
                                : {
                                    textAlign: 'right',
                                    [mediaQueries.sm]: {
                                        textAlign: 'left'
                                    }
                                }
                        }
                    />
                </Grid>
                <Text
                    is='p'
                    fontWeight='bold'
                    marginTop={4}
                    children={stepTwo}
                    marginBottom={4}
                />
                {this.renderMobileNumberForm(3, isModal, true)}
            </Box>
        );
    }

    renderMobileNumberForm(columns, isModal, isAnonymous = false) {
        const { mobileLabel, buttonSendAlerts, buttonSignIn } = this.props;

        return (
            <Box>
                <Grid
                    columns={!isModal && [null, columns]}
                    gap={!isModal && [0, 4]}
                >
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
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        validate={this.validatePhone}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                    />
                    <Button
                        variant='primary'
                        block={true}
                        type='submit'
                        children={isAnonymous ? buttonSignIn : buttonSendAlerts}
                    />
                </Grid>
            </Box>
        );
    }

    renderLoggedInForm(isModal) {
        return (
            <Box
                is='form'
                noValidate={true}
                marginTop={5}
                width={isModal ? '100%' : ['100%', '60%']}
                onSubmit={e => this.handleSubmitPhone(e, 'signedInRewardsBazar')}
            >
                <ErrorList errorMessages={this.state.errorMessages} />
                {this.renderMobileNumberForm(2, isModal)}
            </Box>
        );
    }

    validatePhone = mobile => {
        if (FormValidator.isEmpty(mobile)) {
            return this.props.enterMobileErrorMessage;
        }

        if (mobile.length && !FormValidator.isValidPhoneNumber(mobile)) {
            return this.props.enterMobileErrorMessage;
        }

        return null;
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

    formatPhoneNumber = e => {
        const inputValue = e.target.value.replace(specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);

        this.setState({
            formattedPhone: formattedPhone,
            mobile: e.target.value
        });
    };

    handleSubmitPhone = (e, requestOrigin) => {
        e.preventDefault();
        const { origin } = this.state;
        const phonenumber = new URLSearchParams(global.window?.location.search).get('phonenumber');
        const maskedPhoneNumber = getHiddenPhoneNumber(this.state.mobile);
        const { pageType, pageName } = this.getTrackingParams();

        if (this.isValidPhoneOnly()) {
            let updatedRequestOrigin = phonenumber && origin === FOOTER_PAGENAME ? 'SignedUpFooter' : null;

            // Make sure the origin received from the URL is used when available.
            updatedRequestOrigin = !origin ? updatedRequestOrigin : origin;

            this.props.submitSMSForm(
                this.state.mobile,
                pageName,
                maskedPhoneNumber,
                this.textAlertsFailureCallback,
                pageType,
                updatedRequestOrigin || requestOrigin
            );
        }
    };

    getTrackingParams = () => {
        let pageName = null,
            pageType = null;

        /*
            If the URL is '/beauty/text-alerts', the page name and page type are dynamic,
            relying on `origin` URL param to get their values.
            If no mapped value, set `TEXT_ALERT_PAGENAME` as `pageName` default.

            `SMS_PAGENAME_PAGETYPE` maps all specific page names to page types.
        */
        if (Location.isBeautyTextAlertsPage()) {
            if (this.state.origin) {
                pageName = this.state.origin;
                pageType = SMS_PAGENAME_PAGETYPE[this.state.origin];
            } else {
                pageName = TEXT_ALERT_PAGENAME;
                pageType = SMS_PAGENAME_PAGETYPE[pageName];
            }

            return { pageName, pageType };
        }

        // If the URL is '/rewards'.
        if (Location.isRewardsPage()) {
            return {
                pageName: REWARDS_BAZAAR,
                pageType: SMS_PAGENAME_PAGETYPE[REWARDS_BAZAAR]
            };
        }

        // If the URL is '/beauty/app'.
        if (Location.isAppDownloadPage()) {
            return {
                pageName: APP_DOWNLOAD,
                pageType: SMS_PAGENAME_PAGETYPE[APP_DOWNLOAD]
            };
        }

        // If the URL is '/beauty/rouge-preview'.
        if (Location.isRougePreviewPage()) {
            return {
                pageName: ROUGE_PREVIEW,
                pageType: SMS_PAGENAME_PAGETYPE[ROUGE_PREVIEW]
            };
        }

        /*
            Standard setting for SMSOptIn tracking params.
            If there's no special case/URL, the component will use data from Contentful
            to populate those fields accordingly.
        */
        pageName = this.props.tag;
        pageType = this.props.tag?.length ? BRAND_LAUNCH_PAGENAME : CF_GLOBAL_PAGENAME;

        return { pageName, pageType };
    };

    render() {
        const {
            isAnonymous, user, introCopy, disclaimerCopy, context
        } = this.props;
        const isUserInitialized = user.isInitialized;
        const isModal = context === 'Modal';

        return (
            <Grid
                columns={!isModal && [null, '1fr 3fr']}
                gap={isModal ? 4 : [4, 6]}
            >
                <Copy
                    content={introCopy}
                    key={introCopy.sid}
                    marginTop={0}
                    marginBottom={0}
                />

                <Box
                    padding={[4, 5]}
                    borderRadius={2}
                    backgroundColor={colors.nearWhite}
                >
                    <Copy
                        content={disclaimerCopy}
                        key={disclaimerCopy.sid}
                        marginTop={0}
                        marginBottom={0}
                    />
                    {(!isUserInitialized || isAnonymous) && this.renderAnonymousForm(isModal)}
                    {isUserInitialized && !isAnonymous && this.renderLoggedInForm(isModal)}
                </Box>
            </Grid>
        );
    }
}

SMSOptIn.defaultProps = {
    introCopy: {},
    disclaimerCopy: {}
};

SMSOptIn.propTypes = {
    introCopy: PropTypes.object,
    disclaimerCopy: PropTypes.object
};

export default wrapComponent(SMSOptIn, 'SMSOptIn');
