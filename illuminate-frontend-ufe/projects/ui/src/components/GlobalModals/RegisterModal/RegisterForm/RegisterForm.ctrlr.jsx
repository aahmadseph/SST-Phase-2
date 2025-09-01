/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import Actions from 'actions/Actions';
import UserActions from 'actions/UserActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import userActions from 'actions/UserActions';
import deepExtend from 'utils/deepExtend';
import EditDataActions from 'actions/EditDataActions';
import ErrorsUtils from 'utils/Errors';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsActions from 'actions/ErrorsActions';
import analyticsUtils from 'analytics/utils';
import localeUtils from 'utils/LanguageLocale';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';
import CheckoutUtils from 'utils/Checkout';
import brazeUtils from 'analytics/utils/braze';
import userUtils from 'utils/User';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { PHONE_NUMBER_TYPES } from 'constants/CreditCard';
import HelpersUtils from 'utils/Helpers';

import {
    Box, Flex, Text, Button, Divider, Image, Link, Icon
} from 'components/ui';
import { modal } from 'style/config';
import ArkoseLabs from 'components/ArkoseLabs';
import BiRegisterForm from 'components/BiRegisterForm/BiRegisterForm';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import ErrorList from 'components/ErrorList';
import ErrorMsg from 'components/ErrorMsg';
import InfoButton from 'components/InfoButton/InfoButton';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import PasswordRevealInput from 'components/Inputs/PasswordRevealInput';
import InputSwitch from 'components/Inputs/InputSwitch/InputSwitch';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Markdown from 'components/Markdown/Markdown';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import ReCaptchaText from 'components/ReCaptchaText/ReCaptchaText';
import SubscribeEmail from 'components/SubscribeEmail/SubscribeEmail';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Tooltip from 'components/Tooltip/Tooltip';
import * as legalConstants from 'constants/legal';
import { HEADER_VALUE } from 'constants/authentication';
import RegisterPhoneBanner from 'components/GlobalModals/RegisterModal/RegisterForm/RegisterPhoneBanner/RegisterPhoneBanner';

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/RegisterModal/RegisterForm/locales', 'RegisterForm');
const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;

const { ERROR_CODES: errorCodes } = userActions;
const { showCustomModal: showInfoModal } = TermsAndConditionsActions;
const { getProp } = HelpersUtils;

const ERROR_KEYS = {
    REGISTRATION_FRAUD_ERROR: 'profile.account.registrationFraudError'
};

class RegisterForm extends BaseClass {
    constructor(props) {
        super(props);
        const phone = this.props.phone || this.props.biData?.phoneNumber;
        this.state = {
            presetLogin: this.props.presetLogin || '',
            isOpen: false,
            callback: this.props.callback,
            isMarketingEnabled: false,
            joinBICheckbox: this.props.isStoreUser || false,
            isSSIEnabled: this.props.isSSIEnabled || false,
            joinBI: false,
            errorMessageAndSignInHere: '',
            errorMessages: null,
            zipCode: this.props?.biData?.postalCode || '',
            subscribeSephoraEmail: localeUtils.isUS(),
            sephoraEmailDisabled: false,
            inStoreUser: this.props.isStoreUser || false,
            isEpvEmailValidation: this.props.isEpvEmailValidation || false,
            storeUserEmail: (this.props.biData && this.props.biData.userEmail) || '',
            profileId: (this.props.biData && this.props.biData.profileId) || '',
            firstName: (this.props.biData && this.props.biData.firstName) || '',
            lastName: (this.props.biData && this.props.biData.lastName) || '',
            biData: this.props.biData || {},
            mobilePhone: phone ? FormValidator.getFormattedPhoneNumber(phone) : ''
        };

        this.firstNameInput = React.createRef();
        this.lastNameInput = React.createRef();
        this.passwordInput = React.createRef();
        this.mobilePhone = React.createRef();
        this.emailInput = React.createRef();
        this.biRegForm = React.createRef();
        this.reCaptcha = React.createRef();
    }

    componentDidMount() {
        store.setAndWatch('editData.' + this.props.editStore, this, editData => {
            const editStore = editData[this.props.editStore] || {};
            this.setState(prevState => deepExtend({}, prevState, editStore));
        });

        Storage.local.setItem(LOCAL_STORAGE.SIGN_IN_SEEN, true);

        if (localeUtils.isUS() && (this.props.isBIAutoEnroll || this.props.isCreditCardApply)) {
            this.updateEditStore('subscribeSephoraEmail', true);
            this.updateEditStore('sephoraEmailDisabled', true);
        }

        this.loadThirdpartyScript();

        //Analytics
        this.pageLoadAnalytics();
    }

    loadThirdpartyScript = () => {
        import(/* webpackMode: "eager" */ 'thirdparty/frt');
    };

    updateEditStore = (name, value) => {
        const editStore = store.getState().editData[this.props.editStore];
        store.dispatch(EditDataActions.updateEditData(Object.assign({}, editStore, { [name]: value }), this.props.editStore));
    };

