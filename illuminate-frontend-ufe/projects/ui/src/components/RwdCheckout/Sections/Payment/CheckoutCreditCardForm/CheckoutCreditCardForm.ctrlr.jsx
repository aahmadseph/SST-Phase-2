/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React, { createRef } from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Flex, Button, Divider, Link, Grid
} from 'components/ui';
import { forms, space } from 'style/config';
import AddressForm from 'components/Addresses/AddressForm/AddressForm';
import AccordionButton from 'components/Checkout/AccordionButton';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import creditCardUtils from 'utils/CreditCard';
import OrderUtils from 'utils/Order';
import CheckoutUtils from 'utils/Checkout';
import FormsUtils from 'utils/Forms';
import ErrorConstants from 'utils/ErrorConstants';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentLogo from 'components/RwdCheckout/PaymentLogo/PaymentLogo';
import Modal from 'components/Modal/Modal';
import GiftCardSection from 'components/RwdCheckout/Sections/Payment/GiftCardSection';
import PlaceOrderButton from 'components/RwdCheckout/PlaceOrderButton';
import GuestSavePointsCheckbox from 'components/RwdCheckout/Shared/Guest';
import CheckoutTermsConditions from 'components/RwdCheckout/CheckoutTermsConditions';
import CheckoutPromoSection from 'components/RwdCheckout/OrderSummary/CheckoutPromoSection';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import ErrorMsg from 'components/ErrorMsg';
import TestTarget from 'components/TestTarget/TestTarget';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import checkoutUtils from 'utils/Checkout';
import Location from 'utils/Location';
import deepExtend from 'utils/deepExtend';
import ErrorsUtils from 'utils/Errors';
import debounceUtils from 'utils/Debounce';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { PAYMENT_CARDS_DETECTED, TOGGLE_CVC_INFO_MODAL, UPDATE_ORDER } from 'constants/actionTypes/order';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Empty from 'constants/empty';
import UIUtils from 'utils/UI';
import mediaUtils from 'utils/Media';
import OrderActions from 'actions/OrderActions';

const { Media } = mediaUtils;
const { isSMUI } = UIUtils;
const { preventDoubleClick } = debounceUtils;
const PAYMENT_LOGO_WIDTH = 56;
const PAYMENT_LOGO_OFFSET = space[1];
const FORM_GUTTER = 4;

class CheckoutCreditCardForm extends BaseClass {
    constructor(props) {
        super(props);
        const creditCardIsDefaultPayment = !this.props.defaultPayment || this.props.defaultPayment === 'creditCard';
        this.state = {
            isOpen: true,
            cardType: this.props.cardType,
            isUseShippingAddressAsBilling: this.props.isUseShippingAddressAsBilling,
            countryList: null,
            isSaveCreditCardForFutureUse: true,
            isMarkAsDefault: creditCardIsDefaultPayment && (this.props.isDefault || this.props.isFirstCreditCard),
            creditCard: this.props.creditCard
        };
        this.cardExpirationDateInput = createRef();
        this.cardMonthInput = createRef();
        this.cardYearInput = createRef();
        this.showExpirationFieldsCombined = !this.props.isEditMode && localeUtils.isUS();
    }

