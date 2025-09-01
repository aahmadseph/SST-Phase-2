import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import authenticationApi from 'services/api/authentication';
import store from 'store/Store';
import FormValidator from 'utils/FormValidator';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';
import ErrorConstants from 'utils/ErrorConstants';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Actions from 'Actions';
import userActions from 'actions/UserActions';
import authenticationUtils from 'utils/Authentication';
import AnalyticsConstants from 'analytics/constants';
import ProcessEvent from 'analytics/processEvent';
import { measure } from 'style/config';
import {
    Text, Box, Divider, Button, Link
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import ErrorMsg from 'components/ErrorMsg';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { showForgotPasswordModal, showInfoModal } = Actions;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const { redirectTo } = urlUtils;
const { isAuthServiceEnabled, updateProfileStatus } = authenticationUtils;

const PASSWORD_ERROR = ErrorConstants.ERRORS[ErrorConstants.ERROR_CODES.PASSWORD].message();
const HOMEPAGE_URL = '/';
const PROFILE_URL = '/profile/BeautyInsider';

class ResetPassword extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            newPassword: '',
            confirmPassword: '',
            securityToken: null,
            isValidToken: true,
            render: false,
            errorMessage: ''
        };

        this.newPassword = React.createRef();
        this.confirmPassword = React.createRef();
    }

    componentDidMount() {
        const currentUser = store.getState().user;
        const encodedParams = Sephora.configurationSettings.isAuthServiceResetPassEnabled ? [] : ['token'];
        const QA_PARAMS = urlUtils.getParams(Location.getLocation().search, encodedParams);
        const securityToken = QA_PARAMS.token && QA_PARAMS.token[0];

        authenticationApi
            .validatePasswordToken(securityToken)
            .then(() => {
                this.setState({
                    email: currentUser.login,
                    securityToken,
                    isValidToken: true
                });
            })
            .catch(error => {
                const errors = error.errors || [];
                const errorMessage = errors[0]?.errorMessage;
                // eslint-disable-next-line no-console
                console.error(error && error.errorMessages && error.errorMessages[0]);
                this.setState({
                    email: currentUser.login,
                    isValidToken: false,
                    errorMessage
                });
            });
    }

    onChange = (fieldName, value) => {
        const newState = {};
        newState[fieldName] = value;
        this.setState(newState);
    };

    onHandleChange = e => {
        this.onChange(e.target.name, e.target.value);
    };

    onHandleNewPwBlur = () => {
        if (this.newPassword.current) {
            this.newPassword.current.validateError();
        }
    };

    onHandleConfirmPwBlur = () => {
        if (this.confirmPassword.current) {
            this.confirmPassword.current.validateError();
        }
    };

    isValid = () => {
        return !this.newPassword.current.validateError() && !this.confirmPassword.current.validateError();
    };

    validateConfirm = input => {
        const getText = getLocaleResourceFile('components/ResetPassword/locales', 'ResetPassword');

        let error;

        if (FormValidator.isEmpty(input)) {
            error = PASSWORD_ERROR;
        } else if (input !== this.state.newPassword) {
            error = getText('confirmError');
        } else {
            error = null;
        }

        return error;
    };

    validatePassword = input => {
        const { passwordMin, passwordMax } = FormValidator.FIELD_LENGTHS;

        if (FormValidator.isEmpty(input) || !FormValidator.isValidLength(input, passwordMin, passwordMax) || FormValidator.hasEmptySpaces(input)) {
            return PASSWORD_ERROR;
        }

        return null;
    };

    requestResetPassword = () => {
        store.dispatch(showForgotPasswordModal(true, this.state.email));
    };

    closeModal = () => {
        redirectTo(HOMEPAGE_URL);
    };

    goToProfile = () => {
        redirectTo(PROFILE_URL);
    };

    callUserFull = () => {
        store.dispatch(userActions.getUserFull(null, this.goToProfile));
    };

    submit = e => {
        const getText = getLocaleResourceFile('components/ResetPassword/locales', 'ResetPassword');
        e.preventDefault();

        if (!this.isValid()) {
            return;
        }

        const { email, newPassword, confirmPassword, securityToken } = this.state;
        const isAuthEnabled = isAuthServiceEnabled();

        authenticationApi
            .resetPassword(email, newPassword, confirmPassword, securityToken)
            .then(response => {
                const shouldMakeUserFullCall = Boolean(isAuthEnabled && response?.profileStatus !== 0);

                if (isAuthEnabled) {
                    Storage.local.setItem(LOCAL_STORAGE.PROFILE_ID, response?.profileId);
                    updateProfileStatus({
                        profileSecurityStatus: [response.jwtResponse.profileSecurityStatus],
                        accessToken: [response.jwtResponse.accessToken, response.jwtResponse?.atExp],
                        refreshToken: [response.jwtResponse.refreshToken, response.jwtResponse?.rtExp]
                    });
                }

                ProcessEvent.process(AnalyticsConstants.LINK_TRACKING_EVENT, {
                    data: {
                        eventStrings: [AnalyticsConstants.Event.EVENT_145]
                    }
                });

                store.dispatch(
                    showInfoModal({
                        isOpen: true,
                        title: getText('resetSuccessful'),
                        message: getText('passwordHasBeenReset'),
                        buttonText: getText('viewProfile'),
                        callback: shouldMakeUserFullCall ? this.callUserFull : this.goToProfile,
                        showCancelButton: false,
                        cancelCallback: this.closeModal,
                        showCloseButton: true,
                        bodyPaddingBottom: 4
                    })
                );
            })
            .catch(error => {
                const errors = error.errors || [];
                const errorMessage = errors[0]?.errorMessage;

                this.setState({
                    isValidToken: false,
                    errorMessage
                });
            });
    };

    render() {
        const getText = getLocaleResourceFile('components/ResetPassword/locales', 'ResetPassword');
        const isMobile = Sephora.isMobile();

        return (
            <LegacyContainer>
                <Text
                    is='h1'
                    fontSize={isMobile ? 'xl' : '2xl'}
                    marginTop='1em'
                    marginBottom='.5em'
                    lineHeight='tight'
                    fontFamily='serif'
                >
                    {getText('resetPassword')}
                </Text>
                <Divider
                    height={2}
                    marginBottom='1.5em'
                    color='black'
                />
                {this.state.isValidToken || (
                    <React.Fragment>
                        <ErrorMsg
                            fontSize='base'
                            marginBottom='2em'
                        >
                            {this.state.errorMessage || getText('resetLinkExpired')}
                        </ErrorMsg>
                        <Button
                            variant='primary'
                            hasMinWidth={true}
                            onClick={this.requestResetPassword}
                        >
                            {getText('resetPassword')}
                        </Button>
                    </React.Fragment>
                )}
                {this.state.isValidToken && (
                    <React.Fragment>
                        <Text
                            is='p'
                            marginBottom='2em'
                        >
                            {getText('pleaseCreateNewPassword')}
                        </Text>
                        <Box
                            is='form'
                            maxWidth='24em'
                            noValidate
                            onSubmit={this.submit}
                        >
                            <TextInput
                                name='newPassword'
                                type='password'
                                autoCorrect='off'
                                required={true}
                                label={getText('newPassword')}
                                ref={this.newPassword}
                                onChange={this.onHandleChange}
                                onBlur={this.onHandleNewPwBlur}
                                validate={newPassword => this.validatePassword(newPassword)}
                                hideAsterisk={true}
                            />
                            <TextInput
                                name='confirmPassword'
                                type='password'
                                autoCorrect='off'
                                required={true}
                                label={getText('confirmPassword')}
                                ref={this.confirmPassword}
                                onChange={this.onHandleChange}
                                onBlur={this.onHandleConfirmPwBlur}
                                validate={confirmPassword => this.validateConfirm(confirmPassword)}
                                hideAsterisk={true}
                            />
                            <Button
                                variant='primary'
                                type='submit'
                                block={true}
                            >
                                {getText('continue')}
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
                <Text
                    is='p'
                    marginTop='2em'
                    maxWidth={measure[3]}
                    color='gray'
                >
                    {this.state.isValidToken && <b>{getText('stillHavingTrouble')}</b>}
                    {this.state.isValidToken && <br />}
                    {getText('unableToResetPassword')}{' '}
                    <Link
                        href='tel:1-877-737-4672'
                        color='blue'
                        underline={true}
                    >
                        1-877-SEPHORA
                    </Link>{' '}
                    {getText('phoneNumber')}
                    {' | '}
                    {getText('forAssistance')}{' '}
                    <Link
                        color='blue'
                        underline={true}
                        href='/beauty/accessibility'
                    >
                        {getText('accessibility')}
                    </Link>
                    .
                </Text>
            </LegacyContainer>
        );
    }
}

export default wrapComponent(ResetPassword, 'ResetPassword');
