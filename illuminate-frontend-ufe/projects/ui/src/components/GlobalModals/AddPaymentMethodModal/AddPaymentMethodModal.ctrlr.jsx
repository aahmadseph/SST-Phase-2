import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { wrapComponent } from 'utils/framework';
import TextInput from 'components/Inputs/TextInput/TextInput';
import AddressForm from 'components/Addresses/AddressForm/AddressForm';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import Select from 'components/Inputs/Select/Select';
import FormValidator from 'utils/FormValidator';
import FormsUtils from 'utils/Forms';
import errorsUtils from 'utils/Errors';
import Date from 'utils/Date';
import store from 'Store';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { PAYMENT_CARDS_DETECTED } from 'constants/actionTypes/order';
import { space, forms } from 'style/config';
import {
    Box, Flex, Grid, Button, Text, Link
} from 'components/ui';
import ErrorConstants from 'utils/ErrorConstants';
import CVCInfoModal from 'components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';
import CreditCardUtils from 'utils/CreditCard';

const PAYMENT_LOGO_WIDTH = 56;
const PAYMENT_LOGO_OFFSET = space[1];

const { isAMEXCard, getSecurityCodeLength } = CreditCardUtils;

class AddPaymentMethodModal extends BaseClass {
    state = {
        isHidden: true,
        cardNumber: '',
        cardType: this.props.isEditMode ? this.props.creditCardForEdit.cardType : '',
        expMonth: this.props.isEditMode ? this.props.creditCardForEdit.expirationMonth : '',
        emptyMonth: false,
        expYear: this.props.isEditMode ? this.props.creditCardForEdit.expirationYear : '',
        emptyYear: false,
        isCardExpired: this.props.isEditMode ? this.props.creditCardForEdit.isExpired : false,
        isDefault: true,
        emptyCardType: false,
        errorMessages: null,
        creditCard: null,
        creditCardId: this.props.isEditMode ? this.props.creditCardForEdit.creditCardId : null,
        isCardDefaultForDelete: this.props.isEditMode ? this.props.creditCardForEdit.isDefault : false,
        isAddCard: false,
        isEditMode: this.props.isEditMode,
        selectedCountry: this.props.profileLocale,
        securityCode: '',
        emptySecurityCode: false
    };

    componentDidMount() {
        const { loadCountries, isEditMode, creditCardForEdit } = this.props;

        loadCountries().then(() => {
            this.setState({
                isHidden: false,
                isDefault: isEditMode ? creditCardForEdit.isDefault : this.state.isDefault
            });
        });
    }

    handleExpMonthSelect = e => {
        this.setState({
            expMonth: e.target.value,
            emptyMonth: false
        });
        this.expMonthSelect.setValue(e.target.value);
    };

    handleExpYearSelect = e => {
        this.setState({
            expYear: e.target.value,
            emptyYear: false
        });
        this.expYearSelect.setValue(e.target.value);
    };

    handleCVCChange = e => {
        this.setState({
            securityCode: FormValidator.replaceDotSeparator(e.target.value, this.cardSecurityCodeInput),
            emptySecurityCode: false
        });
    };

    handleCVCIconClick = e => {
        e.preventDefault();
        this.props.openCVCModal();
    };

    handleIsDefault = e => {
        this.setState({ isDefault: e.target.checked });
    };

    onCountryChange = country => {
        if (country !== this.props.COUNTRIES.US) {
            this.setState({
                cardType: '',
                expYear: '',
                expMonth: '',
                cardNumber: '',
                selectedCountry: country
            });
        } else {
            this.setState({ selectedCountry: this.props.profileLocale });
        }
    };

    updateEditStore = (name, value, isExtraData) => {
        const infoData = {
            editStore: this.props.editStore,
            formName: this.props.formName
        };

        this.props.updateEditDataAction(name, value, isExtraData, infoData);

        this.setState({ cardNumber: value });

        store.watchAction(PAYMENT_CARDS_DETECTED, data => {
            const cardType = data.cardTypes[0];
            const securityCode = this.state.securityCode;

            if (!isAMEXCard(cardType) && securityCode.length > FormValidator.FIELD_LENGTHS.securityCode) {
                // cut extra CVV symbol
                this.cardSecurityCodeInput.setValue(securityCode.substring(0, FormValidator.FIELD_LENGTHS.securityCode));
            }

            this.setState({ cardType: cardType });
        });
    };

