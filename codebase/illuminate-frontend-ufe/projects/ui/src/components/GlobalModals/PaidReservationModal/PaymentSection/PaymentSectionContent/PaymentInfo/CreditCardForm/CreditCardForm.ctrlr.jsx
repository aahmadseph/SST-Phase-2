/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { createRef } from 'react';
import { Grid, Text, Flex } from 'components/ui';
import CreditCardUtils from 'utils/CreditCard';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import FormValidator from 'utils/FormValidator';
import LocaleUtils from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import TextInput from 'components/Inputs/TextInput/TextInput';
import UI from 'utils/UI';

import CVCInfoModal from 'components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';

const {
    ERROR_CODES: {
        CREDIT_CARD_EXP_MONTH_INVALID,
        CREDIT_CARD_EXP_MONTH,
        CREDIT_CARD_EXP_YEAR,
        CREDIT_CARD_EXP_DATE,
        CREDIT_CARD_NUMBER,
        CREDIT_CARD_SECURITY_CODE_LENGTH,
        CREDIT_CARD_SECURITY_CODE,
        FIRST_NAME,
        LAST_NAME
    }
} = ErrorConstants;

const {
    PAYMENT_GROUP_TYPE: { CREDIT_CARD }
} = OrderUtils;

const getText = LocaleUtils.getLocaleResourceFile(
    'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/CreditCardForm/locales',
    'CreditCardForm'
);

class CreditCardForm extends BaseClass {
    state = { creditCard: {} };
    cardNumberRef = createRef();
    expirationMonthRef = createRef();
    expirationYearRef = createRef();
    securityCodeRef = createRef();
    firstNameRef = createRef();
    lastNameRef = createRef();

    componentDidMount() {
        const { creditCardToEdit } = this.props;

        if (creditCardToEdit) {
            const { expirationMonth, expirationYear } = creditCardToEdit;
            this.setState({
                creditCard: {
                    ...creditCardToEdit,
                    expirationMonth: `${expirationMonth?.length === 1 ? '0' : ''}${expirationMonth}`,
                    expirationYear: expirationYear.slice(-2)
                }
            });
        }
    }

    componentDidUpdate() {
        const { creditCardToEdit, triggerAnalyticsErrors } = this.props;

        if (creditCardToEdit?.isExpired) {
            const ccExpirationDateError = this.validateCreditCardExpirationDate();
            triggerAnalyticsErrors(ccExpirationDateError.messages);
        }
    }

    handleCardNumberChange = () => {
        const {
            creditCard: { cardNumber }
        } = this.state;
        this.setState({ newCreditcardType: CreditCardUtils.getCardType(cardNumber || '') });
    };

    validateCreditCardNumber = cardNumberString => {
        if (FormValidator.isEmpty(cardNumberString)) {
            return ErrorsUtils.getMessage(CREDIT_CARD_NUMBER);
        }

        return null;
    };

    validateCreditCardExpirationMonth = expirationMonthString => {
        const {
            creditCard: { isExpired }
        } = this.state;

        if (FormValidator.isEmpty(expirationMonthString)) {
            return ErrorsUtils.getMessage(CREDIT_CARD_EXP_MONTH);
        }

        if (!FormValidator.isValidCreditCardMonth(expirationMonthString)) {
            return ErrorsUtils.getMessage(CREDIT_CARD_EXP_MONTH_INVALID);
        }

        if (isExpired) {
            return ErrorsUtils.getMessage(CREDIT_CARD_EXP_DATE);
        }

        return null;
    };

    validateCreditCardExpirationYear = expirationYearString => {
        if (FormValidator.isEmpty(expirationYearString)) {
            return ErrorsUtils.getMessage(CREDIT_CARD_EXP_YEAR);
        }

        return null;
    };

    validateCreditCardSecurityCode = securityCodeString => {
        const {
            creditCard: { cardType, newCreditcardType }
        } = this.state;

        if (FormValidator.isEmpty(securityCodeString)) {
            return ErrorsUtils.getMessage(CREDIT_CARD_SECURITY_CODE);
        } else if (securityCodeString.length < CreditCardUtils.getSecurityCodeLength(cardType || newCreditcardType)) {
            return ErrorsUtils.getMessage(CREDIT_CARD_SECURITY_CODE_LENGTH);
        }

        return null;
    };

    validateFirstName = firstNameString => {
        const nameAndLastnameMaxLength = FormValidator.FIELD_LENGTHS.name;

        if (FormValidator.isEmpty(firstNameString)) {
            return ErrorsUtils.getMessage(FIRST_NAME);
        }

        if (!FormValidator.isValidLength(firstNameString, 1, nameAndLastnameMaxLength)) {
            return ErrorConstants.ERROR_CODES.FIRST_NAME_LONG;
        }

        return null;
    };

    validateLastName = lastNameString => {
        const nameAndLastnameMaxLength = FormValidator.FIELD_LENGTHS.name;

        if (FormValidator.isEmpty(lastNameString)) {
            return ErrorsUtils.getMessage(LAST_NAME);
        }

        if (!FormValidator.isValidLength(lastNameString, 1, nameAndLastnameMaxLength)) {
            return ErrorConstants.ERROR_CODES.LAST_NAME_LONG;
        }

        return null;
    };

