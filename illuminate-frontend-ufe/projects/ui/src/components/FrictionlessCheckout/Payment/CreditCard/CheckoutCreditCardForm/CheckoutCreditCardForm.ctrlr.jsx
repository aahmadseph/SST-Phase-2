/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React, { createRef } from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Flex, Button, Divider, Grid, Icon
} from 'components/ui';
import { forms, space, colors } from 'style/config';
import RwdAddressForm from 'components/Addresses/RwdAddressForm';
import AccordionButton from 'components/FrictionlessCheckout/LayoutCard/AccordionButton';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import creditCardUtils from 'utils/CreditCard';
import OrderUtils from 'utils/Order';
import CheckoutUtils from 'utils/Checkout';
import FormsUtils from 'utils/Forms';
import ErrorConstants from 'utils/ErrorConstants';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentLogo from 'components/FrictionlessCheckout/Payment/PaymentLogo/PaymentLogo';
import GiftCardSection from 'components/RwdCheckout/Sections/Payment/GiftCardSection';
import CheckoutTermsConditions from 'components/RwdCheckout/CheckoutTermsConditions';
import CreditCard from 'components/FrictionlessCheckout/Payment/CreditCard';
import ErrorMsg from 'components/ErrorMsg';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import checkoutUtils from 'utils/Checkout';
import Location from 'utils/Location';
import deepExtend from 'utils/deepExtend';
import ErrorsUtils from 'utils/Errors';
import debounceUtils from 'utils/Debounce';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Empty from 'constants/empty';
import UIUtils from 'utils/UI';
import mediaUtils from 'utils/Media';
import OrderActions from 'actions/OrderActions';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

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
            invalidCreditCardNumber: false,
            creditCard: this.props.creditCard
        };
        this.cardExpirationDateInput = createRef();
        this.cardMonthInput = createRef();
        this.cardYearInput = createRef();
        this.showExpirationFieldsCombined = !this.props.isEditMode;
        this.unSubscribePaymentCardDetected = null;
        this.unSubscribeUpdateOrder = null;
        this.unSubscribeToggleCVCModal = null;
    }

    componentDidMount() {
        this.unSubscribePaymentCardDetected = this.props.watchPaymentCardDetected(this);

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

            this.unSubscribeUpdateOrder = this.props.watchUpdateOrder(this);

            const isPaymentComplete = this.isPaymentInOrderCompleteForGuestUser();
            this.props.togglePlaceOrderDisabled(!isPaymentComplete);
        } else {
            this.props.togglePlaceOrderDisabled(true);
        }

        this.unSubscribeToggleCVCModal = this.props.watchToogleCVCModal(this);

        this.props.checkAgentAware(this);

        this.props.isEditMode && this.cardMonthInput.current && this.cardMonthInput.current.focus();
    }

    closeCreditCardForm = () => {
        if (isSMUI()) {
            this.setState({ isOpen: false }, this.props.cancelCallback());
        } else {
            this.props.cancelCallback();
        }

        this.props.clearNamedSectionErrors([SECTION_NAMES.PAYMENT]);
    };

    openCVCModal = e => {
        e.preventDefault();
        this.props.openCVCModal(true);
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

        if (this.unSubscribePaymentCardDetected) {
            this.unSubscribePaymentCardDetected();
        }

        if (this.unSubscribeUpdateOrder) {
            this.unSubscribeUpdateOrder();
        }

        if (this.unSubscribeToggleCVCModal) {
            this.unSubscribeToggleCVCModal();
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

                const { commonOrderToggleActions, setNewCardActions, swapPaypalToCreditCard } = this.props;

                commonOrderToggleActions();

                if (!checkoutUtils.isGuestOrder()) {
                    this.props.sectionSaved(Location.getLocation().pathname, this);

                    const { defaultPayment } = this.props;

                    processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
                        data: {
                            paymentType: defaultPayment
                        }
                    });
                }

                this.props
                    .refreshCheckout()()
                    .then(() => {
                        setNewCardActions();
                        swapPaypalToCreditCard();
                        this.props.callback(false);
                        const orderId = OrderUtils.getOrderId();
                        this.props.getCreditCards(orderId);
                    });

                return Promise.resolve();
            })
            .catch(errorData => {
                ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                this.props.setCheckoutSectionErrors({ Payment: true });

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
                FrictionlessCheckoutBindings.setSectionLevelErrorAnalytics(SECTION_NAMES.PAYMENT);
                this.props.setCheckoutSectionErrors({ Payment: true });

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

    luhnCheck = code => {
        const digits = String(code ?? '').replace(/\D/g, '');

        if (digits.length === 0) {
            return false;
        }

        const len = digits.length;
        const parity = len % 2;
        let sum = 0;

        for (let i = len - 1; i >= 0; i--) {
            let d = parseInt(digits.charAt(i), 10);

            if (i % 2 === parity) {
                d *= 2;
            }

            if (d > 9) {
                d -= 9;
            }

            sum += d;
        }

        return sum % 10 === 0;
    };

    isValidCardLength = (digits, cardType) => {
        const digitCount = digits.length;

        switch (cardType) {
            case 'visa':
                return [13, 16, 19].includes(digitCount);
            case 'masterCard':
                return digitCount === 16;
            case 'americanExpress':
                return digitCount === 15;
            case 'discover':
                return [16, 19].includes(digitCount);
            case 'PLCC':
            case 'CBVI':
                return digitCount === 16;
            default:
                return true;
        }
    };

    handleCardNumberBlur = () => {
        const {
            localization: { enterValidCardNumber }
        } = this.props;

        const { creditCard, cardType } = this.state;

        const raw = creditCard?.formattedCardNumber || '';
        const digits = (raw || '').replace(/\s+/g, '');

        if (FormValidator.isEmpty(digits)) {
            this.setState({ invalidCreditCardNumber: false });

            return;
        }

        const luhnValid = this.luhnCheck(digits);
        const lengthValid = this.isValidCardLength(digits, cardType);
        const isValid = luhnValid && lengthValid;

        if (!isValid) {
            const errorMessage = enterValidCardNumber;
            this.cardNumberInput.showError(errorMessage, digits, ErrorConstants.ERROR_CODES.CREDIT_CARD_IS_INVALID);
        }

        this.setState({ invalidCreditCardNumber: !isValid });
    };

    handleCardNumberOnFocus = () => {
        this.setState({ invalidCreditCardNumber: false });
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
        const {
            isSaveCreditCardForFutureUse, isMarkAsDefault, creditCard, cardType, invalidCreditCardNumber
        } = this.state;

        const {
            isEditMode,
            shippingAddress,
            isFirstCreditCard,
            billingCountries,
            isNewUserFlow,
            isGiftCardShow,
            hasAutoReplenishItemInBasket,
            defaultPayment,
            hideCancelButton,
            localization: {
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
                cancelButton,
                useThisCard
            }
        } = this.props;

        const currentCardType = OrderUtils.PAYMENT_TYPE.CREDIT_CARD[this.state.cardType];
        const isAMEXCard = currentCardType === OrderUtils.PAYMENT_TYPE.CREDIT_CARD.americanExpress;
        const displayDefaultCheckbox = isEditMode ? creditCardUtils.isSavedToProfile(this.props.creditCard.creditCardId) : true;
        const isGuestCheckout = CheckoutUtils.isGuestOrder();
        const securityCodeLength = isAMEXCard ? FormValidator.FIELD_LENGTHS.securityCodeAmex : FormValidator.FIELD_LENGTHS.securityCode;
        const { isHalAddress } = OrderUtils;
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';

        return (
            <Box maxWidth={'100%'}>
                {this.state.errorMessage && (
                    <ErrorMsg
                        marginTop={2}
                        children={this.state.errorMessage}
                    />
                )}
                {isNewUserFlow || (
                    <Box
                        alignItems='center'
                        marginBottom={isEditMode ? 2 : 4}
                    >
                        <div>
                            <Text
                                is='h2'
                                lineHeight='tight'
                                fontWeight='bold'
                                marginY={[4]}
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
                            <Box fontSize='2xl'>
                                <PaymentLogo
                                    paymentGroupType={OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD}
                                    isMultiCardMode={true}
                                    cardType={cardType}
                                />
                            </Box>
                        )}
                    </Box>
                )}

                <Box
                    data-at='credit-card-form-container'
                    marginBottom={[4, null]}
                >
                    <Box maxWidth={['100%', 380]}>
                        <Grid
                            gap={FORM_GUTTER}
                            gridTemplateColumns={[null, isEditMode ? null : '1fr 1fr']}
                        >
                            {isEditMode ? (
                                <Box marginBottom={4}>
                                    <CreditCard creditCard={creditCard} />
                                </Box>
                            ) : (
                                <Box
                                    position='relative'
                                    css={{
                                        gridColumn: '1 / -1'
                                    }}
                                >
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
                                        onBlur={this.handleCardNumberBlur}
                                        onFocus={this.handleCardNumberOnFocus}
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
                                    {invalidCreditCardNumber && (
                                        <Flex
                                            alignItems='center'
                                            position='absolute'
                                            top={`${forms.BORDER_WIDTH}px`}
                                            right={`${PAYMENT_LOGO_OFFSET}px`}
                                            height={forms.HEIGHT - forms.BORDER_WIDTH * 2}
                                            css={{ pointerEvents: 'none' }}
                                            zIndex={2}
                                        >
                                            <Icon
                                                name='alert'
                                                size={16}
                                                marginRight='4px'
                                                color={colors.red}
                                            />
                                        </Flex>
                                    )}
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
                                            !cardType || invalidCreditCardNumber
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
                            rowGap={0}
                            gridTemplateColumns={this.showExpirationFieldsCombined ? '1fr 1fr' : ['1fr 1fr 1fr', '1fr 1fr']}
                        >
                            {!this.showExpirationFieldsCombined && (
                                <TextInput
                                    label={'MM'}
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
                                    label={'YY'}
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
                                value={creditCard?.securityCode}
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
                        </Grid>

                        <Grid
                            gap={FORM_GUTTER}
                            gridTemplateColumns={['null null']}
                        >
                            <TextInput
                                label={firstNameText}
                                autoComplete='cc-given-name'
                                autoCorrect='off'
                                name='firstName'
                                marginBottom={0}
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
                                                css={styles.wrapText}
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
                    </Box>

                    {this.state.isUseShippingAddressAsBilling ||
                        (billingCountries && (
                            <Box marginTop={3}>
                                <RwdAddressForm
                                    editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.BILLING_ADDRESS, isNewUserFlow)}
                                    hasGridLayout={true}
                                    isEditMode={isEditMode}
                                    hasZipInASeperateLine={true}
                                    hasCustomAddressStyle={true}
                                    address={creditCard.address}
                                    country={creditCard.address.country}
                                    countryList={billingCountries}
                                    isCheckout={true}
                                    isBillingAddress={true}
                                    isFrictionless
                                    onRef={comp => {
                                        if (comp !== null) {
                                            this.addressForm = comp;
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    {this.state.isUseShippingAddressAsBilling && isHalAddress(shippingAddress) && billingCountries && (
                        <Box marginTop={3}>
                            <RwdAddressForm
                                editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.BILLING_ADDRESS, isNewUserFlow)}
                                hasGridLayout={true}
                                isEditMode={isEditMode}
                                hasZipInASeperateLine={true}
                                hasCustomAddressStyle={true}
                                address={creditCard.address}
                                country={creditCard.address.country}
                                countryList={billingCountries}
                                isCheckout={true}
                                isBillingAddress={true}
                                isFrictionless
                                onRef={comp => {
                                    if (comp !== null) {
                                        this.addressForm = comp;
                                    }
                                }}
                            />
                        </Box>
                    )}
                    {isGuestCheckout || (
                        <Box>
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
                </Box>

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

                <Media lessThan='sm'>
                    <CheckoutTermsConditions
                        marginTop={0}
                        paddingTop={space[1]}
                        paddingBottom={[space[1], 0]}
                    />
                </Media>
                <Grid
                    gap={FORM_GUTTER}
                    gridTemplateColumns={'1fr 1fr'}
                    marginTop={4}
                    maxWidth={400}
                >
                    {isNewUserFlow || hideCancelButton || (
                        <Button
                            variant='secondary'
                            block={true}
                            onClick={this.closeCreditCardForm}
                            children={cancelButton}
                            data-at={Sephora.debug.dataAt('cancel_btn')}
                        />
                    )}

                    {/* For guest users, show Use This Card button instead of Place Order */}
                    <AccordionButton
                        onClick={this.validateCreditCardFormDebounced}
                        marginTop={null}
                        customStyle={styles}
                        btnText={useThisCard}
                    />
                </Grid>
                <Media greaterThan='xs'>
                    <CheckoutTermsConditions
                        marginTop={0}
                        paddingTop={space[1]}
                        paddingBottom={[space[1], 0]}
                    />
                </Media>
            </Box>
        );
    }
}

const styles = {
    button: {
        minWidth: '100%'
    },
    wrapText: {
        whiteSpace: 'wrap'
    }
};

export default wrapComponent(CheckoutCreditCardForm, 'CheckoutCreditCardForm');