    requestClose = () => {
        this.props.isApplePaySignIn
            ? store.dispatch(Actions.showSignInModal({ isOpen: false }))
            : store.dispatch(Actions.showRegisterModal({ isOpen: false }));

        if (this.props.errback) {
            this.props.errback();
        }
    };

    /** handle join bi click dependant on location */
    handleJoinBIClick = isBIChecked => {
        if (localeUtils.isUS()) {
            if (isBIChecked) {
                this.updateEditStore('subscribeSephoraEmail', true);
                this.updateEditStore('sephoraEmailDisabled', true);
            } else {
                this.updateEditStore('subscribeSephoraEmail', true);
                this.updateEditStore('sephoraEmailDisabled', false);
            }
        }
    };

    trackErrors = (errorsObj = {}) => {
        const errors = Object.keys(errorsObj).map(errKey => errorsObj[errKey]);
        const currentEventData = analyticsUtils.getLastAsyncPageLoadData({ pageType: anaConsts.PAGE_TYPES.REGISTER });

        const eventData = {
            data: {
                linkName: 'register:modal:error',
                bindingMethods: linkTrackingError,
                eventStrings: [anaConsts.Event.SIGN_IN_ATTEMPT, anaConsts.Event.SIGN_IN_FAILED],
                fieldErrors: errors.map(error => error.name || error.getComp().props.name),
                errorMessages: errors.map(error => error.message),
                ...currentEventData
            }
        };

        if (!this.props.isCheckout) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);
        }

        return eventData;
    };

    handleSignInHere = () => {
        this.requestClose();

        store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    };

    handleSubscribeSephoraEmail = e => {
        this.updateEditStore('subscribeSephoraEmail', e.target.checked);
    };

    /** collect fields with errors */
    validateForm = () => {
        ErrorsUtils.clearErrors();
        let firstErrorFocused;
        store.watchAction(ErrorsActions.TYPES.ADD_ERROR, action => {
            if (!firstErrorFocused) {
                firstErrorFocused = true;
                ErrorsUtils.focusError(action.error);
            }
        });
        const fieldsForValidation = [];

        if (!this.state.storeUserEmail) {
            fieldsForValidation.push(this.props.isApplePaySignIn ? this.props.applePayEmailInput : this.emailInput.current);
        }

        fieldsForValidation.push(this.firstNameInput.current, this.lastNameInput.current, this.passwordInput.current, this.mobilePhone.current);

        if (this.biRegForm.current) {
            this.biRegForm.current.validateForm(true);
        }

        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);
        ErrorsUtils.validate();
        let totalErrors = store.getState().errors;
        totalErrors = Object.assign({}, totalErrors[ErrorConstants.ERROR_LEVEL.FIELD], totalErrors[ErrorConstants.ERROR_LEVEL.FORM]);
        const hasErrors = Object.keys(totalErrors).length;

        if (hasErrors) {
            if (this.reCaptcha.current && ErrorsUtils.findError(ErrorConstants.ERROR_CODES.CAPTCHA)) {
                this.reCaptcha.current.reset();
            }

            //Analytics
            this.trackErrors(totalErrors);
            //End analytics
        }

        return hasErrors;
    };

    /** reset the form if in store user */
    handleReset = () => {
        this.updateEditStore('firstName', '');
        this.updateEditStore('lastName', '');
        this.updateEditStore('password', '');
        this.updateEditStore('confirmPassword', '');
        this.updateEditStore('profileId', '');

        if (this.state.inStoreUser) {
            this.updateEditStore('storeUserEmail', '');
        }

        if (this.props.isApplePaySignIn) {
            this.applePayEmailInput.empty();
            this.props.resetAppleSignInEmail();
        }

        if (this.reCaptcha.current) {
            this.reCaptcha.current.reset();
        }

        this.updateEditStore('zipCode', '');

        if (this.biRegForm.current) {
            this.biRegForm.current.setState({
                joinBICheckbox: false,
                biMonth: '',
                biDay: '',
                biYear: ''
            });
        }

        this.updateEditStore('sephoraEmailDisabled', false);
        this.updateEditStore('presetLogin', '');
        this.updateEditStore('isSSIEnabled', false);
        this.updateEditStore('storeUserEmail', '');
        this.updateEditStore('profileId', '');
        this.updateEditStore('firstName', '');
        this.updateEditStore('lastName', '');
        this.updateEditStore('inStoreUser', false);
        this.setState({
            isOpen: false,
            callback: null,
            joinBI: false,
            errorMessageAndSignInHere: '',
            errorMessages: null,
            biData: {}
        });
    };

    /** fill user form data with pre-existing store user info */
    inStoreUserHandler = json => {
        this.updateEditStore('password', '');
        this.updateEditStore('confirmPassword', '');

        if (this.reCaptcha.current) {
            this.reCaptcha.current.reset();
        }

        this.updateEditStore('inStoreUser', true);

        if (json.beautyInsiderAccount && this.biRegForm.current) {
            this.biRegForm.current.setState({
                isJoinBIChecked: true,
                isJoinBIDisabled: true,
                biMonth: json.beautyInsiderAccount.birthMonth,
                biDay: json.beautyInsiderAccount.birthDay,
                biYear: json.beautyInsiderAccount.birthYear
            });
        }

        this.updateEditStore('firstName', json.firstName);
        this.updateEditStore('lastName', json.lastName);
        this.updateEditStore('profileId', json.profileId);
        this.updateEditStore('storeUserEmail', json.userName || json.login);

        //Analytics - Hard code error, because the template error can change it shouldn't affect this
        const inStoreError = ErrorConstants.ERROR_CODES.IN_STORE_USER;
        this.trackErrors({ [inStoreError]: ErrorsUtils.getError(inStoreError) });
    };

    /** callback for successful API registration */
    registerSuccess = (response, isBI) => {
        this.props.isApplePaySignIn
            ? store.dispatch(Actions.showSignInModal({ isOpen: false }))
            : store.dispatch(Actions.showRegisterModal({ isOpen: false }));

        if (this.props.openPostBiSignUpModal && userUtils.isBI()) {
            store.dispatch(Actions.showBeautyPreferencesModal({ isOpen: true }));
        } else if (Sephora.isMobile() && !this.props.isApplePaySignIn && !this.props.isCheckout) {
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('registrationComplete'),
                    message: getText(isBI ? 'confirmMessageBI' : 'confirmMessage'),
                    buttonText: getText('continue')
                })
            );
        }

        // UTS-532 / UTS-592 - Fire Google Pixel for eventLogin on successful registration
        const biDetails = response.beautyInsiderAccount || {};
        processEvent.process(anaConsts.SIGN_IN_SUCCESS, {
            data: {
                profileId: response.profileId,
                biAccountNumber: biDetails.biAccountId || 0,
                biStatus: biDetails.vibSegment || 'non-bi',
                biPoints: biDetails.promotionPoints || 0
            }
        });

        brazeUtils.setBrazeUserData();

        if (this.state.callback) {
            this.state.callback(response);
        }

        // Remove Email Verification URL
        if (this.props.isCompleteAccountSetupModal) {
            Actions.removeEmailVerificationFromURL().then(action => {
                store.dispatch(action);
            });
        }
    };

    /** callback for failed API registration */
    registerFailure = response => {
        ErrorsUtils.collectAndValidateBackEndErrors(response, this);
        this.setState({ inputsDisabled: false });
        let hasErrorFields = false;

        if (Array.isArray(response.errors)) {
            this.reCaptcha.current.reset();

            if (userUtils.isPhoneRejectedError(response) && this.mobilePhone.current) {
                this.mobilePhone.current.showError(getText('phoneNumberRejected'));
            } else {
                const ngpuErrorsCodes = /^(eps|auth)\.createUser\.[A-Za-z]+\.[A-Za-z]+$/;
                const errorMessages = response.errors.map(({ errorCode, errorMessage }) => {
                    if (ngpuErrorsCodes.test(errorCode)) {
                        const [, , type, field] = errorCode.split('.');

                        if (type === 'eps' && field === 'failed') {
                            return getText('genericError');
                        }

                        return getText(`${type}${field.replace(field[0], field[0].toUpperCase())}`);
                    } else if (errorCode.startsWith('ERR')) {
                        return errorMessage;
                    }

                    return getText('genericError');
                });
                this.setState({ errorMessages });
            }
        }

        if (errorCodes.STORE_REGISTERED_ERROR_CODE === response.errorCode) {
            this.inStoreUserHandler(response.data);
        } else {
            if (response.errorMessages && response.errors) {
                if (this.reCaptcha.current) {
                    this.reCaptcha.current.reset();
                }

                if (response.errors.biBirthDayInput && this.biRegForm.current) {
                    this.biRegForm.current.setErrorState(response.errors.biBirthDayInput.join());
                    hasErrorFields = true;
                }

                if (response.errors[ERROR_KEYS.REGISTRATION_FRAUD_ERROR]) {
                    this.setState({ errorMessageAndSignInHere: response.errors[ERROR_KEYS.REGISTRATION_FRAUD_ERROR].join(' ') });
                } else if (!hasErrorFields) {
                    this.setState({ errorMessages: response.errorMessages });
                }
            }
        }
    };

    showError = () => {
        if (this.reCaptcha.current) {
            this.reCaptcha.current.reset();
        }
    };

    /**
     * need to set registerFrom to orderConfirmation in case that
     * user is registering with guest user email through normal
     * register flow on guest checkout order conf page
     */
    getRegistrationFromParam = emailValue => {
        let registrationFrom = this.props.isCheckout ? 'RegisterCheckOut' : 'RegisterNormal';
        const guestProfile = CheckoutUtils.getGuestProfile();

        if (guestProfile && guestProfile.email === emailValue) {
            registrationFrom = 'orderConfirmation';
        }

        return registrationFrom;
    };

    /** Reformat user form data into params for API call
     * @param {object} BI date data
     */
    getOptionParams = (biFormData, subscribeCheck, captchaToken) => {
        const { applePayEmailInput } = this.props;
        const { isMarketingEnabled } = this.state;
        const emailValue = this.state.inStoreUser
            ? this.state.storeUserEmail
            : (applePayEmailInput && applePayEmailInput.getValue()) || this.state.presetLogin;

        const registrationFrom = this.getRegistrationFromParam(emailValue);

        const optionParams = {
            userDetails: {
                email: emailValue,
                login: emailValue,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                password: this.state.password,
                confirmPassword: this.state.password
            },
            registrationFrom: registrationFrom,
            requestOrigin: 'Registration'
        };
        const phoneNumberSanitized = this.state.mobilePhone.replace(/\D+/g, '');

        if (Sephora.configurationSettings.enableChangePhoneParameterBP1) {
            optionParams.userDetails.primaryPhone = phoneNumberSanitized;
        } else {
            optionParams.userDetails.phoneNumber = phoneNumberSanitized;
        }

        if (Sephora.isMobile() && Sephora.configurationSettings.isOptInSSIMWebEnabled) {
            optionParams.isKeepSignedIn = this.state.isSSIEnabled;
        }

        if (captchaToken) {
            optionParams.captchaToken = captchaToken;
            optionParams.captchaLocation = 'REGISTRATION_POPUP';
        }

        const profileId = this.state.profileId;

        if (profileId) {
            optionParams.userDetails.profileId = this.state.profileId;
        }

        const isAutomaticBIEnroll = this.state.inStoreUser || (this.props.isBIAutoEnroll && this.biRegForm.current.state.isJoinBIChecked);

        if (biFormData && biFormData.birthDay) {
            optionParams.userDetails.biAccount = biFormData;
            optionParams.isJoinBi = true;
        } else if (isAutomaticBIEnroll) {
            // if inStoreUser didn't provide any data to form, then pass the default one
            optionParams.userDetails.biAccount = {
                birthMonth: '1',
                birthDay: '1',
                birthYear: '1804'
            };
            optionParams.isJoinBi = true;
        } else {
            optionParams.isJoinBi = false;
        }

        optionParams.subscription = { subScribeToEmails: subscribeCheck };

        if (this.state.zipCode) {
            optionParams.subscription.zipCode = this.state.zipCode.replace(/\s+/g, '');
        }

        if (isMarketingEnabled) {
            optionParams.subscription.subScribeToSms = isMarketingEnabled;
        }

        return optionParams;
    };

    validateCaptchaAndRegisterAfterState = () => {
        if (this.reCaptcha.current && !this.validateForm()) {
            this.reCaptcha.current.execute();
        } else {
            this.register();
        }
    };

    validateCaptchaAndRegister = callback => {
        if (callback) {
            this.setState({ callback }, this.validateCaptchaAndRegisterAfterState);
        } else {
            this.validateCaptchaAndRegisterAfterState();
        }
    };

    onCaptchaTokenReady = token => {
        if (token) {
            this.register(token);
        } else {
            this.reCaptcha.current.reset();
        }
    };

    onChallengerShow = () => {
        this.props.hideModal && this.props.hideModal(true);
    };

    onChallengerDismiss = () => {
        this.props.hideModal && this.props.hideModal(false);
    };

    /** Register new user on form submit */
    register = (captchaToken, callback, intersticeDelayMs) => {
        const { analyticsData } = this.props;

        if (!this.validateForm()) {
            let biFormData = null;

            if (this.biRegForm.current) {
                biFormData = this.biRegForm.current.getBIDate();
            }

            const successCallback = response => {
                this.registerSuccess(response, biFormData);
            };

            const failureCallback = response => {
                this.registerFailure(response);
            };

            /** user can't submit anything, and API error messages get erased if
             * they exist from previous submission attempt
             */

            this.setState(
                {
                    callback: callback || this.state.callback,
                    errorMessageAndSignInHere: '',
                    errorMessages: null
                },
                () => {
                    let optionParams = this.getOptionParams(biFormData, this.state.subscribeSephoraEmail, captchaToken);

                    optionParams.inStoreUser = this.state.inStoreUser;
                    optionParams.isKeepSignedIn = this.state.isSSIEnabled;
                    optionParams.biAccountId = this.state.biData.biAccountId;
                    optionParams.isEpvEmailValidation = this.state.isEpvEmailValidation;

                    const { extraParams } = this.props;

                    if (extraParams) {
                        optionParams = {
                            ...optionParams,
                            ...extraParams
                        };
                    }

                    store.dispatch(UserActions.register(optionParams, successCallback, failureCallback, intersticeDelayMs, null, analyticsData));
                }
            );
        } else {
            this.setState({
                errorMessageAndSignInHere: '',
                errorMessages: null
            });
        }
    };

    showBIInfoModal = () => {
        const infoMessage =
            'As a member of Beauty Insider, you’ll earn points with every purchase that ' +
            'can be redeemed for samples, experiences, and services, plus you’ll receive ' +
            'a gift on your birthday, exclusive offers, and more.';

        store.dispatch(showInfoModal(true, ' ', infoMessage));
    };

    // ILLUPH-125210 New Register Modal Test
    // Reused and refactored from AddressForm.c.js

    formatPhoneNumber = e => {
        const rawValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        const name = e.target.name;
        this.setState({ [name]: FormValidator.getFormattedPhoneNumber(rawValue, e.inputType) });

        const pairedInput = this.getPairedInputName(name);
        const errorCode = this.getErrorCode(pairedInput);

        this[pairedInput] && this[pairedInput].removeSpecificError(ErrorConstants.ERRORS[errorCode].message);
    };

    getPairedInputName = name => {
        return name === PHONE_NUMBER_TYPES.MOBILE ? PHONE_NUMBER_TYPES.ALTERNATE : PHONE_NUMBER_TYPES.MOBILE;
    };

    getErrorCode = inputName => {
        const { MOBILE_NUMBER, ALTERNATIVE_NUMBER } = ErrorConstants.ERROR_CODES;

        return inputName === PHONE_NUMBER_TYPES.MOBILE ? MOBILE_NUMBER : ALTERNATIVE_NUMBER;
    };

    pageLoadAnalytics = () => {
        const { isCreditCardApply, analyticsData, isCompleteAccountSetupModal } = this.props;
        const { context } = analyticsData || {};
        const { REGISTER, EMAIL_VERIFICATION } = anaConsts.PAGE_TYPES;
        const contextEvent = (context && analyticsUtils.getLastAsyncPageLoadData({ pageType: context })) || {};

        const registerData = {
            pageName: `${REGISTER}:${isCompleteAccountSetupModal ? EMAIL_VERIFICATION : REGISTER}:n/a:*`,
            pageType: REGISTER,
            pageDetail: REGISTER,
            eventStrings: [anaConsts.Event.REGISTRATION_STEP_1],
            ...analyticsData,
            previousPageName: contextEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
        };

        if (isCreditCardApply) {
            registerData.linkData = 'creditcard:Register with Sephora:Register and Apply Now';
        }

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: registerData });
    };

    toggleMarketing = () => {
        this.setState({ isMarketingEnabled: !this.state.isMarketingEnabled });
    };

    handleUpdateEditStore = e => this.updateEditStore(e.target.name, e.target.value);

    handleUpdateEditStoreCustomName = name => e => this.updateEditStore(name, e.target.value);

    validatePassword = password => {
        if (FormValidator.isEmpty(password) || !FormValidator.isValidLength(password, 6, 12) || FormValidator.hasEmptySpaces(password)) {
            return ErrorConstants.ERROR_CODES.PASSWORD;
        }

        return null;
    };

    validateMobilePhone = mobilePhoneNo => {
        if (this.state.isMarketingEnabled) {
            if (FormValidator.isEmpty(mobilePhoneNo)) {
                return ErrorConstants.ERROR_CODES.MARKETING_PHONE_NUMBER;
            }
        }

        if (mobilePhoneNo.length && !FormValidator.isValidPhoneNumber(mobilePhoneNo)) {
            return ErrorConstants.ERROR_CODES.PHONE_NUMBER_INVALID_REGISTRATION;
        }

        return null;
    };

    validateFirstName = firstName => {
        if (FormValidator.isEmpty(firstName)) {
            return ErrorConstants.ERROR_CODES.FIRST_NAME;
        }

        return null;
    };

    validateLastName = lastName => {
        if (FormValidator.isEmpty(lastName)) {
            return ErrorConstants.ERROR_CODES.LAST_NAME;
        }

        return null;
    };

    handleToggleSSI = e => {
        this.updateEditStore(e.target.name, !this.state.isSSIEnabled);
        this.setState({ isSSIEnabled: !this.state.isSSIEnabled });
    };

    /* eslint-disable-next-line complexity */
    render() {
        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();

        const {
            isApplePaySignIn,
            hideEmail,
            hideName,
            hideButton,
            isCheckout,
            isEmailDisabled,
            isBIAutoEnroll,
            isCreditCardApply,
            isRegisterModal,
            emailOptIn,
            isCompleteAccountSetupModal,
            extraParams
        } = this.props;

        const isTwoColumn = isDesktop && isCheckout;
        const columnGutter = 4;

        const isCanada = localeUtils.isCanada();

        const isCanadaCheckout = isCheckout && isCanada;
        const isCaptchaEnabled = isCheckout
            ? Sephora.configurationSettings.captchaCheckoutRegistrationEnabled
            : Sephora.configurationSettings.captchaRegistrationPopupEnabled;
        const isSSIEnabled = Sephora.configurationSettings.isOptInSSIMWebEnabled;
        const isEmailVerificationEnabled = Sephora.configurationSettings.isEmailVerificationEnabled;

        const isBICheckedAndDisabled = this.state.inStoreUser || isCreditCardApply;

        const subscribeEmailComponent = (
            <SubscribeEmail
                isCanadaCheckout={isCanadaCheckout}
                style={(isCheckout && !isCanada) || (isApplePaySignIn && !isCanada) ? { display: 'none' } : null}
                name='subScribeToEmails'
                isApplePaySignIn={isApplePaySignIn}
                checked={this.state.subscribeSephoraEmail}
                disabled={this.state.sephoraEmailDisabled}
                hasDivider={false}
                onChange={this.handleSubscribeSephoraEmail}
            />
        );

        const RootComp = hideButton ? 'div' : 'form';
        const mobilePhone = 'mobilePhone';
        const buttonCTAText = isCompleteAccountSetupModal
            ? getText('completeProfile')
            : isRegisterModal
                ? getText('joinNow')
                : getText('registerButtonLabel');
        const tosOptionText = isCompleteAccountSetupModal ? getText('completeProfile') : getText('joinNow');

        const isBookingFlow = extraParams?.isBookingFlow ?? false;
        const registrationMessage = isBookingFlow ? getText('joinBookingBiProgram') : getText('joinBiFreeShip');

        return (
            <RootComp
                noValidate
                onSubmit={
                    !hideButton
                        ? e => {
                            e.preventDefault();
                            this.validateCaptchaAndRegister();
                        }
                        : null
                }
            >
                {isRegisterModal && (
                    <Box
                        lineHeight='tight'
                        marginBottom={4}
                        marginTop={2}
                    >
                        <Image
                            alt='Beauty Insider'
                            disableLazyLoad={true}
                            display='block'
                            src='/img/ufe/bi/logo-beauty-insider.svg'
                            width={201}
                            height={30}
                            marginBottom={4}
                        />
                        {isCompleteAccountSetupModal && (
                            <Flex
                                gap={2}
                                marginY={4}
                                alignItems='center'
                                color='green'
                            >
                                <Icon
                                    name='checkmark'
                                    size='.85em'
                                />
                                {this.state.storeUserEmail} {getText('verified')}
                            </Flex>
                        )}
                        {isCompleteAccountSetupModal ? <p>{getText('justOneMoreStep')}</p> : <Markdown content={registrationMessage} />}
                    </Box>
                )}

                {!hideName && !isRegisterModal ? (
                    <Text
                        is='p'
                        fontSize='sm'
                        marginBottom='1.125em'
                        color='gray'
                        lineHeight='tight'
                        children={getText('requiredInformationLabel')}
                    />
                ) : null}

                <ErrorList errorMessages={this.state.errorMessages} />

                {this.state.errorMessageAndSignInHere && (
                    <Text
                        fontSize='sm'
                        is='p'
                        lineHeight='tight'
                        marginBottom='1em'
                    >
                        <ErrorMsg
                            display='inline'
                            is='span'
                        >
                            {this.state.errorMessageAndSignInHere}
                        </ErrorMsg>{' '}
                        <Text color='blue'>
                            <Link
                                onClick={this.handleSignInHere}
                                underline={true}
                            >
                                {getText('signInHere')}
                            </Link>
                        </Text>
                    </Text>
                )}

                {this.state.inStoreUser && !isCompleteAccountSetupModal && (
                    <ErrorMsg
                        is='div'
                        marginBottom={4}
                    >
                        <Text
                            is='p'
                            marginBottom='.5em'
                        >
                            {getText('recognizedRegisteredEmailMessage')} <strong>{this.state.storeUserEmail}</strong>.
                            {getText('fillInformationMessage')}
                        </Text>
                        <Text is='p'>
                            {getText('notYouMessage')},{' '}
                            <Link
                                onClick={this.handleReset}
                                fontWeight='bold'
                            >
                                {getText('notYouClickHereClearLink')}
                            </Link>
                            .
                        </Text>
                    </ErrorMsg>
                )}

                {hideName || (
                    <LegacyGrid
                        fill={true}
                        gutter={columnGutter}
                    >
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('firstNameLabel')}
                                autoComplete='given-name'
                                autoCorrect='off'
                                hideAsterisk={isRegisterModal}
                                name='firstName'
                                required={true}
                                maxLength={FIELD_LENGTHS.name}
                                value={this.state.firstName}
                                data-at={Sephora.debug.dataAt('first_name_input')}
                                onChange={this.handleUpdateEditStore}
                                ref={this.firstNameInput}
                                validateError={this.validateFirstName}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('lastNameLabel')}
                                autoComplete='family-name'
                                autoCorrect='off'
                                hideAsterisk={isRegisterModal}
                                name='lastName'
                                required={true}
                                maxLength={FIELD_LENGTHS.name}
                                value={this.state.lastName}
                                data-at={Sephora.debug.dataAt('last_name_input')}
                                onChange={this.handleUpdateEditStore}
                                ref={this.lastNameInput}
                                validateError={this.validateLastName}
                            />
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                )}

                {hideEmail || isCompleteAccountSetupModal || (
                    <InputEmail
                        label={getText('emailAddresLabel')}
                        name='username'
                        id='register_email'
                        hideAsterisk={isRegisterModal}
                        login={this.state.presetLogin}
                        disabled={this.state.inStoreUser || isEmailDisabled}
                        onChange={this.handleUpdateEditStoreCustomName('presetLogin')}
                        ref={this.emailInput}
                    />
                )}

                <LegacyGrid gutter={columnGutter}>
                    <LegacyGrid.Cell width={isTwoColumn ? '50%' : null}>
                        <Box position='relative'>
                            <PasswordRevealInput
                                marginBottom={null}
                                label={getText('passwordLabel', [FIELD_LENGTHS.passwordMin, FIELD_LENGTHS.passwordMax])}
                                autoComplete='new-password'
                                autoCorrect='off'
                                autoCapitalize='off'
                                hideAsterisk={isRegisterModal}
                                spellCheck={false}
                                name='password'
                                id='register_password'
                                data-at={Sephora.debug.dataAt('password_input')}
                                required={true}
                                value={this.state.password}
                                onChange={this.handleUpdateEditStore}
                                ref={this.passwordInput}
                                validateError={this.validatePassword}
                            />
                        </Box>
                    </LegacyGrid.Cell>
                </LegacyGrid>

                {isRegisterModal && (
                    <>
                        <LegacyGrid
                            fill={true}
                            gutter={columnGutter}
                            marginTop={4}
                        >
                            <LegacyGrid.Cell>
                                <TextInput
                                    name={mobilePhone}
                                    label={getText('phoneNumber')}
                                    autoComplete='tel'
                                    autoCorrect='off'
                                    type='tel'
                                    maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                                    required={false}
                                    value={this.state.mobilePhone}
                                    onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                    onChange={this.formatPhoneNumber}
                                    onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                    ref={this.mobilePhone}
                                    validateError={this.validateMobilePhone}
                                />
                            </LegacyGrid.Cell>
                            <LegacyGrid.Cell>
                                {/* text needs to be fetched from cms */}
                                <Text
                                    is='p'
                                    fontSize='sm'
                                    lineHeight='tight'
                                    paddingY={2}
                                >
                                    {getText('phoneNumberBenefit')}
                                </Text>
                            </LegacyGrid.Cell>
                        </LegacyGrid>
                    </>
                )}

                {isRegisterModal && (
                    <Flex alignItems='center'>
                        <Checkbox
                            marginRight={2}
                            paddingY={0}
                            name='isMarketingEnabled'
                            checked={this.state.isMarketingEnabled}
                            onClick={this.toggleMarketing}
                        >
                            <Text fontWeight='bold'>{getText('marketingCheckbox')}</Text>
                        </Checkbox>
                    </Flex>
                )}
                <RegisterPhoneBanner pageName='registration' />

                {isRegisterModal && emailOptIn && subscribeEmailComponent}

                {isSSIEnabled && !isRegisterModal && (
                    <Flex
                        marginTop={4}
                        justifyContent='flex-end'
                        alignItems='center'
                    >
                        <Text
                            is='label'
                            htmlFor='register_ssi'
                            paddingRight={3}
                        >
                            {getText('staySignedInLabel')}
                        </Text>
                        <InputSwitch
                            name='isSSIEnabled'
                            id='register_ssi'
                            checked={this.state.isSSIEnabled}
                            onClick={this.handleToggleSSI}
                        />
                    </Flex>
                )}

                {isApplePaySignIn ? (
                    <React.Fragment>
                        <Divider
                            thick
                            marginY={3}
                            marginX={modal.outdentX}
                        />
                        <Text
                            is='p'
                            marginY={3}
                            fontSize='lg'
                            fontWeight='bold'
                        >
                            {getText('joinSephoraLabel')} <InfoButton onClick={this.showBIInfoModal} />
                        </Text>
                        <Text
                            is='p'
                            marginY={3}
                        >
                            {getText('joinSephoraDisclaimer')}
                        </Text>
                        <BiRegisterForm
                            isRegisterModal={isRegisterModal}
                            isJoinBIChecked={isRegisterModal || isBIAutoEnroll || isBICheckedAndDisabled}
                            isJoinBIDisabled={isBICheckedAndDisabled}
                            isCreditCardApply={isCreditCardApply}
                            isBIAutoEnroll={isBIAutoEnroll}
                            biData={this.state.biData}
                            callback={this.handleJoinBIClick}
                            isApplePaySignIn={isApplePaySignIn}
                            ref={this.biRegForm}
                        />
                        {subscribeEmailComponent}
                        {!isCanada && !isMobile && isRegisterModal ? <Divider marginTop={4} /> : null}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {!isRegisterModal && (
                            <Divider
                                marginTop={6}
                                marginBottom={4}
                            />
                        )}
                        <BiRegisterForm
                            isRegisterModal={isRegisterModal}
                            isCanadaCheckout={isCanadaCheckout}
                            isJoinBIChecked={isBIAutoEnroll || isBICheckedAndDisabled}
                            isJoinBIDisabled={isBICheckedAndDisabled}
                            isBIAutoEnroll={isBIAutoEnroll}
                            isCreditCardApply={isCreditCardApply}
                            biData={this.state.biData}
                            callback={this.handleJoinBIClick}
                            ref={this.biRegForm}
                            subscribeEmail={subscribeEmailComponent}
                        />
                    </React.Fragment>
                )}

                {!isRegisterModal && !isCanadaCheckout && !isApplePaySignIn && subscribeEmailComponent}

                {!isApplePaySignIn && !isCheckout && (
                    <React.Fragment>
                        <Divider
                            marginBottom={4}
                            marginTop={4}
                        />
                        <TextInput
                            label={getText('zipCodeLabel')}
                            autoComplete='postal-code'
                            autoCorrect='off'
                            name='zipCode'
                            onChange={this.handleUpdateEditStore}
                            value={this.state.zipCode}
                            maxLength={FIELD_LENGTHS.zipCode}
                        />
                        {isRegisterModal && (
                            <Divider
                                marginBottom={4}
                                marginTop={4}
                            />
                        )}
                    </React.Fragment>
                )}

                {hideButton || (
                    <Box
                        color='gray'
                        fontSize='sm'
                        lineHeight='tight'
                        marginTop={4}
                    >
                        <Text
                            is='p'
                            marginBottom='1em'
                        >
                            <Text
                                is='span'
                                fontWeight='bold'
                            >
                                {getText('disclosure')}
                            </Text>
                            {getText('byEntering')}
                            <Text
                                is='span'
                                fontWeight='bold'
                            >
                                {getText('signMeUp')}
                            </Text>
                            {getText('clicking', [tosOptionText])}
                            <Link
                                color='blue'
                                underline={true}
                                fontWeight='bold'
                                href={legalConstants.TEXT_TERM_LINK}
                                children={getText('textTerm')}
                            />
                            <Text is='span'>{getText('message')}</Text>
                            <Link
                                color='blue'
                                underline={true}
                                fontWeight='bold'
                                href={legalConstants.PRIVACY_POLICY_LINK}
                                children={getText('privacy')}
                            />
                            {isCanada ? (
                                ''
                            ) : (
                                <>
                                    {getText('and')}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        fontWeight='bold'
                                        href={legalConstants.USNoticeIncentiveLink}
                                        children={getText('noticeOf')}
                                    />
                                </>
                            )}
                            {'.'}
                            {getText('textStop')}
                            {isCanada ? getText('textStopAddress') : ''}
                        </Text>
                        <Text
                            is='p'
                            marginBottom='1em'
                        >
                            {getText('byClicking', [tosOptionText])}{' '}
                            <Link
                                color='blue'
                                underline={true}
                                href={legalConstants.PRIVACY_POLICY_LINK}
                                children={getText('privacyPolicy')}
                            />
                            {localeUtils.isFrench() ? ' ' : ''}
                            {getText('and')}
                            <Link
                                color='blue'
                                underline={true}
                                target='_blank'
                                href={legalConstants.USNoticeIncentiveLink}
                                children={getText('noticeFinancialIncentive')}
                                {...(isEmailVerificationEnabled && { display: 'inline' })}
                            />
                            , (2),
                            {getText('agreeTo')}
                            <Link
                                color='blue'
                                underline={true}
                                fontWeight='bold'
                                href={legalConstants.TERMS_OF_USE_LINK}
                                children={getText('termsOfUse')}
                            />
                            {localeUtils.isFrench() ? ',' + getText('and') : ', '}
                            <Link
                                color='blue'
                                underline={true}
                                fontWeight='bold'
                                href={legalConstants.BEAUTY_INSIDER_TERMS_LINK}
                                children={getText('biTerms')}
                            />
                            {isCanada ? '.' : getText('receiveOffers')}
                        </Text>
                    </Box>
                )}
                {isSSIEnabled && isRegisterModal && (
                    <>
                        <Flex
                            marginY={4}
                            alignItems='center'
                        >
                            <Checkbox
                                marginRight={2}
                                paddingY={2}
                                name='isSSIEnabled'
                                id='register_ssi'
                                checked={this.state.isSSIEnabled}
                                onClick={this.handleToggleSSI}
                            >
                                {getText('staySignedInLabel')}
                            </Checkbox>
                            <Tooltip
                                content={getText('staySignedInTooltip')}
                                dismissButton={true}
                                fontSize='sm'
                            >
                                <InfoButton />
                            </Tooltip>
                        </Flex>
                    </>
                )}

                {hideButton || (
                    <>
                        <Button
                            variant='primary'
                            hasMinWidth={true}
                            type='submit'
                            data-at={Sephora.debug.dataAt('join_now')}
                            children={isCreditCardApply ? getText('createAccountButtonLabel') : buttonCTAText}
                            {...(isEmailVerificationEnabled && { width: '100%' })}
                        />
                        {isCaptchaEnabled && (
                            <React.Fragment>
                                <Divider
                                    marginTop={4}
                                    marginBottom={4}
                                    marginX={isRegisterModal && modal.outdentX}
                                />
                                <ReCaptchaText isRegisterModal={isRegisterModal} />
                            </React.Fragment>
                        )}
                    </>
                )}

                <ArkoseLabs />

                {isCaptchaEnabled && (
                    <ReCaptcha
                        ref={this.reCaptcha}
                        onChange={this.onCaptchaTokenReady}
                        onChallengerShow={this.onChallengerShow}
                        onChallengerDismiss={this.onChallengerDismiss}
                    />
                )}
            </RootComp>
        );
    }
}

export default wrapComponent(RegisterForm, 'RegisterForm');
