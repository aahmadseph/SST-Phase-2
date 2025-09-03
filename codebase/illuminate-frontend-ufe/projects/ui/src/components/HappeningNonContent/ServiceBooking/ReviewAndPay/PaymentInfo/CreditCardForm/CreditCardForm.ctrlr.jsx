/* eslint-disable class-methods-use-this, complexity */
import React, { Fragment } from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import {
    Box, Text, Flex, Grid, Button
} from 'components/ui';
import AddressForm from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCardForm/AddressForm/AddressForm';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Radio from 'components/Inputs/Radio/Radio';
import AddCardHeader from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/AddCardHeader';
import CVCInfoModal from 'components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';

import formsUtils from 'utils/Forms';
import errorConstants from 'utils/ErrorConstants';
import formValidator from 'utils/FormValidator';
import creditCardUtils from 'utils/CreditCard';
import orderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import errorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import debounceUtils from 'utils/Debounce';
import deepExtend from 'utils/deepExtend';

import editDataActions from 'actions/EditDataActions';
import orderActions from 'actions/OrderActions';

import { PAYMENT_CARDS_DETECTED } from 'constants/actionTypes/order';

import sdnApi from 'services/api/sdn';
import profileApi from 'services/api/profile';
import store from 'store/Store';
import { forms, space } from 'style/config';

const { preventDoubleClick } = debounceUtils;
const { dispatch, getState, setAndWatch, watchAction } = store;
const { addCreditCardToProfile, updateCreditCardOnProfile } = profileApi;

const { addPaymentCreditCard } = sdnApi;

const INTERSTICE_DELAY_MS = 1000;
const PAYMENT_LOGO_WIDTH = 38;
const PAYMENT_LOGO_OFFSET = space[3];
const GRID_COLUMS = 2;

class CreditCardForm extends BaseClass {
    constructor(props) {
        super(props);

        const creditCardIsDefaultPayment = !props.defaultPayment || props.defaultPayment === 'creditCard';

        this.state = {
            cardType: props.cardType,
            isUseShippingAddressAsBilling: props.isUseShippingAddressAsBilling,
            isSaveCreditCardForFutureUse: !props.isGuestMode,
            isMarkAsDefault: creditCardIsDefaultPayment && (props.isDefault || props.isFirstCreditCard) && !props.isGuestMode,
            creditCard: props.creditCard
        };

        this.getText = localeUtils.getLocaleResourceFile(
            'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCardForm/locales',
            'CreditCardForm'
        );
    }

    openCVCModal = () => dispatch(orderActions.showCVCInfoModal(true));

    updateEditStore = (name, value, isExtraData) => {
        const editStore = getState().editData[this.props.editStore] || { creditCard: {} };

        const creditCardInfo = !isExtraData
            ? deepExtend({}, editStore, { creditCard: deepExtend({}, editStore.creditCard, { [name]: value }) })
            : deepExtend({}, editStore, { [name]: value });

        dispatch(editDataActions.updateEditData(creditCardInfo, this.props.editStore));
    };

    checkCreditCard = e => {
        const cardNumber = e.target.value.replace(/\s/g, '');

        this.setState({
            creditCard: {
                ...this.state.creditCard,
                cardNumber
            }
        });

        dispatch(orderActions.paymentCardNumberChanged(cardNumber));
        this.updateEditStore('cardNumber', cardNumber);
    };

    handleExpMonthOnBlur = () => {
        let expMonth = (this.cardMonthInput && this.cardMonthInput.getValue()) || '';

        if (expMonth.length === 1) {
            expMonth = creditCardUtils.formatExpMonth(expMonth);
            this.updateEditStore('expirationMonth', expMonth);
        }
    };

    handleUseShippingAddress = () => {
        const useShippingAddress = !this.state.isUseShippingAddressAsBilling;
        this.updateEditStore('isUseShippingAddressAsBilling', useShippingAddress, true);
    };

