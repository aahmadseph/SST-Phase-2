import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import Actions from 'actions/Actions';
import watch from 'redux-watch';
import auth from 'utils/Authentication';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import anaUtils from 'analytics/utils';
import formValidator from 'utils/FormValidator';
import UserActions from 'actions/UserActions';
import Debounce from 'utils/Debounce';
import localeUtils from 'utils/LanguageLocale';
import HelperUtils from 'utils/Helpers';
import userUtils from 'utils/User';
import brazeUtils from 'analytics/utils/braze';
import ErrorConstantsUtils from 'utils/ErrorConstants';

import {
    Box, Flex, Button, Divider, Text, Link, Image
} from 'components/ui';
import { modal } from 'style/config';
import ArkoseLabs from 'components/ArkoseLabs';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import ErrorList from 'components/ErrorList';
import FormValidator from 'utils/FormValidator';
import InfoButton from 'components/InfoButton/InfoButton';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import Markdown from 'components/Markdown/Markdown';
import PasswordRevealInput from 'components/Inputs/PasswordRevealInput';
import Tooltip from 'components/Tooltip/Tooltip';
import SignInFormTerms from 'components/GlobalModals/SignInModal/SignInFormTerms/SignInFormTerms';
import Empty from 'constants/empty';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

import SignInCheckoutDisclaimerBanner from 'components/GlobalModals/SignInModal/SignInCheckoutDisclaimerBanner';

const { COUNTRIES } = localeUtils;
const { getProp } = HelperUtils;
const { ERROR_CODES } = ErrorConstantsUtils;
const getSignInText = localeUtils.getLocaleResourceFile('components/GlobalModals/SignInModal/SignInForm/locales', 'SignInForm');
const { enableV2GenerateToken } = Sephora.configurationSettings;