    checkCreditCard = e => {
        const cardNumber = e.target.value.replace(/\s/g, '');
        this.props.paymentCardNumberChanged(cardNumber);
        this.updateEditStore('cardNumber', cardNumber);
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
        const errors = FormValidator.getErrors([this.cardNumberInput, this.cardSecurityCodeInput]);

        if (errors.fields && errors.fields.length) {
            hasErrors = true;
        }

        const emptyCardTypeOrExpirationOrCVC =
            (!this.state.cardType && !this.state.isEditMode) || !this.state.expMonth || !this.state.expYear || !this.state.securityCode;

        if (emptyCardTypeOrExpirationOrCVC) {
            hasErrors = true;
            this.setState({
                emptyCardType: !this.state.cardType,
                emptyMonth: !this.state.expMonth,
                emptyYear: !this.state.expYear,
                emptySecurityCode: !this.state.securityCode
            });
        }

        if (isAddressValid && !hasErrors) {
            const addressData = this.addressForm.getData().address;
            const isEditMode = this.state.isEditMode;

            const creditCardData = {
                cardType: this.state.cardType,
                expMonth: this.state.expMonth,
                expYear: this.state.expYear,
                cardNumber: this.state.cardNumber,
                creditCardId: this.state.creditCardId,
                securityCode: this.state.securityCode
            };

            this.props
                .addOrUpdateCreditCard(
                    addressData,
                    this.state.isDefault,
                    isEditMode,
                    creditCardData,
                    this.props.fireGenericErrorAnalytics,
                    this.props.subscriptionType
                )
                .then(() =>
                    this.setState({
                        isAddCard: false,
                        isEditMode: false
                    })
                )
                .then(() => {
                    this.props.onDismiss(false, isEditMode ? 'saveEditedCard' : 'saveAddedCard');
                    this.props.onSavedCard({ isEditMode });
                })
                .catch(errorData => errorsUtils.collectAndValidateBackEndErrors(errorData, this));
        }
    };

    handleDeleteCard = () => {
        this.props.handleRemove(this.props.creditCardForEdit, this.props.rawCreditCards, 'deleteCard');
    };

    handleModalClose = () => {
        const { isEditMode } = this.state;
        this.props.onModalClose(false, isEditMode ? 'editCard' : 'addCard', isEditMode);
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            countries,
            addNewCard,
            editCreditCard,
            cardNumberDisplay,
            creditCardForEdit,
            save,
            cancel,
            cardNumberIncorrect,
            cardNumberRequired,
            expirationMonthRequired,
            expirationYearRequired,
            setDefault,
            update,
            deleteCard,
            cardTypeTitle,
            cardNumberTitle,
            profileLocale,
            mm,
            yy,
            cvc
        } = this.props;

        const { isHidden, cardType, isEditMode } = this.state;
        const expirationYearFromCard = this.state.expYear ? this.state.expYear.toString() : '';
        const securityCodeLength = getSecurityCodeLength(cardType);