    componentDidMount() {
        store.watchAction(PAYMENT_CARDS_DETECTED, data => {
            const securityCode = this.state.creditCard.securityCode || '';
            const cardType = data.cardTypes[0];

            if (cardType !== 'americanExpress' && securityCode.length > FormValidator.FIELD_LENGTHS.securityCode) {
                // cut extra CVV symbol
                this.cardSecurityCodeInput.setValue(securityCode.substr(0, FormValidator.FIELD_LENGTHS.securityCode));
            }

            this.setState({ cardType });

            const isMarkAsDefault = OrderUtils.isSephoraCardType({ cardType });

            if (!this.props.isFirstCreditCard && !this.props.isDefault && this.state.isMarkAsDefault !== isMarkAsDefault) {
                this.updateEditStore('isMarkAsDefault', isMarkAsDefault, true);
            }
        });

        store.setAndWatch('editData.' + this.props.editStore, this, editData => {
            const editStore = editData[this.props.editStore] || { creditCard: {} };
            this.setState(prevState => {
                return deepExtend({}, prevState, editStore);
            });
        });

        const isGuestOrder = checkoutUtils.isGuestOrder();

        if (isGuestOrder) {
            this.props.setPlaceOrderPreHook(e => {
                if (this.isPaymentInOrderCompleteForGuestUser()) {
                    return Promise.resolve();
                } else {
                    return this.validateCreditCardForm(e);
                }
            });

            store.watchAction(UPDATE_ORDER, () => {
                if (!this.isPaymentInOrderCompleteForGuestUser()) {
                    this.validateGuestCreditCard();
                } else {
                    this.props.togglePlaceOrderDisabled(false);
                }
            });

            const isPaymentComplete = this.isPaymentInOrderCompleteForGuestUser();
            this.props.togglePlaceOrderDisabled(!isPaymentComplete);
        } else {
            this.props.togglePlaceOrderDisabled(true);
        }

        store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
            const actionInfoButton = this.cardSecurityCodeInput.getInfoActionButtonRef();

            if (actionInfoButton && data.isOpen === false) {
                actionInfoButton.focus();
            }
        });

        if (Sephora.isAgent) {
            //If it is Sephora mirror and the new credit card is expired then specific error is displayed for agents
            Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, false);

            if (this.state.creditCard.isExpired) {
                this.showError('This card is expired. Please update your card information.');
                this.cardMonthInput.current.showError('Please enter the month');
                this.cardYearInput.current.showError('Please enter the year');
                this.cardSecurityCodeInput.showError('Please enter your security code');
            }
        }

        this.props.isEditMode && this.cardMonthInput.current && this.cardMonthInput.current.focus();
    }

    closeCreditCardForm = () => {
        if (isSMUI()) {
            this.setState({ isOpen: false }, this.props.cancelCallback());
        } else {
            this.props.cancelCallback();
        }
    };

    openCVCModal = e => {
        e.preventDefault();
        this.props.openCVCModal({
            isOpen: true
        });
    };

    updateEditStore = (name, value, isExtraData) => {
        const editStore = store.getState().editData[this.props.editStore] || { creditCard: {} };
        const creditCardInfo = !isExtraData
            ? deepExtend({}, editStore, { creditCard: deepExtend({}, editStore.creditCard, { [name]: value }) })
            : deepExtend({}, editStore, { [name]: value });
        this.props.updateEditData(creditCardInfo, this.props.editStore);
    };

    formatExpirationDate = digits => {
        const month = digits.slice(0, 2) ?? Empty.String;
        const year = digits.slice(2, 4) ?? Empty.String;
        const formattedDate = month.length > 1 ? `${month}/` : month;

        return {
            month,
            year,
            digits: `${formattedDate}${year}`
        };
    };

    getExpirationDate = ({ target }) => {
        const { name, value } = target;
        const { month, year, digits } = this.formatExpirationDate(value.replace(/[^0-9]/g, ''));
        const { expirationMonth, expirationYear } = this.state.creditCard;

        expirationMonth !== month && this.updateEditStore('expirationMonth', month);
        expirationYear !== year && this.updateEditStore('expirationYear', year);
        this.updateEditStore(name, digits);
    };

    componentWillUnmount() {
        this.props.clearEditData(this.props.editStore);
        const isGuestOrder = checkoutUtils.isGuestOrder();

        if (isGuestOrder) {
            this.props.setPlaceOrderPreHook(null);
        }
    }

    checkCreditCard = e => {
        const cardNumber = e.target.value.replace(/\s/g, '');
        const formattedCardNumber = creditCardUtils.formatCardNumber(cardNumber);

        this.setState({
            creditCard: {
                ...this.state.creditCard,
                formattedCardNumber
            }
        });

        this.props.paymentCardNumberChanged(cardNumber);
        this.updateEditStore('cardNumber', cardNumber);
    };

    handleExpMonthOnBlur = () => {
        let expMonth = (this.cardMonthInput.current && this.cardMonthInput.current.getValue()) || '';

        if (expMonth.length === 1) {
            expMonth = creditCardUtils.formatExpMonth(expMonth);
            this.updateEditStore('expirationMonth', expMonth);
        }
    };

    handleExpDateOnBlur = () => {
        const expDate = (this.cardExpirationDateInput.current && this.cardExpirationDateInput.current.getValue()) || '';

        if (expDate.length > 1 && !expDate.includes('/')) {
            const { digits } = this.formatExpirationDate(expDate.replace(/[^0-9]/g, ''));
            this.cardExpirationDateInput.current.setValue(digits);
        }
    };

    handleUseShippingAddress = () => {
        const useShippingAddress = !this.state.isUseShippingAddressAsBilling;
        this.updateEditStore('isUseShippingAddressAsBilling', useShippingAddress, true);
    };

    addOrUpdateCreditCard = () => {
        const { creditCard } = this.state;
        const creditCardInfo = {
            isMarkAsDefault: this.state.isMarkAsDefault,
            creditCard: {
                firstName: creditCard.firstName,
                lastName: creditCard.lastName
            }
        };

        if (!this.state.isUseShippingAddressAsBilling) {
            const newAddressData = this.addressForm.getData();
            delete newAddressData.address.addressId;
            const billingAddress = newAddressData.address;
            billingAddress.firstName = creditCardInfo.creditCard.firstName;
            billingAddress.lastName = creditCardInfo.creditCard.lastName;
            creditCardInfo.creditCard.address = billingAddress;
        }

        creditCardInfo.creditCard.expirationMonth = parseInt(creditCard.expirationMonth);
        creditCardInfo.creditCard.expirationYear = 2000 + parseInt(creditCard.expirationYear);
        creditCardInfo.creditCard.securityCode = creditCard.securityCode;

        let typeOfUpdate;

        if (this.props.isEditMode) {
            if (this.state.isUseShippingAddressAsBilling) {
                const newBillingAddress = Object.assign({}, this.props.shippingAddress);
                delete newBillingAddress.addressId;
                delete newBillingAddress.isDefault;
                delete newBillingAddress.isAddressVerified;
                delete newBillingAddress.email;
                creditCardInfo.creditCard.address = newBillingAddress;
            }

            creditCardInfo.creditCard.creditCardId = creditCard.creditCardId;
            typeOfUpdate = 'update';
        } else {
            creditCardInfo.isUseShippingAddressAsBilling = this.state.isUseShippingAddressAsBilling;
            creditCardInfo.isSaveCreditCardForFutureUse = this.state.isSaveCreditCardForFutureUse;
            creditCardInfo.creditCard.cardType = this.state.cardType;
            creditCardInfo.creditCard.cardNumber = creditCard.cardNumber;
        }

        if (creditCardInfo.creditCard.address) {
            delete creditCardInfo.creditCard.address.formattedPhone;
        }

        const method =
            creditCardInfo && creditCardInfo.creditCard && creditCardInfo.creditCard.creditCardId
                ? this.props.updateCreditCardOnOrder
                : this.props.addCreditCardToOrder;

        return this.props
            .addOrUpdateCreditCard(creditCardInfo, typeOfUpdate, method)
            .then(data => {
                if (data) {
                    this.props.merge('order', 'bankRewardsValidPaymentsMessage', data.bankRewardsValidPaymentsMessage);
                }

                this.props.merge('order', 'isApplePayFlow', false);
                this.props.klarnaToggleSelect(false);
                this.props.afterpayToggleSelect(false);

                if (!checkoutUtils.isGuestOrder()) {
                    if (isSMUI()) {
                        this.setState({ isOpen: false });
                    }

                    this.props.sectionSaved(Location.getLocation().pathname, this);

                    const { defaultPayment } = this.props;

                    processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
                        data: {
                            paymentType: defaultPayment
                        }
                    });
                }

                return Promise.resolve();
            })
            .catch(errorData => {
                ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);

                return Promise.reject(errorData);
            });
    };

    isCreditCardFormEmpty = () => {
        const inputsToCheck = [this.cardNumberInput];

        inputsToCheck.push(this.cardMonthInput.current);
        inputsToCheck.push(this.cardYearInput.current);
        inputsToCheck.push(this.cardSecurityCodeInput);

        let areCreditCardInputsEmpty = true;

        if (!this.state.isUseShippingAddressAsBilling) {
            //don't have to check if user has entered inputs in either city, country, or state
            //because we autofill that
            inputsToCheck.push(this.addressForm.addressInput);
            inputsToCheck.push(this.addressForm.zipCodeInput);
            inputsToCheck.push(this.addressForm.phoneNumberInput);
        }

        inputsToCheck.forEach(inputComp => {
            if (inputComp.getValue() && inputComp.getValue() !== '') {
                areCreditCardInputsEmpty = false;
            }
        });

        return areCreditCardInputsEmpty;
    };

    componentDidUpdate(_, prevState) {
        if (checkoutUtils.isGuestOrder() && !this.isPaymentInOrderCompleteForGuestUser()) {
            this.validateGuestCreditCard();
        }

        if (prevState.creditCard.cardNumber !== this.state.creditCard.cardNumber) {
            const cardTypes = this.props.detectCardTypes(this.state.creditCard.cardNumber, OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD);
            store.dispatch(OrderActions.paymentCardsDetected(cardTypes));
        }
    }

    isPaymentInOrderCompleteForGuestUser = () => {
        // if Credit Card form is expanded for guest user,
        // the only usecase to skip the form is to add GC that covers the entire order
        return checkoutUtils.isGiftCardApplied() && !OrderUtils.hasAmountDue();
    };

    validateGuestCreditCard = () => {
        const fieldsForValidation = [
            this.cardNumberInput,
            this.cardMonthInput.current,
            this.cardYearInput.current,
            this.cardSecurityCodeInput,
            this.cardFirstNameInput,
            this.cardLastNameInput
        ];

        const formIsInvalid = fieldsForValidation.some(comp => {
            if (comp && comp.validateErrorWithCode) {
                const errorCode = comp.validateErrorWithCode();
                const error = ErrorsUtils.getError(errorCode);

                return !!error;
            } else {
                return false;
            }
        });

        this.props.togglePlaceOrderDisabled(formIsInvalid);
    };

    validateCreditCardForm = e => {
        e?.preventDefault();

        // the first condition is for the scenario where a user applys a gift card that covers
        // the amount of the order.
        // also need to check that the user has not entered inputs in credit card form
        if (this.props.isNewUserFlow && this.isPaymentInOrderCompleteForGuestUser() && this.isCreditCardFormEmpty()) {
            this.props.sectionSaved(Location.getLocation().pathname, this);

            return Promise.resolve();
        } else {
            const fieldsForValidation = [this.cardNumberInput, this.cardSecurityCodeInput, this.cardFirstNameInput, this.cardLastNameInput];

            if (this.showExpirationFieldsCombined) {
                fieldsForValidation.splice(1, 0, this.cardExpirationDateInput.current);
            } else {
                fieldsForValidation.splice(1, 0, this.cardMonthInput.current, this.cardYearInput.current);
            }

            if (this.props.isNewUserFlow) {
                fieldsForValidation.push(this.giftCardSection);
            }

            ErrorsUtils.clearErrors();
            ErrorsUtils.collectClientFieldErrors(fieldsForValidation);
            let addressIsValid = true;

            if (!this.state.isUseShippingAddressAsBilling) {
                addressIsValid = this.addressForm.validateForm(true, false);
            }

            // Will return true if valid, false if not
            this.hasErrors = ErrorsUtils.validate() || !addressIsValid;

            if (!this.hasErrors) {
                return this.addOrUpdateCreditCard();
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject();
            }
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
            case ErrorConstants.ERROR_CODES.VISA_INVALID_CVV:
            case ErrorConstants.ERROR_CODES.AMEX_INVALID_CVV:
            case ErrorConstants.ERROR_CODES.EXPRESS_INVALID_CVV:
                this.cardSecurityCodeInput && this.cardSecurityCodeInput.showError(message, value, errorKey);

                break;
            case ErrorConstants.ERROR_CODES.CREDIT_CARD_IS_INVALID:
                this.cardNumberInput && this.cardNumberInput.showError(message, value, errorKey);

                break;
            case ErrorConstants.ERROR_CODES.EXPIRATION_MONTH_INVALID:
                if (!this.showExpirationFieldsCombined) {
                    this.cardMonthInput.current && this.cardMonthInput.current.showError(message);
                    this.cardYearInput.current && this.cardYearInput.current.showError(' ');
                } else {
                    this.cardExpirationDateInput.current.showError(message);
                }

                break;
            default:
                this.setState({ errorMessage: message });
        }
    };

    validateExpirationDate = expDate => {
        const month = expDate.slice(0, 2) ?? Empty.String;
        const year = expDate.slice(3, 4) ?? Empty.String;

        const monthError = this.validateExpirationMonth(month);
        const yearError = this.validateExpirationYear(year);

        return monthError ? monthError : yearError;
    };

    validateExpirationYear = expYear => {
        if (FormValidator.isEmpty(expYear)) {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_EXP_YEAR;
        }

        return null;
    };

    validateExpirationMonth = expMonth => {
        if (FormValidator.isEmpty(expMonth)) {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_EXP_MONTH;
        }

        if (!FormValidator.isValidCreditCardMonth(expMonth)) {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_EXP_MONTH_INVALID;
        }

        return null;
    };

    inputHandler = ({ target }) => {
        const { name, value } = target;
        this.updateEditStore(name, value);
    };

    render() {
        const { isSaveCreditCardForFutureUse, isMarkAsDefault, creditCard, cardType } = this.state;

        const {
            isEditMode,
            shippingAddress,
            isFirstCreditCard,
            billingCountries,
            isNewUserFlow,
            isGiftCardShow,
            isBopis,
            hasAutoReplenishItemInBasket,
            defaultPayment,
            localization: {
                mm,
                yy,
                endingIn,
                cardNumberText,
                expirationDate,
                cvc,
                firstNameText,
                lastNameText,
                billingAddress,
                useMyAddressRadio,
                useDiffAddressRadio,
                saveCardCheckboxText,
                debitCardDisclaimer,
                editCardTitle,
                addNewCardTitle,
                makeDefaultCheckboxText,
                saveContinueButton,
                cancelButton
            }
        } = this.props;

        const currentCardType = OrderUtils.PAYMENT_TYPE.CREDIT_CARD[this.state.cardType];
        const isAMEXCard = currentCardType === OrderUtils.PAYMENT_TYPE.CREDIT_CARD.americanExpress;
        const displayDefaultCheckbox = isEditMode ? creditCardUtils.isSavedToProfile(this.props.creditCard.creditCardId) : true;
        const cardTypeDetected = creditCard && creditCard.cardType && OrderUtils.getThirdPartyCreditCard(creditCard);
        const shouldShowPromotion = OrderUtils.shouldShowPromotion();
        const isGuestCheckout = CheckoutUtils.isGuestOrder();
        const securityCodeLength = isAMEXCard ? FormValidator.FIELD_LENGTHS.securityCodeAmex : FormValidator.FIELD_LENGTHS.securityCode;
        const { isHalAddress } = OrderUtils;
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';

        const creditCardFormContainer = (
            <div data-at='credit-card-form-container'>
                {this.state.errorMessage && <ErrorMsg children={this.state.errorMessage} />}
                <Grid
                    gap={FORM_GUTTER}
                    gridTemplateColumns={[null, '1fr 1fr']}
                >
                    {isEditMode ? (
                        <Flex
                            alignItems='center'
                            lineHeight='tight'
                            marginBottom={4}
                        >
                            <PaymentLogo
                                width={50}
                                height={32}
                                marginRight={4}
                                cardType={cardTypeDetected}
                                paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                            />
                            <Text
                                is='b'
                                data-at={Sephora.debug.dataAt('edit_card_number')}
                            >
                                {creditCardUtils.getCardName(creditCard.cardType)} {endingIn}{' '}
                                {creditCardUtils.shortenCardNumber(creditCard.cardNumber)}
                            </Text>
                        </Flex>
                    ) : (
                        <Box position='relative'>
                            <TextInput
                                label={cardNumberText}
                                autoComplete='cc-number'
                                autoCorrect='off'
                                name='cardNumber'
                                required={true}
                                pattern='\d*'
                                inputMode='numeric'
                                style={cardType ? { paddingRight: PAYMENT_LOGO_WIDTH + PAYMENT_LOGO_OFFSET * 2 } : null}
                                maxLength={FormValidator.FIELD_LENGTHS.creditCard + FormValidator.FIELD_LENGTHS.creditCardSpaces}
                                onChange={this.checkCreditCard}
                                onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                ref={comp => (this.cardNumberInput = comp)}
                                value={creditCard.formattedCardNumber}
                                invalid={this.state.creditCardNumInvalid}
                                data-at={Sephora.debug.dataAt('card_number_input')}
                                dataAtError={Sephora.debug.dataAt('cc_number_required_error')}
                                validateError={cardNumber => {
                                    if (FormValidator.isEmpty(cardNumber)) {
                                        return ErrorConstants.ERROR_CODES.CREDIT_CARD_NUMBER;
                                    }

                                    return null;
                                }}
                            />
                            <Flex
                                alignItems='center'
                                backgroundColor={forms.BG}
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
                                    height={36}
                                    cardType={cardType}
                                    paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                                />
                            </Flex>
                        </Box>
                    )}
                </Grid>

                <Grid
                    gap={FORM_GUTTER}
                    gridTemplateColumns={this.showExpirationFieldsCombined ? ['2fr 1fr', '1fr 1fr'] : ['1fr 1fr 1fr', '1fr 1fr 1fr 1fr']}
                >
                    {!this.showExpirationFieldsCombined && (
                        <TextInput
                            label={mm}
                            autoComplete='cc-exp-month'
                            autoCorrect='off'
                            name='expirationMonth'
                            required={true}
                            pattern='\d*'
                            inputMode='numeric'
                            maxLength={FormValidator.FIELD_LENGTHS.creditCardExpiration}
                            value={creditCard.expirationMonth}
                            onBlur={this.handleExpMonthOnBlur}
                            onChange={this.inputHandler}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            invalid={this.state.expMonthInvalid}
                            data-at={Sephora.debug.dataAt('month_input')}
                            dataAtError={Sephora.debug.dataAt('month_expire_error')}
                            ref={this.cardMonthInput}
                            validateError={this.validateExpirationMonth}
                        />
                    )}
                    {!this.showExpirationFieldsCombined && (
                        <TextInput
                            label={yy}
                            autoComplete='cc-exp-year'
                            autoCorrect='off'
                            name='expirationYear'
                            required={true}
                            pattern='\d*'
                            inputMode='numeric'
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            onChange={this.inputHandler}
                            maxLength={FormValidator.FIELD_LENGTHS.creditCardExpiration}
                            value={creditCard.expirationYear}
                            invalid={this.state.expYearInvalid}
                            data-at={Sephora.debug.dataAt('year_input')}
                            dataAtError={Sephora.debug.dataAt('year_expire_error')}
                            ref={this.cardYearInput}
                            validateError={this.validateExpirationYear}
                        />
                    )}
                    {this.showExpirationFieldsCombined && (
                        <TextInput
                            label={expirationDate}
                            autoComplete='cc-exp-date'
                            autoCorrect='off'
                            name='expirationDate'
                            required={true}
                            pattern='\d*'
                            inputMode='numeric'
                            maxLength={FormValidator.FIELD_LENGTHS.creditCardExpirationDate}
                            value={creditCard.expirationDate}
                            onBlur={this.handleExpDateOnBlur}
                            onChange={this.getExpirationDate}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            invalid={this.state.expMonthInvalid || this.state.expYearInvalid}
                            data-at={Sephora.debug.dataAt('month_input')}
                            dataAtError={Sephora.debug.dataAt('month_expire_error')}
                            ref={this.cardExpirationDateInput}
                            validateError={this.validateExpirationDate}
                        />
                    )}
                    <Box width={this.showExpirationFieldsCombined && [null, '50%']}>
                        <TextInput
                            label={cvc}
                            autoComplete='cc-csc'
                            autoCorrect='off'
                            infoAction={this.openCVCModal}
                            infoLabel='More info about CVV'
                            name='securityCode'
                            required={true}
                            inputMode='numeric'
                            pattern='\d*'
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            onChange={e =>
                                this.updateEditStore(e.target.name, FormValidator.replaceDotSeparator(e.target.value, this.cardSecurityCodeInput))
                            }
                            maxLength={securityCodeLength}
                            value={creditCard.securityCode}
                            invalid={this.state.securityCodeInvalid}
                            data-at={Sephora.debug.dataAt('cvv_input')}
                            dataAtError={Sephora.debug.dataAt('cvv_error')}
                            ref={comp => (this.cardSecurityCodeInput = comp)}
                            validateError={securityCode => {
                                if (FormValidator.isEmpty(securityCode)) {
                                    return ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE;
                                } else if (securityCode.length < securityCodeLength) {
                                    return ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH;
                                }

                                return null;
                            }}
                        />
                    </Box>
                </Grid>

                <Grid
                    gap={[null, FORM_GUTTER]}
                    gridTemplateColumns={['null null', '1fr 1fr']}
                >
                    <TextInput
                        label={firstNameText}
                        autoComplete='cc-given-name'
                        autoCorrect='off'
                        name='firstName'
                        required={true}
                        onChange={this.inputHandler}
                        maxLength={FormValidator.FIELD_LENGTHS.name}
                        value={creditCard.firstName}
                        data-at={Sephora.debug.dataAt('first_name_input')}
                        dataAtError={Sephora.debug.dataAt('first_name_error')}
                        ref={comp => (this.cardFirstNameInput = comp)}
                        validateError={firstName => {
                            if (FormValidator.isEmpty(firstName)) {
                                return ErrorConstants.ERROR_CODES.FIRST_NAME;
                            }

                            return null;
                        }}
                    />
                    <TextInput
                        label={lastNameText}
                        autoComplete='cc-family-name'
                        autoCorrect='off'
                        name='lastName'
                        required={true}
                        onChange={this.inputHandler}
                        maxLength={FormValidator.FIELD_LENGTHS.name}
                        value={creditCard.lastName}
                        data-at={Sephora.debug.dataAt('last_name_input')}
                        dataAtError={Sephora.debug.dataAt('last_name_error')}
                        ref={comp => (this.cardLastNameInput = comp)}
                        validateError={lastName => {
                            if (FormValidator.isEmpty(lastName)) {
                                return ErrorConstants.ERROR_CODES.LAST_NAME;
                            }

                            return null;
                        }}
                    />
                </Grid>

                <Text
                    is='h3'
                    fontWeight='bold'
                    lineHeight='tight'
                    marginBottom='.5em'
                    children={billingAddress}
                />

                {shippingAddress && !isHalAddress(shippingAddress) && (
                    <React.Fragment>
                        <Radio
                            data-at={Sephora.debug.dataAt('use_my_shipping_address')}
                            checked={this.state.isUseShippingAddressAsBilling}
                            onClick={this.handleUseShippingAddress}
                        >
                            <React.Fragment>
                                {useMyAddressRadio}
                                {this.state.isUseShippingAddressAsBilling && (
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
                            </React.Fragment>
                        </Radio>

                        <Radio
                            checked={!this.state.isUseShippingAddressAsBilling}
                            data-at={Sephora.debug.dataAt('use_a_different_address')}
                            onClick={this.handleUseShippingAddress}
                        >
                            {useDiffAddressRadio}
                        </Radio>
                    </React.Fragment>
                )}

                {this.state.isUseShippingAddressAsBilling ||
                    (billingCountries && (
                        <Box marginTop={3}>
                            <AddressForm
                                editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.BILLING_ADDRESS, isNewUserFlow)}
                                hasGridLayout={true}
                                isEditMode={isEditMode}
                                address={creditCard.address}
                                country={creditCard.address.country}
                                countryList={billingCountries}
                                isCheckout={true}
                                isBillingAddress={true}
                                ref={comp => {
                                    if (comp !== null) {
                                        this.addressForm = comp;
                                    }
                                }}
                            />
                        </Box>
                    ))}
                {this.state.isUseShippingAddressAsBilling && isHalAddress(shippingAddress) && billingCountries && (
                    <Box marginTop={3}>
                        <AddressForm
                            editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.BILLING_ADDRESS, isNewUserFlow)}
                            hasGridLayout={true}
                            isEditMode={isEditMode}
                            address={creditCard.address}
                            country={creditCard.address.country}
                            countryList={billingCountries}
                            isCheckout={true}
                            isBillingAddress={true}
                            ref={comp => {
                                if (comp !== null) {
                                    this.addressForm = comp;
                                }
                            }}
                        />
                    </Box>
                )}
                {isGuestCheckout || (
                    <Box marginTop={3}>
                        {isEditMode || (
                            <Checkbox
                                paddingY={2}
                                checked={isSaveCreditCardForFutureUse}
                                onClick={this.saveCreditCardOnChange}
                                data-at={Sephora.debug.dataAt('save_card_label')}
                                name='SaveCreditCard'
                            >
                                {saveCardCheckboxText}
                            </Checkbox>
                        )}
                        {displayDefaultCheckbox && (
                            <Checkbox
                                disabled={creditCardIsDefaultPayment && isFirstCreditCard}
                                paddingY={2}
                                checked={isMarkAsDefault}
                                onClick={this.markAsDefaultOnChange}
                                data-at={Sephora.debug.dataAt('make_default_card_label')}
                                name='MarkAsDefault'
                            >
                                {makeDefaultCheckboxText}
                            </Checkbox>
                        )}
                    </Box>
                )}
            </div>
        );

        return isSMUI() && !isFirstCreditCard ? (
            <Modal
                isOpen={this.state.isOpen}
                onDismiss={this.closeCreditCardForm}
            >
                <Modal.Header>
                    <Modal.Title>{creditCard.creditCardId ? editCardTitle : addNewCardTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!isEditMode && localeUtils.isCanada() && (
                        <Text
                            is='p'
                            fontSize='sm'
                            marginBottom='.5em'
                            color='gray'
                        >
                            {debitCardDisclaimer}
                        </Text>
                    )}
                    {creditCardFormContainer}
                </Modal.Body>
                <Modal.Footer>
                    <Grid
                        fill={true}
                        gap={4}
                    >
                        <Box>
                            <Button
                                variant='secondary'
                                block={true}
                                onClick={this.closeCreditCardForm}
                                children={cancelButton}
                                data-at={Sephora.debug.dataAt('cancel_btn')}
                            />
                        </Box>
                        <Box>
                            <Button
                                variant='primary'
                                block={true}
                                onClick={this.validateCreditCardFormDebounced}
                                children={saveContinueButton}
                                data-at={Sephora.debug.dataAt('save_continue_btn')}
                            />
                        </Box>
                    </Grid>
                </Modal.Footer>
            </Modal>
        ) : (
            <div>
                {isNewUserFlow || (
                    <Flex
                        alignItems='center'
                        marginBottom={4}
                    >
                        <div>
                            <Text
                                is='h2'
                                lineHeight='tight'
                                fontWeight='bold'
                                fontSize='md'
                            >
                                {isEditMode ? editCardTitle : addNewCardTitle}
                            </Text>
                            {!isEditMode && localeUtils.isCanada() && (
                                <Text
                                    display='block'
                                    fontSize='sm'
                                    color='gray'
                                >
                                    {debitCardDisclaimer}
                                </Text>
                            )}
                        </div>
                        {isEditMode || (
                            <Box
                                fontSize='3xl'
                                marginLeft={4}
                            >
                                <PaymentLogo
                                    paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                                    isMultiCardMode={true}
                                    cardType={cardType}
                                />
                            </Box>
                        )}
                    </Flex>
                )}

                {creditCardFormContainer}

                {isNewUserFlow && isGiftCardShow && (
                    <React.Fragment>
                        <Divider marginY={5} />
                        <GiftCardSection
                            hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                            editSectionName={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.GIFT_CARD_FORM)}
                            ref={comp => (this.giftCardSection = comp)}
                        />
                    </React.Fragment>
                )}

                {isGuestCheckout && shouldShowPromotion && (
                    <Box display={['block', 'none']}>
                        <Divider marginY={5} />
                        <CheckoutPromoSection />
                    </Box>
                )}

                {isGuestCheckout && <GuestSavePointsCheckbox />}

                <Media lessThan='sm'>
                    <CheckoutTermsConditions />
                </Media>
                <Flex
                    marginTop={isGuestCheckout && [null, 6]}
                    alignItems='baseline'
                >
                    {isGuestCheckout ? (
                        <PlaceOrderButton
                            block={[true, false]}
                            isBopis={isBopis}
                        />
                    ) : (
                        <AccordionButton onClick={this.validateCreditCardFormDebounced} />
                    )}
                    {isNewUserFlow || (
                        <Link
                            color='blue'
                            padding={3}
                            marginLeft={3}
                            onClick={this.closeCreditCardForm}
                        >
                            {cancelButton}
                        </Link>
                    )}
                </Flex>

                {isGuestCheckout && (
                    <Box display={['block', 'none']}>
                        <TestTarget
                            testName='creditCardBanners'
                            source='checkout'
                            testEnabled
                            testComponent={CreditCardBanner}
                            marginTop={5}
                        />
                    </Box>
                )}

                <Media greaterThan='xs'>
                    <CheckoutTermsConditions />
                </Media>
            </div>
        );
    }
}

export default wrapComponent(CheckoutCreditCardForm, 'CheckoutCreditCardForm');
