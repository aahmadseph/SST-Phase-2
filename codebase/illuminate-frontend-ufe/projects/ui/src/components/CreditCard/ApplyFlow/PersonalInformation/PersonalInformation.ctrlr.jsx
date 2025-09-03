/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import AddressForm from 'components/Addresses/AddressForm/AddressForm';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import FormValidator from 'utils/FormValidator';
import TextInput from 'components/Inputs/TextInput/TextInput';
import ErrorConstants from 'utils/ErrorConstants';
import { PHONE_NUMBER_TYPES } from 'constants/CreditCard';
import ApplyFlowSection from 'components/CreditCard/ApplyFlow/ApplyFlowSection/ApplyFlowSection';
import localeUtils from 'utils/LanguageLocale';

import HelperUtils from 'utils/Helpers';
import ErrorsUtils from 'utils/Errors';

class PersonalInformation extends BaseClass {
    state = {
        mobilePhone: this.props.phone ? FormValidator.getFormattedPhoneNumber(this.props.phone) : '',
        alternatePhone: ''
    };

    getPairedInputName = name => {
        return name === PHONE_NUMBER_TYPES.MOBILE ? PHONE_NUMBER_TYPES.ALTERNATE : PHONE_NUMBER_TYPES.MOBILE;
    };

    getErrorCode = inputName => {
        const { MOBILE_NUMBER, ALTERNATIVE_NUMBER } = ErrorConstants.ERROR_CODES;

        return inputName === PHONE_NUMBER_TYPES.MOBILE ? MOBILE_NUMBER : ALTERNATIVE_NUMBER;
    };

    getInputValue = number => {
        return this[number] && this[number].getValue();
    };

    formatPhoneNumber = e => {
        const rawValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        const name = e.target.name;
        this.setState({ [name]: FormValidator.getFormattedPhoneNumber(rawValue, e.inputType) });

        const pairedInput = this.getPairedInputName(name);
        const errorCode = this.getErrorCode(pairedInput);

        this[pairedInput] && this[pairedInput].removeSpecificError(ErrorConstants.ERRORS[errorCode].message);
    };

    validatePhone = (phoneNumber, currentInput, pairedInput) => {
        const errorCode = this.getErrorCode(currentInput);

        if (FormValidator.isEmpty(phoneNumber) && FormValidator.isEmpty(this.getInputValue(pairedInput))) {
            return ErrorConstants.ERROR_CODES[errorCode];
        }

        if (phoneNumber.length && phoneNumber.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
            return ErrorConstants.ERROR_CODES[`${errorCode}_INVALID`];
        }

        return null;
    };

    validateForm = () => {
        const fieldsForValidation = [];

        fieldsForValidation.push(this.emailInput, this.mobilePhone, this.alternatePhone);
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        const isAddressValid = this.addressForm.validateForm(true);
        const isValidInfo = !ErrorsUtils.validate(fieldsForValidation) && isAddressValid;

        const error = isValidInfo ? null : ErrorConstants.ERRORS[ErrorConstants.ERROR_CODES.APPLY_FORM_SECTION].message;

        if (this.state.error !== error) {
            this.setState({ error });
        }

        return isValidInfo;
    };

    getData = () => {
        const addressData = this.addressForm.getData().address;
        const firstName = addressData.firstName;
        const lastName = addressData.lastName;

        delete addressData.addressId;
        delete addressData.firstName;
        delete addressData.lastName;

        return {
            firstName: firstName,
            lastName: lastName,
            address: addressData,
            email: this.emailInput.getValue(),
            mobilePhone: this.state.mobilePhone.replace(HelperUtils.specialCharacterRegex, ''),
            alternatePhone: this.state.alternatePhone.replace(HelperUtils.specialCharacterRegex, '')
        };
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/PersonalInformation/locales', 'PersonalInformation');

        const { address = {}, email, isAdsRestricted, errors } = this.props;

        const mobilePhone = PHONE_NUMBER_TYPES.MOBILE;
        const alternatePhone = PHONE_NUMBER_TYPES.ALTERNATE;

        this.state.error = errors && errors.addressType ? errors.addressType : null;

        const isMobile = Sephora.isMobile();

        return (
            <ApplyFlowSection
                title={getText('personalInformationTitle')}
                note={'* ' + getText('requiredInfoNote')}
            >
                {this.state.error && (
                    <Text
                        is='p'
                        marginBottom={5}
                        role='alert'
                        color='error'
                        data-at={Sephora.debug.dataAt('invalid_address')}
                        children={this.state.error}
                    />
                )}
                <AddressForm
                    hasGridLayout={true}
                    hasAVS={false}
                    isEditMode={!!address.address1}
                    isCountryFieldHidden={true}
                    isPhoneFieldHidden={true}
                    address={address}
                    country={'US'}
                    isAdsRestricted={isAdsRestricted}
                    ref={comp => {
                        if (comp !== null) {
                            this.addressForm = comp;
                        }
                    }}
                />
                <InputEmail
                    label={getText('emailAddressLabel')}
                    name='email'
                    id='creditcard_email'
                    required={true}
                    login={email}
                    isAdsRestricted={isAdsRestricted}
                    validateError={value => {
                        if (FormValidator.isEmpty(value)) {
                            return ErrorConstants.ERROR_CODES.EMAIL_EMPTY;
                        }

                        const maxLength = FormValidator.FIELD_LENGTHS.emailAdsRestricted;

                        if (isAdsRestricted && !FormValidator.isValidLength(value, 1, maxLength)) {
                            return ErrorConstants.ERROR_CODES.EMAIL_ADS_LONG;
                        }

                        return null;
                    }}
                    ref={comp => {
                        if (comp !== null) {
                            this.emailInput = comp;
                        }
                    }}
                />
                <Text
                    is='p'
                    fontSize='sm'
                    fontWeight='bold'
                    marginBottom='.5em'
                    children={getText('onePhoneRequired') + '*'}
                />
                <LegacyGrid
                    fill={!isMobile}
                    gutter={4}
                >
                    <LegacyGrid.Cell>
                        <TextInput
                            name={mobilePhone}
                            label={getText('mobileNumberLabel')}
                            autoComplete='tel'
                            autoCorrect='off'
                            type='tel'
                            maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                            required={false}
                            value={this.state.mobilePhone}
                            onKeyDown={!isMobile && FormValidator.inputAcceptOnlyNumbers}
                            onChange={this.formatPhoneNumber}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            ref={comp => (this[mobilePhone] = comp)}
                            validateError={phoneNumber => {
                                return this.validatePhone(phoneNumber, mobilePhone, alternatePhone);
                            }}
                        />
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell>
                        <TextInput
                            name={alternatePhone}
                            label={getText('altNumberLabel')}
                            autoCorrect='off'
                            type='tel'
                            maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                            required={false}
                            value={this.state.alternatePhone}
                            onKeyDown={!isMobile && FormValidator.inputAcceptOnlyNumbers}
                            onChange={this.formatPhoneNumber}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            ref={comp => (this[alternatePhone] = comp)}
                            validateError={phoneNumber => {
                                return this.validatePhone(phoneNumber, alternatePhone, mobilePhone);
                            }}
                        />
                    </LegacyGrid.Cell>
                </LegacyGrid>
                <Text
                    is='p'
                    marginBottom='1em'
                    fontSize='sm'
                >
                    {getText('byProvidingContactText')}
                </Text>
                <Text
                    is='p'
                    fontSize='sm'
                >
                    {getText('ifYouDontHavePhoneText')}
                </Text>
            </ApplyFlowSection>
        );
    }
}

export default wrapComponent(PersonalInformation, 'PersonalInformation');