class SignInFormNew extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            presetLogin: '',
            callback: this.props.callback,
            ssi: !!Sephora.isMobile(),
            errorMessages: this.props.messages,
            isSigningIn: false,
            isEmailDisabled: this.props.isEmailDisabled || false,
            displayNotYouLink: false,
            signInSuccessfull: false
        };

        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    componentDidMount() {
        const keepMeSignedInDesktop = Sephora.isDesktop() && userUtils.isRecognized();
        const keepMeSignInCached = Storage.local.getItem(LOCAL_STORAGE.STAY_SIGN_IN);

        const w = watch(store.getState, 'user');

        store.subscribe(
            w(newVal => {
                const keepMeSignedInMobile = Sephora.isMobile() && newVal.loginStatus === userUtils.LOGIN_STATUS.AUTO_LOGIN;
                const isEmailDisabled = newVal.profileLocale === COUNTRIES.CA && userUtils.isRecognized() ? false : userUtils.isRecognized();

                this.setState(prevState => ({
                    ...prevState,
                    ...(newVal?.login ? { presetLogin: newVal.login } : Empty.Object),
                    ...(newVal?.loginStatus ? { loginStatus: newVal.loginStatus } : Empty.Object),
                    isEmailDisabled,
                    ssi: keepMeSignedInMobile || keepMeSignedInDesktop || keepMeSignInCached
                }));
            }),
            this
        );

        const user = store.getState().user;
        const { email } = this.props;
        const { keepMeSignedIn } = this.props.extraParams ?? {};

        this.setState({
            isEmailDisabled: this.state.isEmailDisabled || this.props.extraParams?.isEmailDisabled || false,
            presetLogin: email || (user ? user.login : null),
            displayNotYouLink: userUtils.isRecognized(),
            ssi: Sephora.isMobile() || keepMeSignedInDesktop || keepMeSignedIn || keepMeSignInCached
        });

        this.loadThirdpartyScript();

        this.pageLoadAnalytics();
    }

    loadThirdpartyScript = () => {
        import(/* webpackMode: "eager" */ 'thirdparty/frt');
    };

    pageLoadAnalytics = () => {
        const { SIGN_IN } = anaConsts.PAGE_TYPES;
        const { analyticsData, source } = this.props;

        const { context } = analyticsData || {};
        const contextEvent = (context && anaUtils.getLastAsyncPageLoadData({ pageType: context })) || {};

        const pageNameDetail = '';
        const pageDetail = SIGN_IN;
        const pageName = `${SIGN_IN}:${SIGN_IN}${pageNameDetail}:n/a:*`;
        const previousPageName = contextEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName');

        const signInData = {
            pageType: SIGN_IN,
            pageName,
            pageDetail,
            previousPageName
        };

        this.signInAnalyticsData = {
            ...analyticsData,
            linkData: 'sign-in_create-account_click',
            context: SIGN_IN
        };

        if (source === auth.SIGN_IN_SOURCES.ACCOUNT_GREETING) {
            this.signInAnalyticsData.navigationInfo = anaUtils.buildNavPath(['top nav', 'account', 'register']);
        }

        Object.assign(signInData, analyticsData);

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: signInData });
    };

    handleCreateAccountClick = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: false }));

        const { SIGN_IN } = anaConsts.PAGE_TYPES;
        const { analyticsData, showBeautyPreferencesFlow } = this.props;
        const loginValue = this.loginInput.current?.getValue();

        this.signInAnalyticsData = {
            ...analyticsData,
            linkData: 'sign-in_create-account_click',
            context: SIGN_IN
        };

        store.dispatch(
            Actions.showRegisterModal({
                isOpen: true,
                analyticsData: { ...this.signInAnalyticsData },
                ...(!showBeautyPreferencesFlow && { callback: this.state.callback }),
                userEmail: loginValue,
                errback: this.props.errback,
                extraParams: this.props.extraParams,
                ...(showBeautyPreferencesFlow && { openPostBiSignUpModal: true })
            })
        );
    };

    isValid = () => {
        const { Event } = anaConsts;

        const fieldsForValidation = [this.loginInput.current, this.passwordInput.current];
        const errors = formValidator.getErrors(fieldsForValidation);

        //Analytics
        if (errors.fields.length) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    linkName: 'signin:modal:error',
                    bindingMethods: linkTrackingError,
                    eventStrings: [Event.SIGN_IN_ATTEMPT, Event.SIGN_IN_FAILED],
                    fieldErrors: errors.fields,
                    errorMessages: errors.messages,
                    ...anaUtils.getLastAsyncPageLoadData()
                }
            });
        } //End analytics

        return !errors.fields.length;
    };

    signIn = () => {
        this.setState({ isSigningIn: true });

        const loginValue = this.loginInput.current?.getValue();

        if (!this.isValid()) {
            return this.setState({ isSigningIn: false });
        }

        const loginForCheckout = true;

        return store.dispatch(
            UserActions.signIn(
                loginValue,
                this.passwordInput.current?.getValue(),
                this.state.ssi,
                loginForCheckout,
                json => {
                    this.setState({ isSigningIn: false, signInSuccessfull: true });
                    this.closeModal();

                    if (json.isStoreBiMember) {
                        this.registerBiStoreMember(json, loginValue);
                    } else {
                        this.state.callback && this.state.callback(json);
                        // TODO: Open BI User registration modal only in the
                        // apply page for credit card pages

                        this.setState({
                            callback: null,
                            errorMessages: [],
                            message: null,
                            password: ''
                        });
                    }

                    brazeUtils.setBrazeUserData();

                    // Analytics :: Pixel :: Fire Custom Login Event with Data
                    const biDetails = json.beautyInsiderAccount || {};

                    if (!enableV2GenerateToken) {
                        processEvent.process(anaConsts.SIGN_IN_SUCCESS, {
                            data: {
                                profileId: json.profileId,
                                biAccountNumber: biDetails.biAccountId || 0,
                                biStatus: biDetails.vibSegment || 'non-bi',
                                biPoints: biDetails.promotionPoints || 0
                            }
                        });
                    }

                    const profileLanguage = json.profileLanguage?.toUpperCase();
                    const profileLocale = json.profileLocale?.toUpperCase();
                    const currentCountry = localeUtils.getCurrentCountry();
                    const currentLanguage = localeUtils.getCurrentLanguage();
                    const changeLanguage = currentLanguage !== profileLanguage;

                    if (currentCountry === localeUtils.COUNTRIES.CA && changeLanguage) {
                        store.dispatch(UserActions.switchCountry(currentCountry, profileLanguage));
                    }

                    if (currentCountry !== profileLocale) {
                        store.dispatch(UserActions.switchCountry(profileLocale, profileLanguage));
                    }
                },

                json => {
                    this.setState({ isSigningIn: false });

                    if (json.errorMessages) {
                        if (json?.errorCode === ERROR_CODES.TS_HEADER_ERROR) {
                            this.setState({ errorMessages: [getSignInText('unableToLogYouIn')] });
                        } else if (json.errorMessages[0]) {
                            this.setState({ errorMessages: json.errorMessages });
                        } else if (json.responseStatus >= 400) {
                            this.setState({ errorMessages: [getSignInText('genericErrorMessage')] });
                        }
                    }
                },
                !!this.props.isOrderConfirmation,
                null,
                this.props.isTest,
                false,
                this.props.analyticsData,
                this.props.extraParams
            )
        );
    };

    signInDebounced = Debounce.preventDoubleClick(this.signIn, 3000);

    signOut = () => {
        store.dispatch(UserActions.signOut(undefined, false, false, undefined, `forceful logut for clicking not you: ${window.location.pathname}`));
    };

    closeModal = () => {
        setTimeout(() => {
            store.dispatch(Actions.showSignInModal({ isOpen: false }));
        }, 1500);
    };

    forgotPassword = () => {
        const { SIGN_IN } = anaConsts.PAGE_TYPES;
        const { RESET_PASSWORD } = anaConsts.PAGE_DETAIL;

        store.dispatch(Actions.showSignInModal({ isOpen: false }));
        store.dispatch(Actions.showForgotPasswordModal(true, this.loginInput.current?.getValue()));

        const mostRecentAsyncLoadEvent = anaUtils.getMostRecentEvent('asyncPageLoad');
        let pageName = getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName');

        if (mostRecentAsyncLoadEvent) {
            pageName = mostRecentAsyncLoadEvent.eventInfo.attributes.pageName;
        }

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${SIGN_IN}:${RESET_PASSWORD}:n/a:*`,
                pageType: SIGN_IN,
                pageDetail: RESET_PASSWORD,
                previousPageName: pageName
            }
        });
    };

    signInButtonChildren = () => {
        return !this.state.signInSuccessfull ? (
            getSignInText('signIn')
        ) : (
            <Flex
                alignItems='center'
                justifyContent='space-around'
            >
                {getSignInText('signedIn')}
                <Image
                    src='/img/ufe/success-login.svg'
                    width={20}
                    height={20}
                    disableLazyLoad={true}
                    marginLeft={2}
                />
            </Flex>
        );
    };

    toggleSSI = () => {
        this.setState({ ssi: !this.state.ssi });
    };

    hideNotYouLink = () => {
        this.setState({
            displayNotYouLink: false
        });
    };

    validatePassword = password => {
        if (FormValidator.isEmpty(password)) {
            return getSignInText('enterPasswordErrorMessage');
        }

        if (!FormValidator.isValidLength(password, 6, 12)) {
            return getSignInText('passwordLengthInvalid');
        }

        return null;
    };

    handlePasswordChange = e => this.setState({ password: e.target.value });

    handleSubmit = e => {
        e.preventDefault();

        this.signInDebounced();
    };

    render() {
        const { isSSIEnabled, extraParams } = this.props;
        const potentialBiPoints = extraParams?.potentialBiPoints;
        const showOptionToCreateAccount = extraParams?.showOptionToCreateAccount ?? true;
        const customSignInButtonWidth = !showOptionToCreateAccount;

        return (
            <>
                <Box
                    is='form'
                    lineHeight='tight'
                    noValidate={true}
                    onSubmit={this.handleSubmit}
                >
                    <Text
                        data-at={Sephora.debug.dataAt('sign_in_popup_title')}
                        is='h2'
                        fontWeight='bold'
                        fontSize='md'
                        marginY={2}
                        children={getSignInText('signIn')}
                    />

                    {extraParams?.isCheckoutInitAttempt && <SignInCheckoutDisclaimerBanner />}
                    <Markdown
                        marginBottom={2}
                        content={potentialBiPoints ? getSignInText('leadWithPoints', [potentialBiPoints]) : getSignInText('lead')}
                    />

                    <ErrorList
                        errorMessages={this.state.errorMessages}
                        data-at={Sephora.debug.dataAt('sign_in_error')}
                    />

                    <InputEmail
                        label={getSignInText('emailAddressLabel')}
                        id='signin_username'
                        name='username'
                        login={this.state.presetLogin}
                        disabled={this.state.isEmailDisabled}
                        onChange={this.hideNotYouLink}
                        infoLink={
                            this.state.displayNotYouLink && {
                                children: getSignInText('notYouMessage'),
                                onClick: this.signOut
                            }
                        }
                        ref={this.loginInput}
                        data-at={Sephora.debug.dataAt('signin_email')}
                        hideAsterisk={true}
                    />
                    <PasswordRevealInput
                        marginBottom={null}
                        label={getSignInText('passwordLabel')}
                        required={true}
                        autoComplete='current-password'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck={false}
                        name='password'
                        id='signin_password'
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        ref={this.passwordInput}
                        validate={this.validatePassword}
                        data-at={Sephora.debug.dataAt('signin_password')}
                        hideAsterisk={true}
                    />

                    <Flex
                        marginTop={2}
                        alignItems='center'
                    >
                        {isSSIEnabled && (
                            <>
                                <Checkbox
                                    marginRight={2}
                                    paddingY={2}
                                    marginY={-2}
                                    name='stay_signed_in'
                                    id='signin_ssi'
                                    checked={this.state.ssi}
                                    onClick={this.toggleSSI}
                                >
                                    <span
                                        data-at={Sephora.debug.dataAt('stay_signed_in_label')}
                                        children={getSignInText('staySignedInLabel')}
                                    />
                                </Checkbox>
                                <Tooltip
                                    fontSize='sm'
                                    dismissButton={true}
                                    content={getSignInText('staySignedInTooltip')}
                                >
                                    <InfoButton />
                                </Tooltip>
                            </>
                        )}
                        <Link
                            color='blue'
                            padding={2}
                            margin={-2}
                            marginLeft='auto'
                            onClick={this.forgotPassword}
                            data-at={Sephora.debug.dataAt('forgot_pwd_btn')}
                            children={getSignInText('forgotPasswordLink')}
                        />
                    </Flex>
                    <SignInFormTerms />
                    <Button
                        variant='primary'
                        hasMinWidth={true}
                        width={customSignInButtonWidth ? '100%' : null}
                        type='submit'
                        data-at={Sephora.debug.dataAt('sign_in_button')}
                        disabled={this.state.isSigningIn}
                        children={this.signInButtonChildren()}
                    />
                </Box>

                {showOptionToCreateAccount && (
                    <>
                        <Divider
                            marginY={5}
                            marginX={modal.outdentX}
                        />

                        <Text
                            is='h2'
                            lineHeight='tight'
                            fontWeight='bold'
                            fontSize='md'
                            marginBottom={4}
                            data-at={Sephora.debug.dataAt('sign_in_new_to_sephora_title')}
                            children={getSignInText('newAccountHeading')}
                        />

                        <Button
                            variant='secondary'
                            hasMinWidth={true}
                            data-at={Sephora.debug.dataAt('create_account_button')}
                            onClick={this.handleCreateAccountClick}
                            children={getSignInText('createAccount')}
                        />
                    </>
                )}
                <ArkoseLabs />
            </>
        );
    }
}

export default wrapComponent(SignInFormNew, 'SignInFormNew');