    render() {
        const { showCVCHelp, creditCardToEdit } = this.props;

        const {
            creditCard,
            creditCard: {
                cardNumber, expirationMonth, expirationYear, firstName, lastName, cardType, securityCode, isExpired
            },
            creditCardNumInvalid,
            newCreditcardType
        } = this.state;
        const detectedCreditCard = cardType && OrderUtils.getThirdPartyCreditCard(creditCard);
        const nameAndLastnameMaxLength = FormValidator.FIELD_LENGTHS.name;

        return (
            <>
                {creditCardToEdit ? (
                    <Flex
                        alignItems='center'
                        lineHeight='tight'
                        marginBottom={4}
                    >
                        <PaymentLogo
                            cardType={detectedCreditCard}
                            height={32}
                            marginRight={4}
                            paymentGroupType={CREDIT_CARD}
                            width={50}
                        />
                        <Text>
                            {CreditCardUtils.getCardName(cardType)} {getText('endingIn')} {CreditCardUtils.shortenCardNumber(cardNumber)}
                        </Text>
                    </Flex>
                ) : (
                    <TextInput
                        autoComplete='cc-number'
                        autoCorrect='off'
                        inputMode='numeric'
                        invalid={creditCardNumInvalid}
                        label={getText('cardNumber')}
                        maxLength={FormValidator.FIELD_LENGTHS.creditCard}
                        name='cardNumber'
                        onChange={this.onFieldChanged}
                        onBlur={this.handleCardNumberChange}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        pattern='\d*'
                        ref={this.cardNumberRef}
                        required
                        value={cardNumber}
                        validate={this.validateCreditCardNumber}
                    />
                )}
                <Grid
                    gap={4}
                    columns={2}
                >
                    <Grid
                        gap={4}
                        columns={2}
                    >
                        <TextInput
                            autoComplete='cc-exp-month'
                            autoCorrect='off'
                            inputMode='numeric'
                            invalid={isExpired}
                            label={getText('mm')}
                            maxLength={FormValidator.FIELD_LENGTHS.creditCardExpiration}
                            name='expirationMonth'
                            onChange={this.onFieldChanged}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            pattern='\d*'
                            ref={this.expirationMonthRef}
                            required
                            value={expirationMonth}
                            validate={this.validateCreditCardExpirationMonth}
                        />
                        <TextInput
                            autoComplete='cc-exp-year'
                            autoCorrect='off'
                            inputMode='numeric'
                            invalid={isExpired}
                            label={getText('yy')}
                            maxLength={FormValidator.FIELD_LENGTHS.creditCardExpiration}
                            name='expirationYear'
                            onChange={this.onFieldChanged}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            pattern='\d*'
                            ref={this.expirationYearRef}
                            required
                            value={expirationYear}
                            validate={this.validateCreditCardExpirationYear}
                        />
                    </Grid>
                    <TextInput
                        autoComplete='cc-csc'
                        autoCorrect='off'
                        infoAction={showCVCHelp}
                        infoLabel='More info about CVV'
                        inputMode='numeric'
                        label={getText('cvc')}
                        maxLength={CreditCardUtils.getSecurityCodeLength(cardType || newCreditcardType)}
                        name='securityCode'
                        onChange={this.onFieldChanged}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        pattern='\d*'
                        ref={this.securityCodeRef}
                        required
                        value={securityCode}
                        validate={this.validateCreditCardSecurityCode}
                    />
                </Grid>
                <Grid
                    gap={4}
                    columns={2}
                >
                    <TextInput
                        label={getText('firstName')}
                        name='firstName'
                        onChange={this.onFieldChanged}
                        ref={this.firstNameRef}
                        maxLength={nameAndLastnameMaxLength}
                        required
                        value={firstName}
                        validate={this.validateFirstName}
                    />
                    <TextInput
                        label={getText('lastName')}
                        name='lastName'
                        onChange={this.onFieldChanged}
                        ref={this.lastNameRef}
                        maxLength={nameAndLastnameMaxLength}
                        required
                        value={lastName}
                        validate={this.validateLastName}
                    />
                </Grid>
                <CVCInfoModal />
            </>
        );
    }

    // eslint-disable-next-line object-curly-newline
    onFieldChanged = ({ target: { name, value } }) => {
        let nextCreditCardState;

        switch (name) {
            case 'securityCode': {
                nextCreditCardState = {
                    [name]: UI.isAndroid() ? value.replace('.', '') : value
                };

                break;
            }
            case 'expirationMonth':
            case 'expirationYear': {
                nextCreditCardState = {
                    [name]: value,
                    isExpired: false
                };

                break;
            }
            default: {
                nextCreditCardState = {
                    [name]: value
                };

                break;
            }
        }

        this.setState({
            creditCard: {
                ...this.state.creditCard,
                ...nextCreditCardState
            }
        });
    };

    validate = () => {
        const errors = FormValidator.getErrors([
            this.cardNumberRef.current,
            this.expirationMonthRef.current,
            this.expirationYearRef.current,
            this.securityCodeRef.current,
            this.firstNameRef.current,
            this.lastNameRef.current
        ]);

        return errors;
    };

    validateCreditCardExpirationDate = () => {
        const errors = FormValidator.getErrors([this.expirationMonthRef.current, this.expirationYearRef.current]);

        return errors;
    };

    getCreditCard = () => {
        const { creditCard } = this.state;

        return creditCard;
    };
}

CreditCardForm.propTypes = { showCVCHelp: PropTypes.func.isRequired };

export default wrapComponent(CreditCardForm, 'CreditCardForm', true);
