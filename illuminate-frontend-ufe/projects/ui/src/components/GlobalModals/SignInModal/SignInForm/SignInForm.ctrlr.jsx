/* eslint-disable complexity */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import Actions from 'Actions';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';
import UserActions from 'actions/UserActions';
import basketUtils from 'utils/Basket';
import watch from 'redux-watch';
import formValidator from 'utils/FormValidator';
import userUtils from 'utils/User';
import ApplePay from 'services/ApplePay';
import localeUtils from 'utils/LanguageLocale';
import brazeUtils from 'analytics/utils/braze';
import auth from 'utils/Authentication';
//Analytics
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import anaUtils from 'analytics/utils';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import CheckoutUtils from 'utils/Checkout';
import HelperUtils from 'utils/Helpers';

import { forms, modal, screenReaderOnlyStyle } from 'style/config';
import {
    Box, Flex, Image, Text, Button, Divider, Link, Grid
} from 'components/ui';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import PasswordRevealInput from 'components/Inputs/PasswordRevealInput';
import withSuspenseLoadHoc from 'utils/framework/hocs/withSuspenseLoadHoc';
const RegisterForm = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RegisterModal/RegisterForm/RegisterForm'))
);
import Radio from 'components/Inputs/Radio/Radio';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Tooltip from 'components/Tooltip/Tooltip';
import InfoButton from 'components/InfoButton/InfoButton';
import FormValidator from 'utils/FormValidator';
import FormsUtils from 'utils/Forms';
import ErrorList from 'components/ErrorList';
import Markdown from 'components/Markdown/Markdown';
import SignInFormTerms from 'components/GlobalModals/SignInModal/SignInFormTerms/SignInFormTerms';
import SignInCheckoutDisclaimerBanner from 'components/GlobalModals/SignInModal/SignInCheckoutDisclaimerBanner';

const { getProp } = HelperUtils;
const isBIAutoEnrollEnabled = Sephora.configurationSettings.isBIAutoEnrollEnabled && localeUtils.isUS();
const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/SignInModal/SignInForm/locales', 'SignInForm');

class SignInForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            presetLogin: '',
            callback: this.props.callback,
            ssi: !!Sephora.isMobile(),
            errorMessages: this.props.messages,
            userExists: false,
            isRecognized: false,
            inStoreUser: false,
            isEmailDisabled: this.props.isEmailDisabled || false,
            displayNotYouLink: false
        };

        this.icons = [
            {
                text: getText('birthdayIconText'),
                image: 'birthday'
            },
            {
                text: getText('earnPointsIconText'),
                image: 'points'
            },
            {
                text: getText('redeemTrialIconText'),
                image: 'reward-bazaar'
            },
            {
                text: getText('accessIconText'),
                image: 'custom-makeover'
            }
        ];

        this.loginInput = React.createRef();
        this.passwordInput = React.createRef();
        this.registerForm = React.createRef();
    }

    componentDidMount() {
        const keepMeSignedInByUser = this.props.extraParams?.keepMeSignedIn ?? false;
        const keepMeSignedInDesktop = Sephora.isDesktop() && userUtils.isRecognized();
        const w = watch(store.getState, 'user');

        store.subscribe(
            w(newVal => {
                const keepMeSignedInMobile = Sephora.isMobile() && newVal.loginStatus === userUtils.LOGIN_STATUS.AUTO_LOGIN;

                this.setState({
                    presetLogin: newVal.login,
                    loginStatus: newVal.loginStatus,
                    isRecognized: userUtils.isRecognized(),
                    isEmailDisabled: userUtils.isRecognized(),
                    ssi: keepMeSignedInMobile || keepMeSignedInDesktop || keepMeSignedInByUser
                });
            }),
            this
        );

        const user = store.getState().user;
        const applePaySession = store.getState().applePaySession;

        Storage.local.setItem(LOCAL_STORAGE.SIGN_IN_SEEN, true);

        this.setState({
            userExists: true,
            isRecognized: userUtils.isRecognized(),
            isEmailDisabled: userUtils.isRecognized(),
            presetLogin: user ? user.login : null,
            isApplePaySignIn: applePaySession.isActive,
            inStoreUser: false,
            locale: localeUtils.getCurrentCountry(),
            displayNotYouLink: userUtils.isRecognized(),
            ssi: Sephora.isMobile() || keepMeSignedInDesktop || keepMeSignedInByUser
        });
        this.loadThirdpartyScript();

        this.pageLoadAnalytics();
    }

    loadThirdpartyScript = () => {
        import(/* webpackMode: "eager" */ 'thirdparty/frt');
    };

    resetAppleSignInEmail = () => {
        this.setState({ isEmailDisabled: false });
    };

    applePaySignInOrRegister = e => {
        ApplePay.prepareSession();

        if (this.state.userExists) {
            this.signIn(e);
        } else {
            this.registerForm.current?.validateCaptchaAndRegister(this.state.callback);
        }
    };

    forgotPassword = () => {
        const { SIGN_IN } = anaConsts.PAGE_TYPES;
        const { RESET_PASSWORD } = anaConsts.PAGE_DETAIL;

        if (this.props.isSignInWithAuthenticateModal) {
            store.dispatch(Actions.showAuthenticateModal({ isOpen: false }));
        } else if (this.props.isSignInWithMessaging) {
            store.dispatch(Actions.showSignInWithMessagingModal({ isOpen: false }));
        } else {
            store.dispatch(Actions.showSignInModal({ isOpen: false }));
        }

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

    signOut = () => {
        store.dispatch(UserActions.signOut());
    };

    isValid = () => {
        const { Event } = anaConsts;

        const fieldsForValidation = [this.loginInput.current];

        if (this.state.userExists) {
            fieldsForValidation.push(this.passwordInput.current);
        }

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

    /** reformat API json bi data for register modal
     * params: API object, login email string
     */
    registerBiStoreMember = (json, loginValue) => {
        const bDay = json.beautyInsiderAccount ? json.beautyInsiderAccount.birthDay : '';
        const bMon = json.beautyInsiderAccount ? json.beautyInsiderAccount.birthMonth : '';
        const bYear = json.beautyInsiderAccount ? json.beautyInsiderAccount.birthYear : '';
        const biData = {
            userEmail: json.userName,
            profileId: json.profileId,
            firstName: json.firstName,
            lastName: json.lastName,
            bDay: bDay,
            bMon: bMon,
            bYear: bYear
        };

        store.dispatch(
            Actions.showRegisterModal({
                isOpen: true,
                callback: this.state.callback,
                userEmail: loginValue,
                isStoreUser: true,
                biData: biData,
                errback: this.props.errback,
                extraParams: this.props.extraParams,
                analyticsData: { ...this.signInAnalyticsData }
            })
        );
    };

    signIn = () => {
        const loginValue = this.loginInput.current?.getValue();

        if (this.isValid()) {
            if (this.state.userExists) {
                //need to set source to orderConfirmation in case that
                //user is signing in with guest user email through normal
                //sign in flow on guest checkout order conf page
                let isOrderConfirmation = false;
                let loginForCheckout = true;
                const guestProfile = CheckoutUtils.getGuestProfile();

                if (guestProfile && guestProfile.email === loginValue) {
                    isOrderConfirmation = true;
                    loginForCheckout = false;
                }

                // TODO: why is loginForCheckout always true?
                store.dispatch(
                    UserActions.signIn(
                        loginValue,
                        this.passwordInput.current?.getValue(),
                        this.state.ssi,
                        loginForCheckout,
                        json => {
                            if (this.props.isSignInWithAuthenticateModal) {
                                store.dispatch(Actions.showAuthenticateModal({ isOpen: false }));
                            }

                            this.closeModal();

                            if (json.isStoreBiMember) {
                                this.registerBiStoreMember(json, loginValue);
                            } else {
                                this.state.callback && this.state.callback(json);
                                // TODO: Open BI User registration modal only in the
                                // apply page for credit card pages

                                this.setState({
                                    password: '',
                                    errorMessages: [],
                                    callback: null,
                                    message: null
                                });

                                store.setAndWatch('user', this, () => {
                                    brazeUtils.setBrazeUserData();
                                });

                                // Analytics :: Pixel :: Fire Custom Login Event with Data
                                const biDetails = json.beautyInsiderAccount || {};
                                processEvent.process(anaConsts.SIGN_IN_SUCCESS, {
                                    data: {
                                        profileId: json.profileId,
                                        biAccountNumber: biDetails.biAccountId || 0,
                                        biStatus: biDetails.vibSegment || 'non-bi',
                                        biPoints: biDetails.promotionPoints || 0
                                    }
                                });
                            }

                            const currentCountry = localeUtils.getCurrentCountry();
                            const currentLanguage = localeUtils.getCurrentLanguage();
                            const changeLanguage = currentLanguage.toUpperCase() !== json.profileLanguage.toUpperCase();
                            const changeCountry = currentCountry.toUpperCase() !== json.profileLocale.toUpperCase();

                            if (changeLanguage || changeCountry) {
                                store.dispatch(
                                    UserActions.switchCountry(
                                        changeCountry ? json.profileLocale : currentCountry,
                                        changeLanguage ? json.profileLanguage : currentLanguage
                                    )
                                );
                            }
                        },
                        json => {
                            if (json.errorMessages) {
                                this.setState({ errorMessages: json.errorMessages });
                            }
                        },
                        isOrderConfirmation,
                        null,
                        this.props.isTest,
                        this.props.isSignInWithMessaging,
                        this.props.analyticsData,
                        this.props.extraParams
                    )
                );
            } else {
                // Attempted new user.  Confirm they don't exist and show register modal
                store.dispatch(
                    UserActions.checkUser(
                        loginValue,
                        json => {
                            if (
                                json.isPosMember &&
                                this.props.isNewUserFlow &&
                                basketUtils.isDCBasket() &&
                                typeof this.state.callback === 'function'
                            ) {
                                this.closeModal();

                                json.isNewUserFlow = true;
                                this.state.callback(json);
                            } else if (!json.isStoreBiMember) {
                                this.setState({ errorMessages: [getText('existingAccountErrorMessage')] });

                                // Store registered user - needs to register online.
                            } else {
                                this.closeModal();
                                this.registerBiStoreMember(json, loginValue);
                            }
                        },

                        () => {
                            this.closeModal();

                            if (this.props.isNewUserFlow && basketUtils.isDCBasket()) {
                                anaUtils.setNextPageData({ linkData: 'sign-in_new-to-website-register_click' });

                                if (typeof this.state.callback === 'function') {
                                    this.state.callback({
                                        userName: loginValue,
                                        isNewUserFlow: true
                                    });
                                }
                            } else {
                                store.dispatch(
                                    Actions.showRegisterModal({
                                        isOpen: true,
                                        callback: this.state.callback,
                                        userEmail: loginValue,
                                        errback: this.props.errback,
                                        extraParams: this.props.extraParams,
                                        analyticsData: { ...this.signInAnalyticsData }
                                    })
                                );
                            }
                        }
                    )
                );
            }
        }
    };

    /** check POS user and analytics for opening registration modal from ApplePay signin */
    applePayRegister = () => {
        if (this.state.isApplePaySignIn) {
            const userEmail = this.loginInput.current?.getValue();

            if (userEmail) {
                store.dispatch(
                    UserActions.checkUser(
                        userEmail,
                        json => {
                            if (!json.isStoreBiMember) {
                                this.setState({
                                    userExists: true,
                                    errorMessages: [getText('existingAccountErrorMessage')]
                                });
                            } else {
                                this.setState(
                                    {
                                        errorMessages: [],
                                        userExists: false,
                                        inStoreUser: true,
                                        isEmailDisabled: true
                                    },
                                    this.registerForm.current?.inStoreUserHandler(json)
                                );
                            }
                        },
                        () => {
                            this.setState({
                                errorMessages: [],
                                userExists: false
                            });
                            store.dispatch(Actions.showInterstice(false));
                        }
                    )
                );
            }

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'register:register:n/a:*',
                    linkData: 'sign-in_new-to-website-register_click',
                    pageType: 'register',
                    pageDetail: 'register'
                }
            });
        }
    };

    showPrivacyPolicy = e => {
        e.preventDefault();
        const mediaId = '12300066';
        const title = 'Privacy Policy';
        store.dispatch(TermsAndConditionsActions.showModal(true, mediaId, title));
    };

    showTermsOfUse = e => {
        e.preventDefault();
        const mediaId = '11300018';
        const title = 'Sephora Terms of Use';
        store.dispatch(TermsAndConditionsActions.showModal(true, mediaId, title));
    };

    registerHandler = e => {
        e.stopPropagation();
        store.dispatch(Actions.showSignInModal({ isOpen: false }));
        store.dispatch(
            Actions.showRegisterModal({
                isOpen: true,
                extraParams: this.props.extraParams,
                analyticsData: { ...this.signInAnalyticsData }
            })
        );
    };

    closeModal = () => {
        if (this.props.isSignInWithMessaging) {
            store.dispatch(Actions.showSignInWithMessagingModal({ isOpen: false }));
        } else {
            store.dispatch(Actions.showSignInModal({ isOpen: false }));
        }
    };

    pageLoadAnalytics = () => {
        const { SIGN_IN } = anaConsts.PAGE_TYPES;
        const {
            analyticsData, isSignInWithMessaging, isSignInWithAuthenticateModal, source, isGuestBookingEnabled
        } = this.props;

        const storeId = this.props?.extraParams?.storeId;
        const bookingType = this.props?.extraParams?.bookingType;
        const { context } = analyticsData || {};
        const contextEvent = (context && anaUtils.getLastAsyncPageLoadData({ pageType: context })) || {};

        let pageNameDetail = '';
        let pageDetail = SIGN_IN;
        let eventStrings;

        if (isSignInWithAuthenticateModal) {
            pageNameDetail = '-guest happening at sephora';
        } else if (isSignInWithMessaging) {
            if (isGuestBookingEnabled && storeId && bookingType) {
                digitalData.page.attributes.experienceDetails = { storeId: storeId };
                digitalData.page.attributes.previousPageData.linkData = `happening:${anaConsts.EVENT_NAMES.HAPPENING_AT_SEPHORA.CONTINUE_BOOKING}:${bookingType}`;
                pageNameDetail = '';
                pageDetail = `${anaConsts.PAGE_TYPES.SIGN_IN}:sign in:n/a:*`;
                eventStrings = [anaConsts.Event.SC_GUEST_ORDER_SIGN_IN_LOAD];
            } else {
                pageNameDetail = '-guest checkout';
                pageDetail = `${SIGN_IN}-guest checkout`;
                eventStrings = [anaConsts.Event.SC_GUEST_ORDER_SIGN_IN_LOAD];
            }
        }

        const pageName = `${SIGN_IN}:${SIGN_IN}${pageNameDetail}:n/a:*`;
        const previousPageName = contextEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName');

        const signInData = {
            pageType: SIGN_IN,
            pageName,
            pageDetail,
            previousPageName,
            eventStrings
        };

        this.signInAnalyticsData = {
            ...analyticsData,
            linkData: 'sign-in_new-to-website-register_click',
            context: SIGN_IN
        };

        if (source === auth.SIGN_IN_SOURCES.ACCOUNT_GREETING) {
            this.signInAnalyticsData.navigationInfo = anaUtils.buildNavPath(['top nav', 'account', 'register']);
            signInData.navigationInfo = anaUtils.buildNavPath(['top nav', 'account', 'sign-in']);
        }

        Object.assign(signInData, analyticsData);

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: signInData });
    };

    hideNotYouLink = () => {
        this.setState({
            displayNotYouLink: false
        });
    };

    renderEmailInput({ isSignInWithMessagingOrAuthenticate }) {
        return (
            <Box
                position='relative'
                marginBottom={isSignInWithMessagingOrAuthenticate ? forms.MARGIN_BOTTOM : 6}
            >
                <label
                    htmlFor='signin_username'
                    css={screenReaderOnlyStyle}
                    children={getText('emailAddressLabel')}
                />
                <InputEmail
                    placeholder={getText('emailAddressPlaceholder')}
                    id='signin_username'
                    name='username'
                    login={this.state.presetLogin}
                    disabled={this.state.isEmailDisabled}
                    onChange={this.hideNotYouLink}
                    infoLink={
                        this.state.displayNotYouLink && {
                            children: getText('notYouMessage'),
                            onClick: this.signOut
                        }
                    }
                    ref={this.loginInput}
                    message={this.state.isRecognized || isSignInWithMessagingOrAuthenticate ? '' : getText('haveABIAccountMessage')}
                />
            </Box>
        );
    }

    validatePassword = password => {
        if (FormValidator.isEmpty(password)) {
            return getText('enterPasswordErrorMessage');
        }

        return null;
    };

    toggleSSI = () => {
        this.setState(prevState => ({ ssi: !prevState.ssi }));
    };

    renderUserAlreadyExists({ isSignInWithMessagingOrAuthenticate, isSSIEnabled }) {
        return (
            this.state.userExists && (
                /* TODO: add dontChangeUserName validation */
                <Box
                    position='relative'
                    marginTop={2}
                    marginLeft={this.state.isRecognized || isSignInWithMessagingOrAuthenticate ? 0 : 5}
                >
                    <label
                        htmlFor='signin_password'
                        css={screenReaderOnlyStyle}
                        children={getText('passwordLabel')}
                    />
                    <PasswordRevealInput
                        marginBottom={null}
                        autoComplete='current-password'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck={false}
                        type='password'
                        name='password'
                        placeholder={getText('passwordPlaceholder')}
                        id='signin_password'
                        ref={this.passwordInput}
                        validate={this.validatePassword}
                    />
                    <Flex
                        marginTop={2}
                        alignItems='flex-start'
                    >
                        {isSSIEnabled && (
                            <Grid
                                columns={['1fr auto', '156px auto']}
                                alignItems='center'
                                gap={0}
                            >
                                <Checkbox
                                    marginRight={[2, 0]}
                                    paddingY={2}
                                    marginY={-2}
                                    name='stay_signed_in'
                                    id='signin_ssi'
                                    checked={this.state.ssi}
                                    onChange={this.toggleSSI}
                                >
                                    <span
                                        data-at={Sephora.debug.dataAt('stay_signed_in_label')}
                                        children={getText('staySignedInLabel')}
                                    />
                                </Checkbox>
                                <Tooltip
                                    fontSize='sm'
                                    dismissButton={true}
                                    content={getText('staySignedInTooltip')}
                                >
                                    <InfoButton />
                                </Tooltip>
                            </Grid>
                        )}
                        <Link
                            width={[null, localeUtils.isFrench() ? '102px' : null]}
                            color='blue'
                            padding={2}
                            margin={-2}
                            marginLeft='auto'
                            lineHeight='tight'
                            onClick={this.forgotPassword}
                            data-at={Sephora.debug.dataAt('forgot_pwd_btn')}
                            children={getText('forgotPasswordLink')}
                        />
                    </Flex>
                </Box>
            )
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        const { isSignInWithMessaging, isSignInWithAuthenticateModal } = this.props;

        const isSignInWithMessagingOrAuthenticate = isSignInWithMessaging || isSignInWithAuthenticateModal;
        const isApplePaySignIn = this.state.isApplePaySignIn && !isSignInWithMessagingOrAuthenticate;

        isApplePaySignIn ? this.applePaySignInOrRegister() : this.signIn();
    };

    handleNewUser = () => {
        this.setState(
            {
                userExists: false
            },
            this.applePayRegister()
        );
    };

    handleExistingUser = () => {
        this.setState({
            userExists: true,
            isEmailDisabled: false
        });
    };

    render() {
        const {
            isSignInWithMessaging, isSSIEnabled, isSignInWithAuthenticateModal, signInMessaging, extraParams
        } = this.props;

        const isSignInWithMessagingOrAuthenticate = isSignInWithMessaging || isSignInWithAuthenticateModal;
        const isApplePaySignIn = this.state.isApplePaySignIn && !isSignInWithMessagingOrAuthenticate;

        return (
            <form
                noValidate
                onSubmit={this.handleSubmit}
            >
                {isApplePaySignIn && (
                    <Text
                        is='p'
                        marginBottom={5}
                    >
                        {getText('applePaySignIn')}
                    </Text>
                )}

                {isSignInWithMessagingOrAuthenticate ? (
                    <Text
                        is='h2'
                        fontSize='md'
                        marginBottom='.5em'
                        fontWeight='bold'
                        display={['none', 'block']}
                        children={getText('signIn')}
                    />
                ) : (
                    <Text
                        is='label'
                        htmlFor='signin_username'
                        display='block'
                        fontWeight='bold'
                        marginBottom='.5em'
                    >
                        {
                            <span>
                                {this.state.isRecognized ? '' : '1. '}
                                {getText('whatsYourEmailAddressLabel')}
                            </span>
                        }
                    </Text>
                )}

                {extraParams?.isCheckoutInitAttempt && <SignInCheckoutDisclaimerBanner />}

                {isSignInWithMessaging && signInMessaging && (
                    <Markdown
                        content={signInMessaging}
                        lineHeight='tight'
                        marginBottom='1em'
                    />
                )}

                {isSignInWithAuthenticateModal && (
                    <Text
                        is='p'
                        marginBottom='1em'
                    >
                        {getText('signInFasterBookingMessage')}
                    </Text>
                )}

                <ErrorList
                    errorMessages={this.state.errorMessages}
                    data-at={Sephora.debug.dataAt('sign_in_error')}
                />

                {this.renderEmailInput({ isSignInWithMessagingOrAuthenticate })}

                {isSignInWithMessagingOrAuthenticate || (
                    <Text
                        is='label'
                        htmlFor='signin_password'
                        display='block'
                        fontWeight='bold'
                        marginBottom='.5em'
                    >
                        {
                            <span>
                                {this.state.isRecognized ? '' : '2. '}
                                {getText('haveAPasswordMessage')}
                            </span>
                        }
                    </Text>
                )}

                {!this.state.isRecognized && !isSignInWithMessagingOrAuthenticate && (
                    <React.Fragment>
                        <Radio
                            name='userExists'
                            data-at={Sephora.debug.dataAt('new_user_radio_button')}
                            checked={!this.state.userExists}
                            onChange={this.handleNewUser}
                        >
                            {getText('imNewMessage')}
                        </Radio>
                        <Radio
                            name='userExists'
                            data-at={Sephora.debug.dataAt('have_password_radio_button')}
                            checked={this.state.userExists}
                            onChange={this.handleExistingUser}
                        >
                            {getText('iHaveAPasswordMessage')}
                        </Radio>
                    </React.Fragment>
                )}

                {this.renderUserAlreadyExists({ isSignInWithMessagingOrAuthenticate, isSSIEnabled })}

                {!this.state.userExists && isApplePaySignIn && (
                    <React.Fragment>
                        <Divider
                            thick
                            marginY={4}
                            marginX={modal.outdentX}
                        />
                        <Text
                            is='h2'
                            fontSize='lg'
                            marginBottom={3}
                            paddingBottom={1}
                            fontWeight='bold'
                        >
                            {getText('createAccountLabel')}
                        </Text>
                        <RegisterForm
                            editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.SIGN_IN_MODAL)}
                            applePayEmailInput={this.loginInput.current ? this.loginInput.current : null}
                            resetAppleSignInEmail={this.resetAppleSignInEmail}
                            inStoreUser={this.state.inStoreUser}
                            isApplePaySignIn={this.state.isApplePaySignIn}
                            hideEmail={true}
                            hideButton={true}
                            isBIAutoEnroll={isBIAutoEnrollEnabled}
                            ref={this.registerForm}
                        />
                        <Divider
                            thick
                            marginX={modal.outdentX}
                        />
                    </React.Fragment>
                )}
                <Box marginTop={isSignInWithMessagingOrAuthenticate ? 4 : 5}>
                    {isApplePaySignIn && (
                        <Box textAlign='left'>
                            {this.state.userExists || (
                                <Text
                                    is='p'
                                    marginBottom={3}
                                    fontSize='sm'
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getText('applePaySephoraAccountAgreement')
                                        }}
                                    />{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        onClick={this.showPrivacyPolicy}
                                    >
                                        {getText('privacyPolicyLink')}
                                    </Link>{' '}
                                    {getText('andText')}{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        onClick={this.showTermsOfUse}
                                    >
                                        {getText('sephoraTermsOfUse')}
                                    </Link>
                                    .{this.state.locale === 'us' ? getText('automaticallyEmailsMessage') : null}
                                </Text>
                            )}
                            <Text
                                is='p'
                                marginBottom={3}
                                fontSize='xs'
                                color='gray'
                            >
                                {getText('giftCardsApplePayMessage')}
                            </Text>
                        </Box>
                    )}

                    <SignInFormTerms marginBottom={16} />

                    {isSignInWithMessagingOrAuthenticate ? (
                        <Button
                            variant='primary'
                            block={true}
                            type='submit'
                            data-at={Sephora.debug.dataAt('sign_in_button')}
                            children={getText('signIn')}
                        />
                    ) : (
                        <Button
                            variant='primary'
                            hasMinWidth={true}
                            type='submit'
                        >
                            {this.state.isApplePaySignIn ? (
                                <React.Fragment>
                                    <Text
                                        marginRight={2}
                                        fontWeight='normal'
                                        children={getText('buyWithLabel')}
                                    />
                                    <Image
                                        alt='Apple Pay'
                                        src='/img/ufe/logo-apple-pay.svg'
                                        width={42}
                                        height={20}
                                    />
                                </React.Fragment>
                            ) : (
                                getText('continueButtonLabel')
                            )}
                        </Button>
                    )}
                </Box>
            </form>
        );
    }
}

export default wrapComponent(SignInForm, 'SignInForm');
