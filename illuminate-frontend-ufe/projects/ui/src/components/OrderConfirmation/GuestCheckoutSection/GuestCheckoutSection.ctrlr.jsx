/* eslint-disable max-len */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { forms, space } from 'style/config';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import PasswordRevealInput from 'components/Inputs/PasswordRevealInput';
import FormValidator from 'utils/FormValidator';
const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;
import ErrorConstants from 'utils/ErrorConstants';
import ErrorList from 'components/ErrorList';
import Popover from 'components/Popover/Popover';
import BiRegisterForm from 'components/BiRegisterForm/BiRegisterForm';
import SubscribeEmail from 'components/SubscribeEmail/SubscribeEmail';
import ReCaptchaText from 'components/ReCaptchaText/ReCaptchaText';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import urlUtils from 'utils/Url';
import * as legalConstants from 'constants/legal';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import TextInput from 'components/Inputs/TextInput/TextInput';
import {
    Box, Link, Text, Image, Button, Divider, Flex
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Markdown from 'components/Markdown/Markdown';
import store from 'store/Store';
import EditDataActions from 'actions/EditDataActions';
import profileApi from 'services/api/profile';
import ErrorsUtils from 'utils/Errors';
import deepExtend from 'utils/deepExtend';
import UserActions from 'actions/UserActions';
import userUtils from 'utils/User';
import biApi from 'services/api/beautyInsider';
import Actions from 'actions/Actions';
import brazeUtils from 'analytics/utils/braze';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Storage from 'utils/localStorage/Storage';
import HelperUtils from 'utils/Helpers';
import { PHONE_NUMBER_TYPES } from 'constants/CreditCard';
import Empty from 'constants/empty';
import NGPCookies from 'utils/NGPCookies';

const GUEST_SIGN_IN_CONFIRMATION = 'GUEST_SIGN_IN_CONFIRMATION';
const LOOKUP_SOURCE = 'orderConfirmation';

const { showOrderConfirmRewardModal } = Actions;

class GuestCheckoutSection extends BaseClass {
    state = {
        showSignIn: true,
        showPopover: !this.props.isExistingUser || this.props.isNonBIRegisteredUser,
        mobilePhone: '',
        isMarketingEnabled: false
    };

    reCaptcha = null;

    componentDidMount() {
        store.setAndWatch('editData.' + this.props.editStore, this, editData => {
            const editStore = editData[this.props.editStore] || {};
            this.setState(prevState => deepExtend({}, prevState, editStore));
        });

        store.setAndWatch('user', this, () => {
            if (userUtils.isSignedIn()) {
                this.setState(
                    {
                        showSignIn: false,
                        showSignInConfirmation: this.shouldShowSignInConfirmation()
                    },
                    () => {
                        Storage.local.removeItem(GUEST_SIGN_IN_CONFIRMATION);
                    }
                );
            }

            brazeUtils.setBrazeUserData();
        });

        if (this.props.isStoreBIMember) {
            profileApi.lookupProfileByLogin(this.props.guestEmail, NGPCookies.isNGPUserRegistrationEnabled() ? LOOKUP_SOURCE : null).then(data => {
                //if default birthday leave birthday from blank
                //if birthday has month/day but year is still the default 1804
                //then still show form so user may update year if they would like
                const biAccount = data.beautyInsiderAccount || Empty.Object;

                if (userUtils.isDefaultBIBirthDay(biAccount)) {
                    this.setState({
                        biData: {
                            bMon: '',
                            bDay: '',
                            bYear: ''
                        }
                    });
                } else if (parseInt(biAccount.birthYear) === 1804) {
                    this.setState({
                        biData: {
                            bMon: biAccount.birthMonth,
                            bDay: biAccount.birthDay,
                            bYear: ''
                        }
                    });
                }

                this.inStoreUserData = data;
            });
        }
    }

    navigateToReservationConfirmationPage = () => {
        const params = urlUtils.getParams();
        const queryStringArray = [];

        if (!Object.prototype.hasOwnProperty.call(params, 'id') && this.props.confirmationId) {
            params.id = this.props.confirmationId;
        }

        Object.keys(params)
            .filter(key => key !== 'isGuest')
            .forEach(key => queryStringArray.push(`${key}=${params[key]}`));

        const confirmationUrl = `/happening/reservations/confirmation?${queryStringArray.join('&')}`;
        locationUtils.navigateTo(null, confirmationUrl);
        locationUtils.reload();
    };

    shouldShowSignInConfirmation = () => {
        return Boolean(Storage.local.getItem(GUEST_SIGN_IN_CONFIRMATION) || 1);
    };

    shouldDisplayPopover = () => {
        return (!this.props.isExistingUser || this.props.isNonBIRegisteredUser) && this.props.biFormTestType === 'default';
    };

    forgotPassword = e => {
        e.preventDefault();
        store.dispatch(Actions.showForgotPasswordModal(true, this.props.guestEmail));
    };

    openRewardsModal = () => {
        biApi
            .getBiRewardsGroupForOrderConf()
            .then(rewards => {
                let biRewards = [];
                Object.values(rewards.biRewardGroups).forEach(rewardsArray => {
                    biRewards = biRewards.concat(rewardsArray);
                });
                store.dispatch(showOrderConfirmRewardModal(true, biRewards));
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    updateEditStore = (name, value) => {
        const editStore = store.getState().editData[this.props.editStore];
        store.dispatch(EditDataActions.updateEditData(Object.assign({}, editStore, { [name]: value }), this.props.editStore));
    };

    toggleCompleteForm = () => {
        if (!this.state.showRestOfForm) {
            this.setState({ showRestOfForm: true });
        }
    };

    showError = () => {
        if (this.reCaptcha) {
            this.reCaptcha.reset();
        }
    };

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [];

        fieldsForValidation.push(this.emailInput);
        fieldsForValidation.push(this.passwordInput);
        fieldsForValidation.push(this.mobilePhone);

        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        const isBIFormValid = this.biRegForm ? this.biRegForm.validateForm(true) : false;

        return !ErrorsUtils.validate() && !isBIFormValid;
    };

    guestCheckoutRegisterSuccess = response => {
        store.dispatch(UserActions.getUserFull());

        // UTS-532 / UTS-600 - Fire Google Pixel for eventLogin on successful registration
        const biDetails = NGPCookies.isNGPUserRegistrationEnabled() ? response : response.beautyInsiderAccount || Empty.Object;
        processEvent.process(anaConsts.SIGN_IN_SUCCESS, {
            data: {
                profileId: response.profileId,
                biAccountNumber: biDetails.biAccountId || 0,
                biStatus: biDetails.vibSegment || 'non-bi',
                biPoints: biDetails.promotionPoints || 0
            }
        });

        if (this.props?.isBooking) {
            store.dispatch(Actions.showBiRegisterModal({ isOpen: false }));
            this.navigateToReservationConfirmationPage();
        }
    };

    guestCheckoutSignInFailure = response => {
        if (response.errorMessages) {
            this.setState({ errorMessages: response.errorMessages });
        }
    };

    guestCheckoutRegisterFailure = response => {
        ErrorsUtils.collectAndValidateBackEndErrors(response, this);

        if (response.errorMessages && response.errors) {
            if (this.reCaptcha) {
                this.reCaptcha.reset();
            }

            this.setState({ errorMessages: response.errorMessages });
        }
    };

    guestCheckoutRegister = captchaToken => {
        const biFormData = this.biRegForm && this.biRegForm.getBIDate();
        const isJoinBi = this.props.isStoreBIMember ? true : this.biRegForm.state.isJoinBIChecked;
        const profileData = {
            registrationFrom: 'orderConfirmation',
            isJoinBi: isJoinBi
        };

        if (captchaToken) {
            profileData.captchaToken = captchaToken;
            profileData.captchaLocation = 'REGISTRATION_POPUP';
        }

        if (this.props.isStoreBIMember) {
            profileData.userDetails = {
                email: this.props.guestEmail,
                login: this.props.guestEmail,
                firstName: this.inStoreUserData.firstName,
                lastName: this.inStoreUserData.lastName,
                password: this.state.password,
                confirmPassword: this.state.password,
                profileId: this.inStoreUserData.profileId,
                phoneNumber: this.state.mobilePhone ? this.state.mobilePhone.replace(/\D+/g, '') : ''
            };

            if (biFormData) {
                profileData.userDetails.biAccount = biFormData;
            } else {
                const beautyInsiderAccount = this.inStoreUserData.beautyInsiderAccount || Empty.Object;
                profileData.userDetails.biAccount = {
                    birthMonth: beautyInsiderAccount.birthMonth,
                    birthDay: beautyInsiderAccount.birthDay,
                    birthYear: beautyInsiderAccount.birthYear
                };
            }
        } else {
            profileData.userDetails = {
                email: this.state.email,
                password: this.state.password,
                biAccount: biFormData,
                phoneNumber: this.state.mobilePhone ? this.state.mobilePhone.replace(/\D+/g, '') : ''
            };

            if (NGPCookies.isNGPUserRegistrationEnabled()) {
                profileData.userDetails.firstName = this.props.firstName;
                profileData.userDetails.lastName = this.props.lastName;
                profileData.userDetails.email = this.props.guestEmail ?? this.state.email;
            }
        }

        profileData.subscription = { subScribeToSms: this.state.isMarketingEnabled || false };

        if (localeUtils.isCanada() && this.subscribeEmail) {
            profileData.subscription['subScribeToEmails'] = this.subscribeEmail.getValue();
        }

        if (NGPCookies.isNGPUserRegistrationEnabled()) {
            const { orderId } = this.props;

            if (orderId) {
                profileData.orderId = orderId;
            }
        }

        store.dispatch(
            UserActions.register(
                profileData,
                this.guestCheckoutRegisterSuccess,
                this.guestCheckoutRegisterFailure,
                null,
                this.props.guestEmail ?? this.state.email
            )
        );
    };

    guestCheckoutSignIn = signUpForBI => {
        let biAccountInfo;

        if (signUpForBI) {
            const biFormData = this.biRegForm.getBIDate();
            biAccountInfo = {
                isJoinBi: !!biFormData,
                birthday: biFormData
            };

            biAccountInfo.subscription = { subScribeToSms: this.state.isMarketingEnabled || false };

            if (signUpForBI && localeUtils.isCanada()) {
                biAccountInfo.subscription['subScribeToEmails'] = this.subscribeEmail.getValue();
            }
        }

        store.dispatch(
            UserActions.signIn(
                this.props.guestEmail,
                this.state.password,
                null,
                null,
                () => {
                    Storage.local.setItem(GUEST_SIGN_IN_CONFIRMATION, 1);
                },
                this.guestCheckoutSignInFailure,
                true,
                biAccountInfo
            )
        );
    };

    guestCheckoutRegisterOrSignIn = token => {
        if (this.validateForm()) {
            if (this.props.isExistingUser) {
                this.guestCheckoutSignIn(this.props.isNonBIRegisteredUser);
            } else {
                this.guestCheckoutRegister(token);
            }
        }
    };

    validateCaptcha = () => {
        if (this.reCaptcha && this.validateForm()) {
            this.reCaptcha.execute();
        } else {
            this.guestCheckoutRegisterOrSignIn();
        }
    };

    onCaptchaTokenReady = token => {
        if (token) {
            this.guestCheckoutRegisterOrSignIn(token);
        } else {
            this.reCaptcha.reset();
        }
    };

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

    handleMarketingCheckboxClick = () => {
        this.setState({ isMarketingEnabled: !this.state.isMarketingEnabled });
    };

    setSubscribeEmailRef = c => {
        if (c !== null) {
            this.subscribeEmail = c;
        }
    };

    handleSubmitRegistrationForm = e => {
        e.preventDefault();
        this.validateCaptcha();
    };

    handleEmailInputChange = e => {
        this.updateEditStore(e.target.name, e.target.value);
    };

    handlePasswordInputChange = e => {
        this.updateEditStore(e.target.name, e.target.value);
    };

    setEmailInputRef = c => {
        if (c !== null) {
            this.emailInput = c;
        }
    };

    setPasswordInputRef = c => {
        if (c !== null) {
            this.passwordInput = c;
        }
    };

    validatePassword = password => {
        if (FormValidator.isEmpty(password) || !FormValidator.isValidLength(password, 6, 12) || FormValidator.hasEmptySpaces(password)) {
            return ErrorConstants.ERROR_CODES.PASSWORD;
        }

        return null;
    };

    validateMobilePhoneNumber = mobilePhoneNo => {
        if (this.state.isMarketingEnabled) {
            if (FormValidator.isEmpty(mobilePhoneNo)) {
                return ErrorConstants.ERROR_CODES.MARKETING_PHONE_NUMBER;
            }

            if (mobilePhoneNo?.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
                return ErrorConstants.ERROR_CODES.PHONE_NUMBER_INVALID_REGISTRATION;
            }
        }

        return null;
    };

    setCaptchaRef = c => {
        if (c !== null) {
            this.reCaptcha = c;
        }
    };

    setBiRefFormRef = c => {
        if (c !== null) {
            this.biRegForm = c;
        }
    };

    /* eslint-disable-next-line complexity */
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/GuestCheckoutSection/locales', 'GuestCheckoutSection');
        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();
        const mobilePhone = 'mobilePhone';

        /*
        Note: Remove biFormTestType when UTS-574 is finished A/B testing in Prod
        */
        const {
            isExistingUser, isNonBIRegisteredUser, biPoints, guestEmail, isStoreBIMember, biFormTestType, isModal
        } = this.props;

        const uncheckJoinErrorMsg = getText('uncheckJoinErrorMessage', [biPoints]);

        const isCaptchaEnabled = Sephora.configurationSettings.captchaCheckoutRegistrationEnabled;

        const subscribeEmailComponent = (
            <SubscribeEmail
                fontWeight='normal'
                hasDivider={false}
                disabled={false}
                isGuestCheckout={true}
                ref={this.setSubscribeEmailRef}
            />
        );

        const showBIRegForm = isStoreBIMember ? !!this.state.biData : !!isNonBIRegisteredUser;
        const shouldShowRestOfForm = this.state.showRestOfForm || biFormTestType === 'popupModalWithPasswordFieldAndBI';
        const isCanada = localeUtils.isCanada();

        return (
            <Box
                data-at={Sephora.debug.dataAt('bi_registration_form')}
                {...(!isModal && {
                    paddingX: [4, 6],
                    paddingY: [5, 6],
                    maxWidth: '36em',
                    border: biFormTestType === 'default' && 2,
                    borderRadius: 2,
                    marginTop: this.state.showSignIn && biFormTestType === 'default' && ['9em', 0]
                })}
            >
                {this.state.showSignIn && (
                    <form
                        noValidate
                        onSubmit={this.handleSubmitRegistrationForm}
                    >
                        <Popover
                            width={isDesktop ? 370 : undefined}
                            isBlock={true}
                            placement={isMobile ? 'top' : 'right'}
                            placementStyle={isMobile ? { marginBottom: space[1] } : { marginLeft: space[4] }}
                            content={
                                <>
                                    {getText('popoverContent', [biPoints])}
                                    <Link
                                        display='block'
                                        color='blue'
                                        underline={true}
                                        paddingY={2}
                                        marginBottom={-2}
                                        children={getText('linkActionText')}
                                        onClick={this.openRewardsModal}
                                    />
                                </>
                            }
                            showImmediately={this.state.showPopover}
                            shouldDisplayPopover={this.shouldDisplayPopover}
                        >
                            <>
                                <Text
                                    is='h2'
                                    fontSize='lg'
                                    lineHeight='tight'
                                    fontWeight='bold'
                                    marginBottom='.25em'
                                >
                                    {biFormTestType === 'default' ? getText('dontForgetText', [biPoints]) : getText('testDontLosePoints', [biPoints])}
                                </Text>
                                {biFormTestType !== 'default' && (
                                    <>
                                        <Markdown
                                            marginBottom='.5em'
                                            content={getText('savePointsFreeShip', [biPoints])}
                                        />
                                        <LegacyGrid
                                            gutter={isMobile ? 4 : 7}
                                            fill={true}
                                            fontSize='sm'
                                            marginY='2em'
                                        >
                                            <LegacyGrid.Cell
                                                paddingLeft={!isMobile ? 0 : 3}
                                                paddingRight={!isMobile ? 0 : 3}
                                                textAlign='center'
                                                data-at={Sephora.debug.dataAt('sign_up_free_bday_gift')}
                                            >
                                                <Image
                                                    width={38}
                                                    height={38}
                                                    display='block'
                                                    marginX='auto'
                                                    marginBottom={1}
                                                    src='/img/ufe/icons/birthday.svg'
                                                />
                                                {isMobile ? (
                                                    <Text
                                                        css={
                                                            !localeUtils.isFrench() || {
                                                                maxWidth: !isMobile ? '8em' : '7em',
                                                                display: 'inline-block'
                                                            }
                                                        }
                                                    >
                                                        {getText('free')}
                                                        <br />
                                                        {getText('testNewBiPropBDayGift')}
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        css={
                                                            !localeUtils.isFrench() || {
                                                                maxWidth: '9em',
                                                                display: 'inline-block'
                                                            }
                                                        }
                                                        children={getText('freeGift')}
                                                    />
                                                )}
                                            </LegacyGrid.Cell>
                                            <LegacyGrid.Cell
                                                paddingLeft={!isMobile ? 0 : 3}
                                                paddingRight={!isMobile ? 0 : 3}
                                                textAlign='center'
                                                data-at={Sephora.debug.dataAt('sign_up_earn_points')}
                                            >
                                                <Image
                                                    width={38}
                                                    height={38}
                                                    display='block'
                                                    marginX='auto'
                                                    marginBottom={1}
                                                    src={'/img/ufe/icons/saving.svg'}
                                                />
                                                <Text
                                                    css={
                                                        localeUtils.isFrench() || {
                                                            maxWidth: !isMobile ? '12em' : '7em',
                                                            display: 'inline-block'
                                                        }
                                                    }
                                                    children={getText('testNewBiPropPoints')}
                                                />
                                            </LegacyGrid.Cell>
                                            <LegacyGrid.Cell
                                                paddingLeft={!isMobile ? 0 : 3}
                                                paddingRight={!isMobile ? 0 : 3}
                                                textAlign='center'
                                                data-at={Sephora.debug.dataAt('sign_up_free_shipping')}
                                            >
                                                <Image
                                                    width={38}
                                                    height={38}
                                                    display='block'
                                                    marginX='auto'
                                                    marginBottom={1}
                                                    src='/img/ufe/icons/shipping.svg'
                                                />
                                                <Text
                                                    css={
                                                        localeUtils.isFrench() || {
                                                            maxWidth: !isMobile ? '8em' : '5em',
                                                            display: 'inline-block'
                                                        }
                                                    }
                                                    children={getText('testNewBiPropShipping')}
                                                />
                                            </LegacyGrid.Cell>
                                        </LegacyGrid>
                                    </>
                                )}
                                {isExistingUser ? (
                                    <Text
                                        is='p'
                                        marginBottom='1em'
                                    >
                                        <b>{getText('enterPasswordToSaveText')}</b>{' '}
                                        {getText('enterPasswordToSaveDetailsText', [guestEmail, biPoints])}
                                    </Text>
                                ) : (
                                    <Text
                                        is='p'
                                        fontWeight='bold'
                                        marginBottom='1em'
                                    >
                                        {biFormTestType === 'default'
                                            ? getText('enterPasswordToCreateText')
                                            : guestEmail
                                                ? getText('testEnterPasswordToCreateText', [guestEmail])
                                                : getText('enterPasswordToCreateFromGuestEmailText')}
                                    </Text>
                                )}
                                <ErrorList
                                    errorMessages={this.state.errorMessages}
                                    data-at={Sephora.debug.dataAt('sign_in_error')}
                                />
                                {!isExistingUser && !guestEmail && (
                                    <Box position='relative'>
                                        <InputEmail
                                            type={'email'}
                                            marginBottom={'1em'}
                                            label={getText('enterEmailToCreateText')}
                                            name='email'
                                            value={this.state.email}
                                            onChange={this.handleEmailInputChange}
                                            ref={this.setEmailInputRef}
                                        />
                                    </Box>
                                )}
                                <Box position='relative'>
                                    <PasswordRevealInput
                                        id='new-password'
                                        hideAsterisk={true}
                                        label={getText('passwordInputLabel', [FIELD_LENGTHS.passwordMin, FIELD_LENGTHS.passwordMax])}
                                        type={'password'}
                                        autoComplete='new-password'
                                        autoCorrect='off'
                                        autoCapitalize='off'
                                        spellCheck={false}
                                        name='password'
                                        required={true}
                                        minLength={FIELD_LENGTHS.passwordMin}
                                        maxLength={FIELD_LENGTHS.passwordMax}
                                        value={this.state.password}
                                        onChange={this.handlePasswordInputChange}
                                        onFocus={this.toggleCompleteForm}
                                        ref={this.setPasswordInputRef}
                                        validateError={this.validatePassword}
                                    />
                                    {isExistingUser && (
                                        <Link
                                            onClick={this.forgotPassword}
                                            paddingX={3}
                                            height={forms.HEIGHT}
                                            fontSize='sm'
                                            css={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0
                                            }}
                                        >
                                            {getText('forgotText')}
                                        </Link>
                                    )}
                                </Box>
                                {!isExistingUser && (
                                    <Box>
                                        <TextInput
                                            name={mobilePhone}
                                            label={getText('phoneNumber')}
                                            infoText={getText('useYourPhoneLabel')}
                                            autoComplete='tel'
                                            autoCorrect='off'
                                            type='tel'
                                            maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                                            required={false}
                                            value={this.state.mobilePhone}
                                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                            onChange={this.formatPhoneNumber}
                                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                            ref={comp => (this[mobilePhone] = comp)}
                                            validateError={this.validateMobilePhoneNumber}
                                            infoDismissButton={true}
                                        />
                                    </Box>
                                )}
                                {!isExistingUser && (
                                    <Flex alignItems='center'>
                                        <Checkbox
                                            marginRight={2}
                                            paddingY={isCanada ? '' : 2}
                                            marginBottom={isCanada ? '' : '1em'}
                                            name='isMarketingEnabled'
                                            checked={this.state.isMarketingEnabled}
                                            onClick={this.handleMarketingCheckboxClick}
                                        >
                                            <Text>{getText('marketingCheckbox')}</Text>
                                        </Checkbox>
                                    </Flex>
                                )}
                            </>
                        </Popover>
                        {shouldShowRestOfForm && (
                            <>
                                {!isExistingUser && isCaptchaEnabled && (
                                    <ReCaptcha
                                        ref={this.setCaptchaRef}
                                        onChange={this.onCaptchaTokenReady}
                                    />
                                )}
                                {(showBIRegForm || biFormTestType === 'popupModalWithPasswordFieldAndBI') && (
                                    <>
                                        {biFormTestType === 'default' && <Divider marginY={4} />}
                                        <BiRegisterForm
                                            biData={this.state.biData}
                                            isGuestCheckout={true}
                                            isJoinBIChecked={true}
                                            isStoreUser={isStoreBIMember}
                                            uncheckJoinErrorMsg={uncheckJoinErrorMsg}
                                            subscribeEmail={subscribeEmailComponent}
                                            biFormTestType={biFormTestType}
                                            ref={this.setBiRefFormRef}
                                        />
                                    </>
                                )}
                                {biFormTestType !== 'default' && (
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
                                            {getText('clicking')}
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
                                                <></>
                                            ) : (
                                                <>
                                                    {getText('and')}
                                                    <Link
                                                        color='blue'
                                                        underline={true}
                                                        target='_blank'
                                                        fontWeight='bold'
                                                        href={legalConstants.USNoticeIncentiveLink}
                                                        children={getText('noticeFinancialIncentive')}
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
                                            {getText('byClicking')}{' '}
                                            <Link
                                                color='blue'
                                                underline={true}
                                                href={legalConstants.PRIVACY_POLICY_LINK}
                                                children={getText('testLegalPrivacyPolicyLink')}
                                            />
                                            {localeUtils.isFrench() ? ' ' : ''}
                                            {getText('testLegalAnd')}
                                            <Link
                                                color='blue'
                                                underline={true}
                                                target='_blank'
                                                href={legalConstants.USNoticeIncentiveLink}
                                                children={getText('testLegalNoticeOfFinancialIncentiveLink')}
                                                {...{ display: 'inline' }}
                                            />
                                            , (2)
                                            {getText('agreeTo')}
                                            <Link
                                                color='blue'
                                                underline={true}
                                                fontWeight='bold'
                                                href={legalConstants.TERMS_OF_USE_LINK}
                                                children={getText('testLegalTermsOfUseLink')}
                                            />
                                            {localeUtils.isFrench() ? ',' + getText('and') : ', '}
                                            <Link
                                                color='blue'
                                                underline={true}
                                                fontWeight='bold'
                                                href={legalConstants.BEAUTY_INSIDER_TERMS_LINK}
                                                children={getText('testLegalBiTermsLink')}
                                            />
                                            {isCanada ? '.' : getText('testLegalAutomaticallyText')}
                                        </Text>
                                    </Box>
                                )}
                                <Box marginTop={4}>
                                    <Button
                                        variant='primary'
                                        block={isMobile}
                                        type='submit'
                                        hasMinWidth={true}
                                        width='100%'
                                    >
                                        {biFormTestType === 'default'
                                            ? getText(isExistingUser ? 'savePointsButton' : 'createAccountButton')
                                            : getText('testJoinNowButton')}
                                    </Button>
                                </Box>
                                <Divider
                                    marginTop={4}
                                    marginBottom={4}
                                />
                                <ReCaptchaText marginTop={4} />
                            </>
                        )}
                    </form>
                )}

                {this.state.showSignInConfirmation && (
                    <>
                        <Text
                            is='h2'
                            fontSize='xl'
                            lineHeight='tight'
                            fontFamily='serif'
                            marginBottom='.5em'
                        >
                            {getText('thankYouText')}
                        </Text>
                        {!this.props.isBooking && (
                            <>
                                <Text
                                    is='p'
                                    marginBottom={5}
                                >
                                    {getText('browseBazaarText')}
                                </Text>
                                <Button
                                    variant='primary'
                                    block={isMobile}
                                    href='/rewards'
                                    hasMinWidth={true}
                                >
                                    {getText('viewBazaarText')}
                                </Button>
                            </>
                        )}
                    </>
                )}
            </Box>
        );
    }
}

export default wrapComponent(GuestCheckoutSection, 'GuestCheckoutSection', true);