    addOrUpdateCreditCard = () => {
        const { isEditMode, succesCallback, shippingAddress } = this.props;
        const {
            creditCard, cardType, isMarkAsDefault, isUseShippingAddressAsBilling, isSaveCreditCardForFutureUse
        } = this.state;

        const creditCardInfo = {
            isMarkAsDefault,
            creditCard: {
                firstName: creditCard.firstName,
                lastName: creditCard.lastName
            }
        };

        if (isUseShippingAddressAsBilling) {
            const newBillingAddress = { ...shippingAddress };
            delete newBillingAddress.addressId;
            delete newBillingAddress.isDefault;
            delete newBillingAddress.isAddressVerified;
            delete newBillingAddress.email;
            delete newBillingAddress.typeCode;

            creditCardInfo.creditCard.address = newBillingAddress;
        } else {
            const newAddressData = this.addressForm.getData().address;
            delete newAddressData.addressId;

            creditCardInfo.creditCard.address = newAddressData;
        }

        if (isEditMode) {
            creditCardInfo.creditCard.creditCardId = creditCard.creditCardId;
        } else {
            creditCardInfo.creditCard.cardType = cardType;
            creditCardInfo.creditCard.cardNumber = creditCard.cardNumber;
            creditCardInfo.isSaveCreditCardForFutureUse = isSaveCreditCardForFutureUse;
        }

        if (creditCardInfo.creditCard.address) {
            delete creditCardInfo.creditCard.address.formattedPhone;
        }

        creditCardInfo.creditCard.expirationMonth = parseInt(creditCard.expirationMonth);
        creditCardInfo.creditCard.expirationYear = 2000 + parseInt(creditCard.expirationYear);
        creditCardInfo.creditCard.securityCode = creditCard.securityCode;

        if (!isSaveCreditCardForFutureUse && Sephora.configurationSettings.isPSTemporaryCardEnabled) {
            const tempCreditCardInfo = creditCardUtils.getEncryptedCreditCardData(creditCardInfo);
            succesCallback(null, { ...tempCreditCardInfo.creditCard, isTemporalCard: true });

            return Promise.resolve();
        }

        const method =
            isEditMode && creditCardInfo?.creditCard?.creditCardId
                ? updateCreditCardOnProfile
                : isSaveCreditCardForFutureUse
                    ? addCreditCardToProfile
                    : addPaymentCreditCard;

        return decorators
            .withInterstice(
                method,
                INTERSTICE_DELAY_MS
            )(creditCardInfo)
            .then(data => {
                const creditCardId = data?.creditCardId;
                const tempCreditCardInfo = !isSaveCreditCardForFutureUse
                    ? {
                        ...creditCardInfo?.creditCard,
                        creditCardId
                    }
                    : null;

                succesCallback(creditCardId, tempCreditCardInfo);

                return Promise.resolve();
            })
            .catch(errorData => {
                errorsUtils.collectAndValidateBackEndErrors(errorData, this);

                return Promise.reject(errorData);
            });
    };

    isCreditCardFormEmpty = () => {
        const inputsToCheck = [this.cardNumberInput, this.cardMonthInput, this.cardYearInput, this.cardSecurityCodeInput];

        let areCreditCardInputsEmpty = true;

        if (!this.state.isUseShippingAddressAsBilling) {
            // no need to check if user has entered inputs in either city, country, or state cause we autofill
            inputsToCheck.push(this.addressForm.addressInput, this.addressForm.zipCodeInput, this.addressForm.phoneNumberInput);
        }

        inputsToCheck.forEach(inputComp => {
            if (inputComp.getValue() && inputComp.getValue() !== '') {
                areCreditCardInputsEmpty = false;
            }
        });

        return areCreditCardInputsEmpty;
    };

