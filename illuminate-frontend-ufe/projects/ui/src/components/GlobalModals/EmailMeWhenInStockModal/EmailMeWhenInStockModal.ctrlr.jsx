import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'store/Store';
import Actions from 'actions/Actions';
import ProductActions from 'actions/ProductActions';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import snbApi from 'services/api/search-n-browse';
import utilityApi from 'services/api/utility';
import Debounce from 'utils/Debounce';
import userUtils from 'utils/User';
import decorators from 'utils/decorators';
import skuUtils from 'utils/Sku';

import {
    Box, Flex, Grid, Button, Text, Link
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import ErrorList from 'components/ErrorList';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import Radio from 'components/Inputs/Radio/Radio';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Markdown from 'components/Markdown/Markdown';
import userActions from 'actions/UserActions';
import localeUtils from 'utils/LanguageLocale';
import { buttons } from 'style/config';
import { HEADER_VALUE } from 'constants/authentication';

const MAX_VISIBLE_PHONE_DIGITS = 3;
const NOTIFICATION_TYPES = {
    EMAIL: 'email',
    MOBILE: 'mobile'
};

const { getLocaleResourceFile } = localeUtils;

const getText = (text, vars) =>
    getLocaleResourceFile('components/GlobalModals/EmailMeWhenInStockModal/locales', 'EmailMeWhenInStockModal')(text, vars);

class EmailMeWhenInStockModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            subscribedEmail: '',
            showSignupBlock: true,
            showRemovalMessage: false,
            emailRadioChecked: true,
            smsRadioChecked: false,
            formattedPhone: '',
            mobile: null,
            displayEmail: true,
            unsubscribedEmail: null,
            termsAccepted: false,
            textAlerts: false,
            subscribedByPhone: false,
            subscriptionSuccessful: false,
            maskedPhone: '',
            successMsg: null,
            errorMsg: null,
            showError: false,
            errorMessages: [],
            errorMessagesSms: [],
            displayErrorSms: false,
            savedPhone: '',
            submitting: false
        };

        this.emailInput = React.createRef();
        this.mobileInput = React.createRef();
    }

    requestClose = () => {
        store.dispatch(
            Actions.showEmailMeWhenInStockModal({
                isOpen: false
            })
        );

        if (this.props.isQuickLook) {
            this.dispatchQuicklook();
        }
    };

    dispatchQuicklook = () => {
        const isRewardQuickLook = false;

        if (!userUtils.isAnonymous()) {
            snbApi
                .getProductDetails(window.data.productId, window.data.skuId, {
                    addCurrentSkuToProductChildSkus: true
                })
                .then(data => {
                    store.dispatch(Actions.updateQuickLookContent(data));
                    store.dispatch(
                        Actions.showQuickLookModal({
                            isOpen: true,
                            skuType: isRewardQuickLook
                        })
                    );
                });
        } else {
            store.dispatch(
                Actions.showQuickLookModal({
                    isOpen: true,
                    skuType: isRewardQuickLook
                })
            );
        }
    };

    emailMeHandler = event => {
        event.preventDefault();

        const { currentSku, isComingSoon, updateEmailButtonCTA, product } = this.props;
        const subscribedEmail = this.emailInput.current.getValue();

        const requestEmailNotification = utilityApi.requestEmailNotificationForSubscriptionType;

        const subscriptionType = isComingSoon ? 'comingSoon' : 'outOfStock';

        if (!this.emailInput.current.validateError()) {
            decorators
                .withInterstice(requestEmailNotification)(subscribedEmail, currentSku.skuId, subscriptionType)
                .then(() => {
                    store.dispatch(userActions.addSubscribedEmail(subscribedEmail));

                    if (updateEmailButtonCTA) {
                        updateEmailButtonCTA();
                    }

                    this.setState({
                        inputsDisabled: false,
                        errorMessages: [],
                        message: null,
                        showSignupBlock: false,
                        subscribedEmail
                    });

                    //Analytics
                    const containerName = currentSku.rootContainerName;
                    const pPageOos = 'top-right-out-of-stock-button';
                    const recentEvent = anaUtils.getLastAsyncPageLoadData({
                        pageType: this.props.analyticsContext
                    });

                    this.completeNotificationSOTTracking({
                        notificationType: NOTIFICATION_TYPES.EMAIL,
                        isComingSoon,
                        unsubscribe: false
                    });

                    const productId = product?.productDetails?.productId || product?.productId;

                    processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                        data: {
                            eventStrings: ['event71'],
                            sku: currentSku,
                            linkName: 'Email Me When Available: Success',
                            internalCampaign: [containerName || pPageOos, productId, 'email-me-when-available-success'],
                            actionInfo: 'Email Me When Available: Success',
                            pageName: recentEvent.pageName,
                            previousPage: recentEvent.previousPage
                        }
                    });
                    this.setState({
                        displayEmail: false,
                        showSignupBlock: false,
                        subscribedEmail: subscribedEmail
                    });
                })
                .catch(reason => this.subscriptionFailure(reason))
                .then(() => store.dispatch(ProductActions.updateProductWithUserSpecificData()));
        }
    };

    handleEmailMeWhenInStock = Debounce.preventDoubleClick(this.emailMeHandler);

    emailSubscriptionHandler = event => {
        event.preventDefault();
        const { isComingSoon } = this.props;
        const subscribedEmail = this.emailInput.current.getValue();
        const subscriptionType = isComingSoon ? 'comingSoon' : 'outOfStock';

        if (!this.emailInput.current.validateError()) {
            decorators
                .withInterstice(utilityApi.cancelEmailNotificationRequest)(subscribedEmail, this.props.currentSku.skuId, subscriptionType)
                .then(() => {
                    if (this.props.updateEmailButtonCTA) {
                        this.props.updateEmailButtonCTA();
                    }

                    this.setState({
                        inputsDisabled: false,
                        errorMessages: [],
                        message: null,
                        showSignupBlock: false,
                        showRemovalMessage: true
                    });

                    this.completeNotificationSOTTracking({
                        notificationType: NOTIFICATION_TYPES.EMAIL,
                        isComingSoon: isComingSoon,
                        unsubscribe: true
                    });
                })
                .catch(reason => this.subscriptionFailure(reason))
                .then(() => store.dispatch(ProductActions.updateProductWithUserSpecificData()));
        }

        store.dispatch(userActions.addSubscribedEmail(subscribedEmail));
        this.setState({
            displayEmail: false,
            unsubscribedEmail: subscribedEmail
        });
    };

    handleRemoveEmailSubscription = Debounce.preventDoubleClick(this.emailSubscriptionHandler);

    subscriptionFailure = reason => {
        const stateObj = {
            inputsDisabled: false
        };

        if (reason.errorMessages) {
            stateObj.errorMessages = reason.errorMessages;
        }

        this.setState(stateObj);

        if (userUtils.isPhoneRejectedError(reason) && this.mobileInput.current) {
            this.mobileInput.current.showError(getText('phoneNumberRejected'));
        }
    };

    formatPhoneNumber = e => {
        const inputValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
        this.setState({
            formattedPhone: formattedPhone,
            mobile: inputValue
        });
    };

    formatSavedNumber = () => {
        const savedPhone = this.props.currentSku.actionFlags?.backInStockPhoneReminderNumber;

        if (userUtils.isBI() && savedPhone) {
            const inputValue = savedPhone.replace(HelperUtils.specialCharacterRegex, '');
            const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
            this.setState({
                savedPhone: formattedPhone
            });
        }
    };

    formatPrePopulatedPhone = phone => {
        const inputValue = phone.replace(HelperUtils.specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
        this.setState({
            formattedPhone: formattedPhone,
            mobile: inputValue
        });
    };

    getHiddenPhoneNumber = () => {
        const { mobile } = this.state;

        if (!mobile || mobile.length < MAX_VISIBLE_PHONE_DIGITS) {
            return '••• ••• ••••';
        }

        return `••• ••• •${mobile.substr(mobile.length - MAX_VISIBLE_PHONE_DIGITS)}`;
    };

    isValidPhoneOnly = () => {
        const fieldsForValidation = [this.mobileInput.current];
        const errors = FormValidator.getErrors(fieldsForValidation);

        return !errors.fields.length;
    };

    subscribeBySms = event => {
        event.preventDefault();
        event.stopPropagation();

        // Prevent multiple submissions
        if (this.state.submitting) {
            return;
        }

        const { currentSku, updateEmailButtonCTA, isComingSoon } = this.props;
        const { mobile, termsAccepted, textAlerts } = this.state;
        const isValidPhoneNumber = this.isValidPhoneOnly();

        this.completeNotificationSOTTracking({
            notificationType: NOTIFICATION_TYPES.MOBILE,
            isComingSoon,
            unsubscribe: false
        });

        if (!termsAccepted) {
            this.setState({ displayErrorSms: true, errorMessagesSms: [getText('errorMessagesSms')] });
        }

        if (termsAccepted && isValidPhoneNumber) {
            this.setState({ submitting: true }); // Set submitting to true
            const subscriptionType = isComingSoon ? 'comingSoon' : 'outOfStock';
            const maskedPhoneNumber = this.getHiddenPhoneNumber();
            const successCallback = () => {
                this.setState({
                    displayEmail: false,
                    subscriptionSuccessful: true,
                    maskedPhone: maskedPhoneNumber,
                    submitting: false // Reset submitting
                });
                updateEmailButtonCTA();
            };

            const failureCallback = error => {
                // Reset submitting on failure
                this.setState({ submitting: false });

                if (textAlerts && userUtils.isPhoneRejectedError(error)) {
                    this.mobileInput.current.showError(getText('phoneNumberRejected'));
                } else {
                    this.setState({ displayErrorSms: true, errorMessagesSms: [getText('errorMsg')] });
                }
            };

            const smsOptinSuccessCallback = () => {
                store.dispatch(
                    userActions.submitBackInStockSMSOptInForm(mobile, currentSku.skuId, subscriptionType, successCallback, failureCallback)
                );
            };

            if (textAlerts) {
                store.dispatch(userActions.submitBackInStockMarketingAlerts(mobile, smsOptinSuccessCallback, failureCallback));
            } else {
                store.dispatch(
                    userActions.submitBackInStockSMSOptInForm(mobile, currentSku.skuId, subscriptionType, successCallback, failureCallback)
                );
            }
        }
    };

    validatePhone = mobile => {
        const noValidPhoneMsg = getText('noValidPhoneMsg');

        if (FormValidator.isEmpty(mobile)) {
            return noValidPhoneMsg;
        }

        if (mobile.length && !FormValidator.isValidPhoneNumber(mobile)) {
            return noValidPhoneMsg;
        }

        return null;
    };

    validateEmail = email => {
        const noValidPhoneMsg = getText('enterValidEmail');

        if (FormValidator.isEmpty(email)) {
            return noValidPhoneMsg;
        }

        if (!FormValidator.isValidEmailAddress(email)) {
            return noValidPhoneMsg;
        }

        return null;
    };

    termsChecked = e => {
        this.setState({ termsAccepted: e.target.checked, displayErrorSms: false });
    };

    acceptTextAlerts = e => {
        this.setState({ textAlerts: e.target.checked, displayErrorSms: false });
    };

    selectRadioEmail = () => {
        this.setState({ smsRadioChecked: false, emailRadioChecked: true });
    };

    selectRadioSms = () => {
        this.setState({ smsRadioChecked: true, emailRadioChecked: false });
    };

    displayRegisterModal = () => {
        store.dispatch(Actions.showRegisterModal({ isOpen: true }));
    };

    displayLoginModal = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    };

    isAlreadySubscribedSms = () => {
        if (this.props.currentSku.actionFlags.backInStockPhoneReminderNumber) {
            this.setState({
                subscribedByPhone: true
            });
        } else {
            this.setState({
                subscribedByPhone: false
            });
        }

        return null;
    };

    prePopulatePhoneNumber = () => {
        const savedPhoneBI = store.getState().user.beautyInsiderAccount?.homePhone;

        if (savedPhoneBI !== undefined) {
            this.formatPrePopulatedPhone(savedPhoneBI);
        }
    };

    componentDidMount() {
        const user = store.getState().user;
        this.formatSavedNumber();
        this.isAlreadySubscribedSms();
        this.prePopulatePhoneNumber();

        if (!userUtils.isAnonymous()) {
            this.setState({
                inputsDisabled: true,
                presetEmail: user.login
            });
        } else if (this.props.alreadySubscribed && user.subscribedAnonEmail) {
            this.setState({
                inputsDisabled: true,
                presetEmail: user.subscribedAnonEmail
            });
        }
    }

    completeNotificationSOTTracking = ({ notificationType, isComingSoon, unsubscribe }) => {
        const {
            product,
            currentSku: { listPrice: price },
            currentSku: sku
        } = this.props;

        const productId = product?.productDetails?.productId || product?.productId;
        const productName = product?.productDetails?.displayName || sku?.productName || '';
        const brandName = product?.productDetails?.brand?.displayName || sku?.brandName || '';

        const { parentCategory: productCategory, variationType, variationTypeDisplayName: variationValue } = product;

        const {
            EVENT_NAMES: {
                PRODUCT_PAGE: { OUT_OF_STOCK, COMING_SOON, UNSUBSCRIBE }
            }
        } = analyticsConsts;

        let eventLabel = isComingSoon ? COMING_SOON : OUT_OF_STOCK;
        let email = this.state.subscribedEmail;

        if (unsubscribe) {
            eventLabel = `${UNSUBSCRIBE} ${eventLabel}`;
            // If the user is usnsubscribing, this.state.subscribedEmail is ""
            email = this.state.unsubscribedEmail;
        }

        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: eventLabel,
                linkName: eventLabel,
                quantity: 1,
                brandName,
                price,
                productCategory,
                productName,
                sku,
                productId,
                notificationType,
                emailId: notificationType === NOTIFICATION_TYPES.EMAIL ? email : null,
                mobileNumber: notificationType === NOTIFICATION_TYPES.MOBILE ? this.state.formattedPhone : null,
                variationType,
                variationValue
            }
        });
    };

    // eslint-disable-next-line complexity
    render() {
        const { isOpen, product, currentSku, alreadySubscribed } = this.props;

        let subscribeMailText;
        let subscribeMailButtonText;
        let subscribeMailCTA;

        if (alreadySubscribed) {
            subscribeMailText = getText('asMText');
            subscribeMailButtonText = getText('asMBText');
            subscribeMailCTA = this.handleRemoveEmailSubscription;
        } else {
            subscribeMailText = getText('nsMText');
            subscribeMailButtonText = getText('nsMBText');
            subscribeMailCTA = this.handleEmailMeWhenInStock;
        }

        const productDetails = product.productDetails;
        let brandName;
        let displayName;

        if (productDetails) {
            brandName = productDetails.brand ? productDetails.brand.displayName : productDetails.brandName;
            displayName = productDetails.displayName;
        } else {
            brandName = product.brandName;
            displayName = product.displayName;
        }

        const messages = {
            empty: getText('empty'),
            invalid: getText('invalid'),
            subscribe: getText('subscribe'),
            remove: getText('remove')
        };

        const displayRadioSms = this.state.showSignupBlock && this.state.displayEmail;
        const displayEmailSubscription = this.state.showSignupBlock && this.state.displayEmail;
        const SmsUserRecognized = userUtils.isBI() && this.state.smsRadioChecked;
        const SmsUserNotRecognized = !userUtils.isBI();
        const displayLoginMsg = SmsUserNotRecognized && displayRadioSms;

        const NotifyBySmsFooter = this.state.smsRadioChecked && this.state.displayEmail;
        const NotifyByEmailFooter = this.state.emailRadioChecked && this.state.displayEmail;
        const GotItBySmsFooter = this.state.smsRadioChecked && !this.state.displayEmail;
        const GotItByEmailFooter = !this.state.showSignupBlock && !this.state.displayEmail;
        const NotifyMeBySmsFooter = NotifyBySmsFooter && SmsUserRecognized && !this.state.subscribedByPhone;
        const LoginRegisterFooter = NotifyBySmsFooter && SmsUserNotRecognized && !this.state.subscribedByPhone;
        const UserAlreadySubscribed = alreadySubscribed;
        const CanadaEnglish = localeUtils.isCanada() && !localeUtils.isFrench();
        const CanadaFrench = localeUtils.isCanada() && localeUtils.isFrench();
        const isUsLanguage = localeUtils.isUS();

        return (
            <Modal
                width={1}
                hasBodyScroll={true}
                isOpen={isOpen}
                onDismiss={this.requestClose}
                dataAt='EmailMeWhenOutOfStockPopup'
            >
                <Modal.Header>
                    <Modal.Title>{getText('emailSmsNotifications')}</Modal.Title>
                </Modal.Header>
                <Modal.Body height={490}>
                    <Grid
                        columns='auto 1fr'
                        gap={4}
                        lineHeight='tight'
                    >
                        <ProductImage
                            id={currentSku.skuId}
                            size={75}
                            skuImages={currentSku.skuImages}
                            altText={supplementAltTextWithProduct(currentSku, product)}
                        />
                        <div>
                            {brandName && (
                                <Box
                                    fontWeight='bold'
                                    data-at={Sephora.debug.dataAt('product_brand')}
                                    dangerouslySetInnerHTML={{
                                        __html: brandName
                                    }}
                                />
                            )}
                            <Box
                                data-at={Sephora.debug.dataAt('product_name')}
                                dangerouslySetInnerHTML={{
                                    __html: displayName
                                }}
                            />
                            <SizeAndItemNumber
                                sku={currentSku}
                                fontSize='sm'
                                marginTop={1}
                            />
                            <ProductVariation
                                fontSize='sm'
                                marginTop={1}
                                {...skuUtils.getProductVariations({
                                    product,
                                    sku: currentSku
                                })}
                            />
                        </div>
                    </Grid>

                    {this.state.displayEmail && (
                        <Radio
                            name='notificationType'
                            marginTop={2}
                            paddingY={2}
                            onChange={this.selectRadioEmail}
                            checked={this.state.emailRadioChecked}
                            fontWeight='bold'
                            children={getText('emailMe')}
                        />
                    )}

                    {this.state.emailRadioChecked && this.state.showSignupBlock && (
                        <Box
                            is='form'
                            noValidate
                            onSubmit={subscribeMailCTA}
                            marginLeft={6}
                        >
                            <Text
                                is='p'
                                marginBottom={2}
                                lineHeight='tight'
                                children={getText(UserAlreadySubscribed ? 'emailNoLonger' : 'emailLabel')}
                            />
                            <InputEmail
                                label={getText('emailAddress')}
                                marginBottom={null}
                                login={this.state.presetEmail}
                                disabled={this.state.inputsDisabled}
                                ref={this.emailInput}
                                validate={this.validateEmail}
                            />
                            {this.state.errorMessages ? (
                                <ErrorList
                                    marginTop={2}
                                    errorMessages={this.state.errorMessages}
                                />
                            ) : (
                                <Text
                                    is='p'
                                    marginTop={1}
                                    dangerouslySetInnerHTML={{
                                        __html: subscribeMailText
                                    }}
                                />
                            )}
                            {!SmsUserNotRecognized && (
                                <Text
                                    is='p'
                                    children={getText('emailTied')}
                                    marginTop={1}
                                    fontSize='sm'
                                    color='gray'
                                />
                            )}
                        </Box>
                    )}

                    {displayRadioSms && (
                        <Radio
                            name='notificationType'
                            marginTop={2}
                            paddingY={2}
                            onChange={this.selectRadioSms}
                            checked={this.state.smsRadioChecked}
                        >
                            <b>{getText('smsMe')}</b> {getText('BIOnly')}
                        </Radio>
                    )}

                    {displayLoginMsg && (
                        <Text
                            is='p'
                            marginLeft={6}
                        >
                            {getText('needTo')}
                            <Link
                                onClick={this.displayLoginModal}
                                color='blue'
                                padding={2}
                                margin={-2}
                                underline={true}
                            >
                                {getText('signInLink')}
                            </Link>
                            {getText('or')}
                            <Link
                                onClick={this.displayRegisterModal}
                                color='blue'
                                padding={2}
                                margin={-2}
                                underline={true}
                            >
                                {getText('createAccountLink')}
                            </Link>
                            {getText('toSet')}
                        </Text>
                    )}

                    {SmsUserRecognized && displayEmailSubscription && (
                        <Box
                            is='form'
                            noValidate
                            onSubmit={subscribeMailCTA}
                            marginLeft={6}
                        >
                            {!this.state.subscribedByPhone ? (
                                <Flex
                                    flexDirection='column'
                                    gap={4}
                                >
                                    <TextInput
                                        type='tel'
                                        label={getText('mobileLabel')}
                                        required={true}
                                        name='mobile'
                                        ref={this.mobileInput}
                                        marginBottom={null}
                                        value={this.state.formattedPhone}
                                        onChange={this.formatPhoneNumber}
                                        validate={this.validatePhone}
                                    />
                                    {this.state.displayErrorSms && <ErrorList errorMessages={this.state.errorMessagesSms} />}
                                    <Checkbox
                                        checked={this.state.termsAccepted}
                                        onChange={this.termsChecked}
                                        paddingY={null}
                                        fontWeight='bold'
                                        children={getText('checkboxAgree')}
                                    />
                                    <Checkbox
                                        checked={this.state.textAlerts}
                                        onChange={this.acceptTextAlerts}
                                        paddingY={null}
                                        fontWeight='bold'
                                        children={getText('textAlerts')}
                                    />
                                    <Box
                                        fontSize='sm'
                                        lineHeight='tight'
                                    >
                                        {isUsLanguage && (
                                            <Markdown
                                                content={getText('termsAndConditionsUS', [
                                                    '/beauty/sms-terms-and-conditions',
                                                    '/beauty/privacy-policy'
                                                ])}
                                            />
                                        )}
                                        {CanadaEnglish && (
                                            <Markdown
                                                content={getText('termsAndConditionsCA', [
                                                    '/beauty/sms-terms-and-conditions',
                                                    '/beauty/privacy-policy'
                                                ])}
                                            />
                                        )}
                                        {CanadaFrench && (
                                            <Markdown
                                                content={getText('termsAndConditionsCA', [
                                                    '/beauty/sms-terms-and-conditions',
                                                    '/beauty/privacy-policy'
                                                ])}
                                            />
                                        )}
                                    </Box>
                                </Flex>
                            ) : (
                                <>
                                    <Box
                                        marginBottom={4}
                                        fontSize='sm'
                                        lineHeight='tight'
                                    >
                                        {isUsLanguage && <Markdown content={getText('unsubscribeTitle', ['96929'])} />}
                                        {CanadaEnglish && <Markdown content={getText('unsubscribeTitle', ['96929'])} />}
                                        {CanadaFrench && <Markdown content={getText('unsubscribeTitle', ['79014'])} />}
                                    </Box>
                                    <TextInput
                                        type='tel'
                                        label={getText('mobileLabel')}
                                        required={true}
                                        name='mobile'
                                        disabled={true}
                                        value={this.state.savedPhone}
                                    />
                                    <Box
                                        marginTop={4}
                                        fontSize='sm'
                                        lineHeight='tight'
                                    >
                                        {isUsLanguage && <Markdown content={getText('unsubscribeBody', ['36681'])} />}
                                        {CanadaEnglish && <Markdown content={getText('unsubscribeBody', ['36681'])} />}
                                        {CanadaFrench && <Markdown content={getText('unsubscribeBody', ['79014'])} />}
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}

                    {this.state.subscribedEmail && (
                        <Text
                            is='p'
                            role='alert'
                            marginTop={4}
                        >
                            {messages.subscribe}
                            {this.state.subscribedEmail}
                        </Text>
                    )}
                    {this.state.showRemovalMessage && (
                        <Text
                            is='p'
                            role='alert'
                            marginTop={4}
                        >
                            {messages.remove} {this.state.unsubscribedEmail}
                        </Text>
                    )}
                    {this.state.subscriptionSuccessful && (
                        <Text
                            is='p'
                            role='alert'
                            marginTop={4}
                        >
                            {getText('subscribedByPhone', [this.state.maskedPhone])}
                        </Text>
                    )}
                </Modal.Body>

                <Modal.Footer
                    // prevent layout shift after radio selection results in no footer content
                    css={{ '&:empty': { visibility: 'hidden', boxSizing: 'content-box', height: buttons.HEIGHT } }}
                >
                    {NotifyByEmailFooter && (
                        <Button
                            block={true}
                            variant='primary'
                            onClick={subscribeMailCTA}
                            children={subscribeMailButtonText}
                        />
                    )}

                    {LoginRegisterFooter && (
                        <>
                            <Button
                                block={true}
                                variant='primary'
                                onClick={this.displayLoginModal}
                                children={getText('signInCapitalize')}
                            />
                            <Text
                                is='p'
                                textAlign='center'
                                marginTop={4}
                            >
                                <Link
                                    onClick={this.displayRegisterModal}
                                    color='blue'
                                    padding={2}
                                    margin={-2}
                                    children={getText('createAccountCapitalize')}
                                />
                            </Text>
                        </>
                    )}

                    {NotifyMeBySmsFooter && (
                        <Button
                            block={true}
                            variant='primary'
                            onClick={this.subscribeBySms}
                            disabled={this.state.submitting}
                            children={getText('completeButton')}
                        />
                    )}

                    {(GotItBySmsFooter || GotItByEmailFooter) && (
                        <Button
                            block={true}
                            variant='primary'
                            onClick={this.requestClose}
                            children={getText('gotIt')}
                        />
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(EmailMeWhenInStockModal, 'EmailMeWhenInStockModal', true);