        return (
            <>
                <Modal
                    width={0}
                    onDismiss={this.handleModalClose}
                    isOpen={this.props.isOpen}
                    isHidden={isHidden}
                    isDrawer={true}
                    hasBodyScroll={true}
                >
                    <Modal.Header>
                        <Modal.Title children={isEditMode ? editCreditCard : addNewCard} />
                    </Modal.Header>
                    <Modal.Body>
                        {isEditMode ? (
                            <Box>
                                <Text
                                    css={styles.editCardTitle}
                                    is='p'
                                >
                                    <b>{cardTypeTitle}</b>
                                    <br />
                                    {creditCardForEdit.cardType}
                                </Text>
                                <Text
                                    css={styles.editCardTitle}
                                    is='p'
                                >
                                    <b>{cardNumberTitle}</b>
                                    <br />
                                    {creditCardForEdit.cardNumber}
                                </Text>
                            </Box>
                        ) : (
                            <Box position='relative'>
                                <TextInput
                                    label={cardNumberDisplay}
                                    autoComplete='cc-number'
                                    autoCorrect='off'
                                    name='cardNumber'
                                    required={true}
                                    pattern='\d*'
                                    inputMode='numeric'
                                    css={cardType ? styles.cardTypePadding : null}
                                    maxLength={FormValidator.FIELD_LENGTHS.creditCard}
                                    onChange={this.checkCreditCard}
                                    onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                    onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                    ref={comp => (this.cardNumberInput = comp)}
                                    value={isEditMode ? creditCardForEdit.cardNumber : this.state.cardNumber}
                                    invalid={this.state.creditCardNumInvalid || this.state.emptyCardType}
                                    message={this.state.emptyCardType ? cardNumberIncorrect : null}
                                    data-at={Sephora.debug.dataAt('card_number_input')}
                                    dataAtError={Sephora.debug.dataAt('cc_number_required_error')}
                                    validate={cardNumber => {
                                        if (FormValidator.isEmpty(cardNumber)) {
                                            this.props.fireFormErrorAnalytics(isEditMode ? editCreditCard : addNewCard, cardNumberRequired);

                                            return cardNumberRequired;
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
                                        cardNumber={this.state.cardNumber}
                                        paymentGroupType={this.props.paymentGroupType}
                                    />
                                </Flex>
                            </Box>
                        )}
                        <Grid
                            columns={3}
                            gap={3}
                        >
                            <Select
                                label={mm}
                                autoComplete='cc-exp-month'
                                name='expMonth'
                                value={this.state.expMonth}
                                required={true}
                                onChange={this.handleExpMonthSelect}
                                invalid={this.state.isCardExpired || this.state.emptyMonth}
                                message={this.state.emptyMonth ? expirationMonthRequired : null}
                                ref={comp => (this.expMonthSelect = comp)}
                            >
                                {this.state.emptyMonth &&
                                    this.props.fireFormErrorAnalytics(isEditMode ? editCreditCard : addNewCard, expirationMonthRequired)}
                                {Date.getNumericMonthArray().map((month, index) => (
                                    <option
                                        key={month || index.toString()}
                                        value={index + 1}
                                    >
                                        {month}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                label={yy}
                                autoComplete='cc-exp-year'
                                name='expYear'
                                value={this.state.expYear}
                                required={true}
                                onChange={this.handleExpYearSelect}
                                invalid={this.state.isCardExpired || this.state.emptyYear}
                                message={this.state.emptyYear ? expirationYearRequired : null}
                                ref={comp => (this.expYearSelect = comp)}
                            >
                                {this.state.emptyYear &&
                                    this.props.fireFormErrorAnalytics(isEditMode ? editCreditCard : addNewCard, expirationYearRequired)}
                                {Date.getCreditCardExpYears().map(year => {
                                    const selected = year === expirationYearFromCard ? 'selected' : false;

                                    return (
                                        <option
                                            key={year}
                                            defaultValue={selected}
                                            value={year}
                                        >
                                            {year}
                                        </option>
                                    );
                                })}
                            </Select>
                            <TextInput
                                label={cvc}
                                autoComplete='cc-csc'
                                autoCorrect='off'
                                infoAction={this.handleCVCIconClick}
                                infoLabel='More info about CVV'
                                name='securityCode'
                                required={true}
                                inputMode='numeric'
                                pattern='\d*'
                                onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                onChange={this.handleCVCChange}
                                maxLength={securityCodeLength}
                                value={this.state.securityCode}
                                invalid={this.state.emptySecurityCode}
                                ref={comp => (this.cardSecurityCodeInput = comp)}
                                validate={code => {
                                    if (FormValidator.isEmpty(code)) {
                                        return errorsUtils.getMessage(ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE);
                                    } else if (code.length < securityCodeLength) {
                                        return errorsUtils.getMessage(ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH);
                                    }

                                    return null;
                                }}
                            />
                        </Grid>
                        <AddressForm
                            editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.PROFILE.BILLING_ADDRESS)}
                            isBillingAddress
                            isEditMode={isEditMode}
                            address={isEditMode ? this.props.creditCardForEdit.address : null}
                            countryList={countries}
                            country={profileLocale}
                            onCountryChange={this.onCountryChange}
                            disableCountryList={false}
                            ref={comp => (this.addressForm = comp)}
                            fireFormErrorAnalytics={this.props.fireFormErrorAnalytics}
                            isSubscription={this.props.isSubscription}
                            modalTitle={isEditMode ? editCreditCard : addNewCard}
                        />
                        <Checkbox
                            paddingY={null}
                            checked={this.state.isDefault}
                            onChange={this.handleIsDefault}
                            name='is_default'
                        >
                            {setDefault}
                        </Checkbox>
                        {isEditMode && (
                            <Link
                                css={styles.deleteCardLink}
                                data-at={Sephora.debug.dataAt('cc_delete_btn')}
                                color='blue'
                                onClick={this.handleDeleteCard}
                            >
                                {deleteCard}
                            </Link>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Grid
                            columns={2}
                            gap={3}
                        >
                            <Button
                                onClick={this.handleModalClose}
                                variant='secondary'
                            >
                                {cancel}
                            </Button>
                            <Button
                                onClick={this.validateCreditCardForm}
                                variant='primary'
                            >
                                {isEditMode ? update : save}
                            </Button>
                        </Grid>
                    </Modal.Footer>
                </Modal>
                <CVCInfoModal />
            </>
        );
    }
}

const styles = {
    cardTypePadding: {
        paddingRight: PAYMENT_LOGO_WIDTH + PAYMENT_LOGO_OFFSET * 2
    },
    editCardTitle: {
        marginBottom: `${space[3]}px`
    },
    deleteCardLink: {
        padding: `${space[5]}px ${space[5]}px 0 0`
    }
};

AddPaymentMethodModal.defaultProps = {};

AddPaymentMethodModal.propTypes = {
    addNewCard: PropTypes.string.isRequired,
    profileLocale: PropTypes.string.isRequired,
    countries: PropTypes.array.isRequired,
    paymentGroupType: PropTypes.string.isRequired,
    loadCountries: PropTypes.func.isRequired,
    addOrUpdateCreditCard: PropTypes.func.isRequired,
    paymentCardNumberChanged: PropTypes.func.isRequired,
    setDefaultCCOnProfileAndDelete: PropTypes.func.isRequired,
    removeCreditCard: PropTypes.func.isRequired,
    onModalClose: PropTypes.func.isRequired
};

export default wrapComponent(AddPaymentMethodModal, 'AddPaymentMethodModal', true);
