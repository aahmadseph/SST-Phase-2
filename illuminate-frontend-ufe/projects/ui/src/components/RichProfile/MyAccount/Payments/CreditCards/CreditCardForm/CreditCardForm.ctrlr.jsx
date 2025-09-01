/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import AddressForm from 'components/Addresses/AddressForm/AddressForm';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import Select from 'components/Inputs/Select/Select';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import CVCInfoModal from 'components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';
import UI from 'utils/UI';
import Date from 'utils/Date';
import FormsUtils from 'utils/Forms';
import OrderUtils from 'utils/Order';
import ErrorList from 'components/ErrorList';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import actions from 'actions/Actions';
import OrderActions from 'actions/OrderActions';
import profileApi from 'services/api/profile';
import errorsUtils from 'utils/Errors';
import ErrorConstants from 'utils/ErrorConstants';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import { TOGGLE_CVC_INFO_MODAL } from 'constants/actionTypes/order';

const { detectSephoraCard, CREDIT_CARD_TYPES } = OrderUtils;
const { getLocaleResourceFile, COUNTRIES } = localeUtils;

const getText = getLocaleResourceFile('components/RichProfile/MyAccount/Payments/CreditCards/CreditCardForm/locales', 'CreditCardForm');

/* eslint-disable-next-line complexity */
class CreditCardForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            errorMessages: null,
            cardType: null,
            expMonth: null,
            expYear: null,
            securityCode: null,
            billingCountries: null,
            defaultCountryCode: null,
            isDefault: false,
            selectedCountry: this.props.country,
            canSephoraCardBeDefault: true
        };

        this.cardNumberInput = null;
        this.securityCodeInput = null;

        const cardTypes = { ...OrderUtils.CREDIT_CARD_TYPES };

        if (!Sephora.fantasticPlasticConfigurations.isGlobalEnabled) {
            delete cardTypes.SEPHORA;
            this.state.canSephoraCardBeDefault = false;
        }

        this.cardTypes = cardTypes;
    }

    removeLeadingZero(stringNumber) {
        return stringNumber ? stringNumber.replace(/^0+(\d+)/, '$1') : stringNumber;
    }

    componentDidMount() {
        const isEditMode = this.props.isEditMode;
        const card = this.props.creditCard;
        const { creditCardIsDefaultPayment } = this.props;

        this.setState(
            {
                expMonth: isEditMode ? this.removeLeadingZero(card.expirationMonth) : null,
                expYear: isEditMode ? card.expirationYear : null,
                isDefault: isEditMode ? creditCardIsDefaultPayment && card.isDefault : this.state.canSephoraCardBeDefault,
                isCardExpired: isEditMode && card.isExpired,
                cardType: isEditMode ? this.getCardTypeForDropdown(card.cardType) : this.getDefaultCardType()
            },
            () => {
                //TODO: remove these setValue once select is fixed
                if (this.cardTypeSelect) {
                    this.cardTypeSelect.setValue(this.state.cardType);
                }

                if (this.expMonthSelect) {
                    this.expMonthSelect.setValue(this.state.expMonth);
                }

                if (this.expYearSelect) {
                    this.expYearSelect.setValue(this.state.expYear);
                }
            }
        );

        store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
            const actionInfoButton = this.refs.securityCodeInput.getInfoActionButtonRef();

            if (actionInfoButton && data.isOpen === false) {
                actionInfoButton.focus();
            }
        });
    }

    // For API, treat Sephora Card as Private Label or Co-branded
    getCardTypeForAPI = (cardType, cardNumber) => {
        return cardType === CREDIT_CARD_TYPES.SEPHORA.name ? detectSephoraCard(cardNumber) : cardType;
    };

    // For Dropdown, treat Private Label and Co-branded as Sephora Card
    getCardTypeForDropdown = cardType => {
        return Object.values(SEPHORA_CARD_TYPES).indexOf(cardType) > -1 ? CREDIT_CARD_TYPES.SEPHORA.name : cardType;
    };

    getDefaultCardType = () => {
        return this.props.country !== 'CA' && this.cardTypes.SEPHORA ? this.cardTypes.SEPHORA.name : null;
    };

    getSecurityCodeLength = cardType => {
        let isAMEXCard = false;

        if (
            cardType === OrderUtils.CREDIT_CARD_TYPES.AMERICAN_EXPRESS.name ||
            cardType === OrderUtils.CREDIT_CARD_TYPES.AMERICAN_EXPRESS.displayName
        ) {
            isAMEXCard = true;
        }

        return isAMEXCard ? FormValidator.FIELD_LENGTHS.securityCodeAmex : FormValidator.FIELD_LENGTHS.securityCode;
    };

    handleCardTypeSelect = e => {
        const cardType = e.target.value;
        const newState = {
            cardType,
            emptyCardType: false,
            cardTypeInvalid: false
        };

        if (this.state.canSephoraCardBeDefault) {
            newState.isDefault = cardType === this.cardTypes.SEPHORA.name;
        }

        this.setState(newState);
        this.cardTypeSelect.setValue(cardType);
    };

    handleExpMonthSelect = e => {
        this.setState({
            expMonth: e.target.value,
            emptyMonth: false
        });
        this.expMonthSelect.setValue(e.target.value);
    };

    handleExpYearSelect = e => {
        const creditCard = this.props.creditCard;
        const isCardExpired = this.props.isEditMode && creditCard.isExpired && e.target.value <= this.props.creditCard.expirationYear;

        this.setState({
            expYear: e.target.value,
            isCardExpired,
            emptyYear: false
        });
        this.expYearSelect.setValue(e.target.value);
    };

    handleCvcChange = e => {
        const sanitizedSecurityCode = UI.isAndroid()
            ? e.target.value.replace('.', '')
            : FormValidator.replaceDotSeparator(e.target.value, this.refs.securityCodeInput);

        this.setState({
            securityCode: sanitizedSecurityCode,
            emptySecurityCode: false
        });
    };

    handleIsDefault = e => {
        this.setState({ isDefault: e.target.checked });
    };

    handleDeleteCardClick = e => {
        e.preventDefault();

        //variable declaration here for clarity
        const title = getText('deleteCreditCard');
        const message = getText('areYouSureYouWouldLikeToDelete');
        const confirmButtonText = getText('yes');
        const callback = this.deleteCreditCard;
        const hasCancelButton = true;
        const hasCloseButton = true;
        const cancelButtonText = getText('no');

        store.dispatch(
            actions.showInfoModal({
                isOpen: true,
                title: title,
                message: message,
                buttonText: confirmButtonText,
                callback: callback,
                showCancelButton: hasCancelButton,
                cancelText: cancelButtonText,
                showCloseButton: hasCloseButton,
                dataAtTitle: 'remove_credit_card_title',
                dataAtButton: 'remove_credit_card_btn',
                dataAtCancelButton: 'remove_credit_card_cancel_btn'
            })
        );
    };

    showDefaultCardErrorModal = () => {
        const title = getText('accountUpdateModal');
        store.dispatch(
            actions.showInfoModal({
                isOpen: true,
                title,
                message: getText('deleteDefaultCardErrorModal'),
                buttonText: getText('done')
            })
        );
    };

    deleteCreditCard = () => {
        const creditCard = this.props.creditCard;

        if (creditCard.isDefault && this.props.allCreditCards[1]) {
            //need to set next card in list to default before deleting.
            profileApi
                .setDefaultCreditCardOnProfile(this.props.allCreditCards[1].creditCardId)
                .then(() => {
                    profileApi
                        .removeCreditCardFromProfile(this.props.userProfileId, creditCard.creditCardId)
                        .then(() => {
                            this.props.updateCardsCallback();
                        })
                        .catch(errorData => {
                            // When trying to remove the card, we can have an error if the card is used in a
                            // subscription (Auto Replenish or SDU)
                            if (errorData.errors) {
                                // If that's the case, set that card as the default one again, since there's
                                // no way to know if a card is being used in suscriptions until we try to delete it
                                profileApi.setDefaultCreditCardOnProfile(creditCard.creditCardId);
                            }

                            errorsUtils.collectAndValidateBackEndErrors(errorData, this);
                        });
                })
                // Make sure to show an error if there's an error setting the default card
                .catch(errorData => {
                    this.showDefaultCardErrorModal();
                    errorsUtils.collectAndValidateBackEndErrors(errorData, this);
                });
        } else {
            profileApi
                .removeCreditCardFromProfile(this.props.userProfileId, this.props.creditCard.creditCardId)
                .then(() => {
                    this.props.updateCardsCallback();
                })
                .catch(errorData => errorsUtils.collectAndValidateBackEndErrors(errorData, this));
        }
    };

    validateSecurityCode = securityCode => {
        const { creditCard } = this.props;

        if (FormValidator.isEmpty(securityCode)) {
            return errorsUtils.getMessage(ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE);
        } else if (securityCode.length < this.getSecurityCodeLength(creditCard ? creditCard.cardType : this.state.cardType)) {
            return errorsUtils.getMessage(ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH);
        }

        return null;
    };

    validateCreditCardForm = e => {
        e.preventDefault();

        // Clear out previous errors
        let hasErrors = false;
        this.setState({
            errorMessages: null,
            emptyCardType: false,
            emptyMonth: false,
            emptyYear: false,
            emptySecurityCode: false
        });

        const isAddressValid = this.addressForm.validateForm();

        const cardNumberErrors = !this.props.isEditMode ? FormValidator.getErrors([this.cardNumberInput]) : {};
        const cvcErrors = FormValidator.getErrors([this.securityCodeInput]);

        if (cardNumberErrors?.fields?.length || cvcErrors?.fields?.length) {
            hasErrors = true;
        }

        // Check if card type is blank if not in edit mode, also check if expiration month, year
        // and security code are blank for all cards
        const emptyCardTypeOrExpiration =
            (!this.state.cardType && !this.props.isEditMode) || !this.state.expMonth || !this.state.expYear || !this.state.securityCode;

        if (emptyCardTypeOrExpiration) {
            hasErrors = true;
            this.setState({
                emptyCardType: !this.state.cardType,
                emptyMonth: !this.state.expMonth,
                emptyYear: !this.state.expYear,
                emptySecurityCode: !this.state.securityCode
            });
        }

        if (isAddressValid && !hasErrors) {
            this.createOrUpdateCreditCard();
        }
    };

    createOrUpdateCreditCard = () => {
        const addressData = this.addressForm.getData().address;

        const creditCardInfo = {
            isMarkAsDefault: this.state.isDefault,
            creditCard: {
                firstName: addressData.firstName,
                lastName: addressData.lastName,
                address: {
                    address1: addressData.address1,
                    address2: addressData.address2,
                    city: addressData.city,
                    state: addressData.state,
                    postalCode: addressData.postalCode,
                    country: addressData.country,
                    phone: addressData.phone
                }
            }
        };

        creditCardInfo.creditCard.expirationMonth = this.state.expMonth;
        creditCardInfo.creditCard.expirationYear = this.state.expYear;
        creditCardInfo.creditCard.securityCode = this.state.securityCode;

        if (this.props.isEditMode) {
            creditCardInfo.creditCard.creditCardId = this.props.creditCard.creditCardId;
        } else {
            creditCardInfo.creditCard.cardType = this.getCardTypeForAPI(this.state.cardType, this.state.cardNumber);
            creditCardInfo.creditCard.cardNumber = this.cardNumberInput.getValue();
        }

        const method =
            creditCardInfo && creditCardInfo.creditCard && creditCardInfo.creditCard.creditCardId
                ? profileApi.updateCreditCardOnProfile
                : profileApi.addCreditCardToProfile;

        method(creditCardInfo)
            .then(() => {
                this.props.updateCardsCallback();
            })
            .catch(errorData => errorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    showError = (message, value, errorKey) => {
        if (this.addressForm && !this.addressForm.handleResponseError(message, value, errorKey)) {
            const newState = {};

            switch (errorKey) {
                case ErrorConstants.ERROR_CODES.EXPIRATION_MONTH_INVALID:
                    newState.isCardExpired = true;

                    break;
                case ErrorConstants.ERROR_CODES.CREDIT_CARD_NUMBER_INVALID:
                    newState.creditCardNumInvalid = true;

                    break;
                default:
                    break;
            }

            newState.errorMessages = [message];
            this.setState(newState);
        }
    };

    showCVCInfoModal = () => {
        const action = OrderActions.showCVCInfoModal(true);
        store.dispatch(action);
    };

    onCountryChange = country => {
        // if user is adding a new credit card, if they try to change country to
        // anything but US and they have already selected a Discover cardtype,
        // then clear out all credit card data that was previously entered
        if (!this.props.isEditMode && country !== COUNTRIES.US && this.state.cardType === this.cardTypes.DISCOVER.name) {
            this.setState({
                cardType: '',
                expYear: '',
                expMonth: '',
                securityCode: '',
                cardNumber: '',
                selectedCountry: country
            });
        } else {
            this.setState({ selectedCountry: country });
        }
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isEditMode, creditCard, cancelAddOrEditCardCallback, countryList, country
        } = this.props;

        const disableSpecificCardTypes = localeUtils.isCanada() || this.state.selectedCountry !== localeUtils.COUNTRIES.US;

        const expirationYear = this.state.expYear ? this.state.expYear.toString() : '';

        const isDiscoverCard = cardType => this.cardTypes[cardType] === this.cardTypes.DISCOVER;

        return (
            <Box
                is='form'
                action=''
                width={Sephora.isDesktop() ? '75%' : null}
            >
                <Box marginBottom={5}>
                    <Text
                        is='h2'
                        fontSize='md'
                        fontWeight='bold'
                    >
                        {this.props.isEditMode ? getText('editCreditCard') : getText('addCreditCard')}
                    </Text>
                    {!isEditMode && localeUtils.isCanada() && (
                        <Text
                            is='p'
                            fontSize='sm'
                            color='gray'
                        >
                            {getText('debitCardDisclaimer')}
                        </Text>
                    )}
                </Box>
                <ErrorList errorMessages={this.state.errorMessages} />

                {isEditMode ? (
                    <Text
                        is='p'
                        marginBottom={4}
                    >
                        <b>{getText('cardType')}</b>
                        <br />
                        {creditCard.cardType}
                    </Text>
                ) : (
                    <Select
                        label={getText('cardType')}
                        autoComplete='cc-type'
                        name='cardType'
                        value={this.state.cardType}
                        required={true}
                        invalid={this.state.cardTypeInvalid || this.state.emptyCardType}
                        onChange={this.handleCardTypeSelect}
                        message={this.state.emptyCardType ? getText('cardTypeRequired') : null}
                        ref={comp => (this.cardTypeSelect = comp)}
                    >
                        {Object.keys(this.cardTypes).map(cardType => (
                            <option
                                key={this.cardTypes[cardType].name}
                                disabled={disableSpecificCardTypes && isDiscoverCard(cardType)}
                                value={this.cardTypes[cardType].name}
                            >
                                {this.cardTypes[cardType].displayName}
                            </option>
                        ))}
                    </Select>
                )}
                {isEditMode ? (
                    <Text
                        is='p'
                        marginBottom={4}
                        data-at={Sephora.debug.dataAt('credit_card_number')}
                    >
                        <b>{getText('cardNumber')}</b>
                        <br />
                        {creditCard.cardNumber}
                    </Text>
                ) : (
                    <TextInput
                        name='cardNumber'
                        label={getText('cardNumber')}
                        autoComplete='cc-number'
                        autoCorrect='off'
                        required={true}
                        type='tel'
                        maxLength={FormValidator.FIELD_LENGTHS.creditCard}
                        value={this.state.cardNumber}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        invalid={this.state.creditCardNumInvalid}
                        ref={comp => (this.cardNumberInput = comp)}
                        validate={cardNumber => {
                            if (FormValidator.isEmpty(cardNumber)) {
                                return getText('cardNumberRequired');
                            }

                            return null;
                        }}
                    />
                )}
                <LegacyGrid gutter={3}>
                    <LegacyGrid.Cell width={1 / 3}>
                        <Select
                            label={getText('mm')}
                            autoComplete='cc-exp-month'
                            name='expMonth'
                            value={this.state.expMonth}
                            required={true}
                            onChange={this.handleExpMonthSelect}
                            invalid={this.state.isCardExpired || this.state.emptyMonth}
                            message={this.state.emptyMonth ? getText('expirationMonthRequired') : null}
                            ref={comp => (this.expMonthSelect = comp)}
                        >
                            {Date.getNumericMonthArray().map((month, index) => (
                                <option
                                    key={month || index.toString()}
                                    value={index + 1}
                                >
                                    {month}
                                </option>
                            ))}
                        </Select>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell width={1 / 3}>
                        <Select
                            label={getText('yy')}
                            autoComplete='cc-exp-year'
                            name='expYear'
                            value={expirationYear}
                            required={true}
                            onChange={this.handleExpYearSelect}
                            invalid={this.state.isCardExpired || this.state.emptyYear}
                            message={this.state.emptyYear ? getText('expirationYearRequired') : null}
                            ref={comp => (this.expYearSelect = comp)}
                        >
                            {creditCard && creditCard.isExpired && <option value={creditCard.expirationYear}>{creditCard.expirationYear}</option>}
                            {Date.getCreditCardExpYears().map(year => {
                                const selected = year === expirationYear ? 'selected' : false;

                                return (
                                    <option
                                        key={year}
                                        selected={selected}
                                        value={year}
                                    >
                                        {year}
                                    </option>
                                );
                            })}
                        </Select>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell width={1 / 3}>
                        <TextInput
                            label={getText('cvc')}
                            autoComplete='cc-csc'
                            autoCorrect='off'
                            infoAction={this.showCVCInfoModal}
                            infoLabel={getText('moreInfoCvc')}
                            name='securityCode'
                            required={true}
                            inputMode='numeric'
                            onKeyDown={Sephora.isDesktop() && FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            onChange={this.handleCvcChange}
                            maxLength={this.getSecurityCodeLength(creditCard ? creditCard.cardType : this.state.cardType)}
                            value={this.state.securityCode}
                            invalid={this.state.emptySecurityCode}
                            ref={comp => (this.securityCodeInput = comp)}
                            data-at={Sephora.debug.dataAt('cvv_input')}
                            dataAtError={Sephora.debug.dataAt('enter_security_code_error')}
                            validate={this.validateSecurityCode}
                        />
                    </LegacyGrid.Cell>
                </LegacyGrid>
                <AddressForm
                    editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.PROFILE.BILLING_ADDRESS)}
                    isBillingAddress
                    isEditMode={isEditMode}
                    address={isEditMode ? creditCard.address : null}
                    countryList={countryList}
                    country={country}
                    onCountryChange={this.onCountryChange}
                    disableCountryList={isEditMode && isDiscoverCard(creditCard.cardType.toUpperCase())}
                    ref={comp => (this.addressForm = comp)}
                />
                <Box marginTop={4}>
                    <Checkbox
                        checked={this.state.isDefault}
                        onClick={this.handleIsDefault}
                        name='is_default'
                    >
                        {getText('setAsDefaultCreditCard')}
                    </Checkbox>
                </Box>
                {isEditMode && (
                    <Link
                        data-at={Sephora.debug.dataAt('cc_delete_btn')}
                        color='blue'
                        paddingY={2}
                        marginTop={3}
                        onClick={this.handleDeleteCardClick}
                    >
                        {getText('deleteCreditCard')}
                    </Link>
                )}
                <LegacyGrid
                    fill={true}
                    gutter={3}
                    marginTop={3}
                >
                    <LegacyGrid.Cell>
                        <Button
                            data-at={Sephora.debug.dataAt('cc_cancel_btn')}
                            variant='secondary'
                            block={true}
                            onClick={cancelAddOrEditCardCallback}
                        >
                            {getText('cancel')}
                        </Button>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell>
                        <Button
                            data-at={Sephora.debug.dataAt(`cc_${isEditMode ? 'update' : 'save'}_btn`)}
                            variant='primary'
                            block={true}
                            type='submit'
                            onClick={this.validateCreditCardForm}
                        >
                            {getText(isEditMode ? 'update' : 'save')}
                        </Button>
                    </LegacyGrid.Cell>
                </LegacyGrid>
                <CVCInfoModal />
            </Box>
        );
    }
}

export default wrapComponent(CreditCardForm, 'CreditCardForm', true);