    validateCreditCardForm = e => {
        e?.preventDefault();

        const fieldsForValidation = [
            this.cardNumberInput,
            this.cardMonthInput,
            this.cardYearInput,
            this.cardSecurityCodeInput,
            this.cardFirstNameInput,
            this.cardLastNameInput
        ];

        errorsUtils.clearErrors();
        errorsUtils.collectClientFieldErrors(fieldsForValidation);

        let addressIsValid = true;

        if (!this.state.isUseShippingAddressAsBilling) {
            addressIsValid = this.addressForm.validateForm(true, false);
        }

        // Will return true if valid, false if not
        const hasErrors = errorsUtils.validate(null, null, true) || !addressIsValid;

        if (!hasErrors) {
            return this.addOrUpdateCreditCard();
        } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject();
        }
    };

    validateCreditCardFormDebounced = preventDoubleClick(this.validateCreditCardForm);

    saveCreditCardOnChange = () => {
        const { isSaveCreditCardForFutureUse, isMarkAsDefault } = this.state;

        //if first credit card, always set as default if save card for future is checked
        const isDefault = this.props.isFirstCreditCard ? true : isMarkAsDefault;

        this.updateEditStore('isSaveCreditCardForFutureUse', !isSaveCreditCardForFutureUse, true);
        this.updateEditStore('isMarkAsDefault', isSaveCreditCardForFutureUse ? false : isDefault, true);
    };

    markAsDefaultOnChange = () => {
        const { isSaveCreditCardForFutureUse, isMarkAsDefault } = this.state;

        this.updateEditStore('isSaveCreditCardForFutureUse', !isMarkAsDefault || isSaveCreditCardForFutureUse, true);
        this.updateEditStore('isMarkAsDefault', !isMarkAsDefault, true);
    };

    showError = (message, value, errorKey) => {
        switch (errorKey) {
            case errorConstants.ERROR_CODES.VISA_INVALID_CVV:
            case errorConstants.ERROR_CODES.AMEX_INVALID_CVV:
            case errorConstants.ERROR_CODES.EXPRESS_INVALID_CVV:
                this.cardSecurityCodeInput && this.cardSecurityCodeInput.showError(message, value, errorKey);

                break;
            case errorConstants.ERROR_CODES.CREDIT_CARD_NUMBER_INVALID:
            case errorConstants.ERROR_CODES.CREDIT_CARD_IS_INVALID: {
                const customMessage =
                    errorKey === errorConstants.ERROR_CODES.CREDIT_CARD_NUMBER_INVALID ? this.getText('creditCardNumberIncorrect') : message;
                this.cardNumberInput && this.cardNumberInput.showError(customMessage, value, errorKey);

                break;
            }
            case errorConstants.ERROR_CODES.EXPIRATION_MONTH_INVALID:
                this.cardMonthInput && this.cardMonthInput.showError(message);
                this.cardYearInput && this.cardYearInput.showError(' ');

                break;
            default: {
                const errorMessage = this.getText('genericCreditCardApiError');

                this.props.setCreditCardApiErrorMsg(errorMessage);
            }
        }
    };

    validateCardNumberError = formattedCardNumber => {
        const cardNumber = formattedCardNumber.replace(/\s/g, '');

        if (formValidator.isEmpty(cardNumber)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_NUMBER_REQUIRED;
        } else if (!formValidator.isValidLength(cardNumber, 13, 19)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_NUMBER_INCORRECT;
        }

        return null;
    };

    validateExpirationMonthError = expMonth => {
        if (formValidator.isEmpty(expMonth)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_EXP_MONTH_REQUIRED;
        } else if (!formValidator.isValidCreditCardMonth(expMonth)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_EXP_MONTH_INCORRECT;
        }

        return null;
    };

    validateExpirationYearError = expYear => {
        if (formValidator.isEmpty(expYear)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_EXP_YEAR_REQUIRED;
        } else if (formValidator.isValidCreditCardYear(expYear)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_EXP_YEAR_INCORRECT;
        }

        return null;
    };

    validateSecurityCodeError = (securityCode, securityCodeLength) => {
        if (formValidator.isEmpty(securityCode)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_CVV_REQUIRED;
        } else if (securityCode.length < securityCodeLength) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_CVV_INCORRECT;
        }

        return null;
    };

    validateFirstNameError = firstName => {
        if (formValidator.isEmpty(firstName)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_FIRST_NAME_REQUIRED;
        }

        return null;
    };

    validateLastNameError = lastName => {
        if (formValidator.isEmpty(lastName)) {
            return errorConstants.ERROR_CODES.CREDIT_CARD_LAST_NAME_REQUIRED;
        }

        return null;
    };

    componentDidMount() {
        watchAction(PAYMENT_CARDS_DETECTED, data => {
            const securityCode = this.state.creditCard.securityCode || '';
            const cardType = data.cardTypes[0];

            if (cardType !== orderUtils.CREDIT_CARD_TYPES.AMERICAN_EXPRESS.name && securityCode.length > formValidator.FIELD_LENGTHS.securityCode) {
                this.cardSecurityCodeInput?.setValue(securityCode.substr(0, formValidator.FIELD_LENGTHS.securityCode));
            }

            this.setState({ cardType });

            const isMarkAsDefault = orderUtils.isSephoraCardType({ cardType });

            if (!this.props.isFirstCreditCard && !this.props.isDefault && this.state.isMarkAsDefault !== isMarkAsDefault) {
                this.updateEditStore('isMarkAsDefault', isMarkAsDefault, true);
            }
        });

        setAndWatch('editData.' + this.props.editStore, this, editData => {
            const editStore = editData[this.props.editStore] || { creditCard: {} };

            this.setState(prevState => deepExtend({}, prevState, editStore));
        });

        this.props.isEditMode && this.cardMonthInput && this.cardMonthInput.focus();
    }

    componentWillUnmount() {
        dispatch(editDataActions.clearEditData(this.props.editStore));
    }

    render() {
        const {
            isEditMode,
            shippingAddress,
            isFirstCreditCard,
            billingCountries,
            isNewUserFlow,
            defaultPayment,
            cancelCallback,
            creditCard: creditCardFromProps,
            isGuestMode
        } = this.props;

        const {
            isSaveCreditCardForFutureUse,
            isMarkAsDefault,
            creditCard,
            cardType,
            expMonthInvalid,
            creditCardNumInvalid,
            securityCodeInvalid,
            isUseShippingAddressAsBilling,
            expYearInvalid
        } = this.state;

        const currentCardType = orderUtils.PAYMENT_TYPE.CREDIT_CARD[cardType];
        const isAMEXCard = currentCardType === orderUtils.PAYMENT_TYPE.CREDIT_CARD.americanExpress;
        const displayDefaultCheckbox = isEditMode ? creditCardUtils.isSavedToProfile(creditCardFromProps.creditCardId) : true;
        const cardTypeDetected = creditCard && creditCard.cardType && orderUtils.getThirdPartyCreditCard(creditCard);
        const securityCodeLength = isAMEXCard ? formValidator.FIELD_LENGTHS.securityCodeAmex : formValidator.FIELD_LENGTHS.securityCode;
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';

        return (
            <>
                <Flex
                    flexDirection={'column'}
                    gap={4}
                    width={'100%'}
                    maxWidth={'404px'}
                >
                    <AddCardHeader
                        isFormHeader
                        isEditCard={isEditMode}
                    />

                    <Grid
                        columns={GRID_COLUMS}
                        gap={4}
                    >
                        <Box
                            position='relative'
                            gridColumn={`span ${GRID_COLUMS}`}
                        >
                            <TextInput
                                marginBottom={0}
                                label={this.getText('cardNumber')}
                                autoComplete='cc-number'
                                autoCorrect='off'
                                name='cardNumber'
                                required={true}
                                hideAsterisk={true}
                                pattern='\d*'
                                inputMode='numeric'
                                style={cardType ? { paddingRight: PAYMENT_LOGO_WIDTH + PAYMENT_LOGO_OFFSET * 2 } : null}
                                maxLength={formValidator.FIELD_LENGTHS.creditCard + formValidator.FIELD_LENGTHS.creditCardSpaces}
                                onChange={this.checkCreditCard}
                                onKeyDown={formValidator.inputAcceptOnlyNumbers}
                                onPaste={formValidator.pasteAcceptOnlyNumbers}
                                ref={comp => (this.cardNumberInput = comp)}
                                disabled={isEditMode}
                                value={creditCardUtils.formatCardNumber(creditCard.cardNumber)}
                                invalid={creditCardNumInvalid}
                                data-at={Sephora.debug.dataAt('card_number_input')}
                                dataAtError={Sephora.debug.dataAt('cc_number_required_error')}
                                validateError={this.validateCardNumberError}
                            />
                            <Flex
                                alignItems='center'
                                backgroundColor={isEditMode ? forms.DISABLED_BG : forms.BG}
                                position='absolute'
                                top={`${forms.BORDER_WIDTH}px`}
                                right={`${PAYMENT_LOGO_OFFSET}px`}
                                height={forms.HEIGHT - forms.BORDER_WIDTH * 2}
                                css={{
                                    pointerEvents: 'none'
                                }}
                                style={
                                    !cardType
                                        ? {
                                            visibility: 'hidden'
                                        }
                                        : null
                                }
                            >
                                <PaymentLogo
                                    width={PAYMENT_LOGO_WIDTH}
                                    height={24}
                                    paymentGroupType={orderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                                    {...(isEditMode && { cardType: cardTypeDetected })}
                                />
                            </Flex>
                        </Box>

                        <TextInput
                            marginBottom={0}
                            label={this.getText('mm')}
                            autoComplete='cc-exp-month'
                            autoCorrect='off'
                            name='expirationMonth'
                            required={true}
                            hideAsterisk={true}
                            pattern='\d*'
                            inputMode='numeric'
                            maxLength={formValidator.FIELD_LENGTHS.creditCardExpiration}
                            value={creditCard.expirationMonth}
                            onBlur={this.handleExpMonthOnBlur}
                            onChange={e => this.updateEditStore(e.target.name, e.target.value)}
                            onKeyDown={formValidator.inputAcceptOnlyNumbers}
                            onPaste={formValidator.pasteAcceptOnlyNumbers}
                            invalid={expMonthInvalid}
                            data-at={Sephora.debug.dataAt('month_input')}
                            dataAtError={Sephora.debug.dataAt('month_expire_error')}
                            ref={comp => (this.cardMonthInput = comp)}
                            validateError={this.validateExpirationMonthError}
                        />

                        <TextInput
                            marginBottom={0}
                            label={this.getText('yy')}
                            autoComplete='cc-exp-year'
                            autoCorrect='off'
                            name='expirationYear'
                            required={true}
                            hideAsterisk={true}
                            pattern='\d*'
                            inputMode='numeric'
                            onKeyDown={formValidator.inputAcceptOnlyNumbers}
                            onPaste={formValidator.pasteAcceptOnlyNumbers}
                            onChange={e => this.updateEditStore(e.target.name, e.target.value)}
                            maxLength={formValidator.FIELD_LENGTHS.creditCardExpiration}
                            value={creditCard.expirationYear}
                            invalid={expYearInvalid}
                            data-at={Sephora.debug.dataAt('year_input')}
                            dataAtError={Sephora.debug.dataAt('year_expire_error')}
                            ref={comp => (this.cardYearInput = comp)}
                            validateError={this.validateExpirationYearError}
                        />

                        <TextInput
                            marginBottom={0}
                            label={this.getText('cvc')}
                            autoComplete='cc-csc'
                            autoCorrect='off'
                            infoAction={this.openCVCModal}
                            infoLabel='More info about CVV'
                            name='securityCode'
                            required={true}
                            hideAsterisk={true}
                            inputMode='numeric'
                            pattern='\d*'
                            onKeyDown={formValidator.inputAcceptOnlyNumbers}
                            onPaste={formValidator.pasteAcceptOnlyNumbers}
                            onChange={e =>
                                this.updateEditStore(e.target.name, formValidator.replaceDotSeparator(e.target.value, this.cardSecurityCodeInput))
                            }
                            maxLength={securityCodeLength}
                            value={creditCard.securityCode}
                            invalid={securityCodeInvalid}
                            data-at={Sephora.debug.dataAt('cvv_input')}
                            dataAtError={Sephora.debug.dataAt('cvv_error')}
                            ref={comp => (this.cardSecurityCodeInput = comp)}
                            validateError={securityCode => this.validateSecurityCodeError(securityCode, securityCodeLength)}
                        />

                        {/* placeholder to force an additional grid column in this place */}
                        <div />

                        <Box gridColumn={`span ${GRID_COLUMS}`}>
                            <TextInput
                                marginBottom={0}
                                label={this.getText('firstName')}
                                autoComplete='cc-given-name'
                                autoCorrect='off'
                                name='firstName'
                                required={true}
                                hideAsterisk={true}
                                onChange={e => this.updateEditStore(e.target.name, e.target.value)}
                                maxLength={formValidator.FIELD_LENGTHS.name}
                                value={creditCard.firstName}
                                data-at={Sephora.debug.dataAt('first_name_input')}
                                dataAtError={Sephora.debug.dataAt('first_name_error')}
                                ref={comp => (this.cardFirstNameInput = comp)}
                                validateError={this.validateFirstNameError}
                            />
                        </Box>

                        <Box gridColumn={`span ${GRID_COLUMS}`}>
                            <TextInput
                                marginBottom={0}
                                label={this.getText('lastName')}
                                autoComplete='cc-family-name'
                                autoCorrect='off'
                                name='lastName'
                                required={true}
                                hideAsterisk={true}
                                onChange={e => this.updateEditStore(e.target.name, e.target.value)}
                                maxLength={formValidator.FIELD_LENGTHS.name}
                                value={creditCard.lastName}
                                data-at={Sephora.debug.dataAt('last_name_input')}
                                dataAtError={Sephora.debug.dataAt('last_name_error')}
                                ref={comp => (this.cardLastNameInput = comp)}
                                validateError={this.validateLastNameError}
                            />
                        </Box>

                        <Text
                            is='h3'
                            fontWeight='bold'
                            lineHeight='tight'
                            marginTop={1}
                            children={this.getText('billingAddress')}
                        />

                        {shippingAddress && (
                            <Box gridColumn={`span ${GRID_COLUMS}`}>
                                <Radio
                                    data-at={Sephora.debug.dataAt('use_my_shipping_address')}
                                    checked={isUseShippingAddressAsBilling}
                                    onClick={this.handleUseShippingAddress}
                                >
                                    <Fragment>
                                        {this.getText(isEditMode ? 'useMyBillingAddressRadio' : 'useMyAddressRadio')}
                                        {isUseShippingAddressAsBilling && (
                                            <Text
                                                display='block'
                                                marginY={1}
                                                numberOfLines={1}
                                                fontWeight='bold'
                                            >
                                                {shippingAddress.address1}, {shippingAddress.address2 && shippingAddress.address2 + ', '}
                                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                                            </Text>
                                        )}
                                    </Fragment>
                                </Radio>

                                <Radio
                                    checked={!isUseShippingAddressAsBilling}
                                    data-at={Sephora.debug.dataAt('use_a_different_address')}
                                    onClick={this.handleUseShippingAddress}
                                >
                                    {this.getText('useDiffAddressRadio')}
                                </Radio>
                            </Box>
                        )}

                        {isUseShippingAddressAsBilling ||
                            (billingCountries && (
                                <Box gridColumn={`span ${GRID_COLUMS}`}>
                                    <AddressForm
                                        editStore={formsUtils.getStoreEditSectionName(formsUtils.FORMS.CHECKOUT.BILLING_ADDRESS, isNewUserFlow)}
                                        hasGridLayout={true}
                                        isEditMode={isEditMode}
                                        address={creditCard.address}
                                        country={creditCard.address.country}
                                        countryList={billingCountries}
                                        isBillingAddress={true}
                                        ref={comp => {
                                            if (comp !== null) {
                                                this.addressForm = comp;
                                            }
                                        }}
                                    />
                                </Box>
                            ))}
                        {!isGuestMode && (
                            <Box gridColumn={`span ${GRID_COLUMS}`}>
                                {isEditMode || (
                                    <Checkbox
                                        paddingY={2}
                                        checked={isSaveCreditCardForFutureUse}
                                        onClick={this.saveCreditCardOnChange}
                                        data-at={Sephora.debug.dataAt('save_card_label')}
                                        name='SaveCreditCard'
                                        children={this.getText('saveCardCheckboxText')}
                                    />
                                )}
                                {displayDefaultCheckbox && (
                                    <Checkbox
                                        disabled={creditCardIsDefaultPayment && isFirstCreditCard}
                                        paddingY={2}
                                        checked={isMarkAsDefault}
                                        onClick={this.markAsDefaultOnChange}
                                        data-at={Sephora.debug.dataAt('make_default_card_label')}
                                        name='MarkAsDefault'
                                        children={this.getText('makeDefaultCheckboxText')}
                                    />
                                )}
                            </Box>
                        )}
                    </Grid>

                    <Flex gap={[2]}>
                        {isNewUserFlow || (
                            <Button
                                marginTop={2}
                                width={['50%', null, 194]}
                                variant={'secondary'}
                                children={this.getText('cancel')}
                                onClick={cancelCallback}
                            />
                        )}
                        <Button
                            marginTop={2}
                            width={['50%', null, 194]}
                            variant={'primary'}
                            children={this.getText('useThisCard')}
                            onClick={this.validateCreditCardFormDebounced}
                        />
                    </Flex>
                </Flex>

                {/* CVC modal */}
                <CVCInfoModal />
            </>
        );
    }
}

export default wrapComponent(CreditCardForm, 'CreditCardForm', true);
