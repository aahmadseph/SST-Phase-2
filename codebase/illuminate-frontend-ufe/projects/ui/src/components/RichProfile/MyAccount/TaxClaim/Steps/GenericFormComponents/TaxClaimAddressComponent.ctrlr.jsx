import React from 'react';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import BaseClass from 'components/BaseClass';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { wrapComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes } from 'style/config';
import { TaxClaimAddressValues } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import ErrorConstants from 'utils/ErrorConstants';

const GRID_GUTTER = 4;
const {
    ADDRESS1, ADDRESS2, CITY, STATE, POSTAL_CODE, OKLAHOMA
} = TaxClaimAddressValues;
const {
    ERROR_CODES: {
        TAX_ADDRESS_1_EMPTY, TAX_ADDRESS_2_EMPTY, TAX_CITY_EMPTY, TAX_STATE_EMPTY, TAX_ZIP_CODE_EMPTY, TAX_ZIP_CODE_INVALID
    }
} = ErrorConstants;

const lowerCaseVeteransCategory = 'dvifo';
const postalCodeLength = TaxFormValidator.FIELD_LENGTHS.postalCode;
const zipCodeLength = TaxFormValidator.FIELD_LENGTHS.zipCode;

class TaxClaimAddressComponent extends BaseClass {
    constructor(props) {
        super(props);

        // Initialize local state based on props
        this.state = {
            stateValue: this.props.state || ''
        };
    }

    componentDidMount() {
        // Check and set the default value if necessary
        const selectedCategory = this.props.selectedCategory.toLowerCase();

        if (selectedCategory === lowerCaseVeteransCategory && this.state.stateValue !== OKLAHOMA) {
            this.handleStateValueChange({ target: { value: OKLAHOMA } });
        }
    }

    appendAddressDataToStepFourReduxData = (category, objectKey, value) => {
        this.props.updateStep4Data(category, objectKey, value);
    };

    handleStateValueChange = e => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const isDisabled = selectedCategory === lowerCaseVeteransCategory;
        const value = e.target.value;

        // Always propagate the state change to the parent
        this.props.handleStateChange(value);
        this.appendAddressDataToStepFourReduxData(selectedCategory, STATE, value);

        if (!isDisabled) {
            // Only validate for non okalahoma category since its pre-populated
            this.validateField(STATE, value);
        }
    };

    validateField(name, value) {
        let error;
        // 2 letter country code
        const countryLocale = localeUtils.getCurrentCountry();

        switch (name) {
            case ADDRESS1:
                error = TaxFormValidator.validateStreetAddressLine1(value);

                break;
            case ADDRESS2:
                error = TaxFormValidator.validateStreetAddressLine2(value);

                break;
            case CITY:
                error = TaxFormValidator.validateCity(value);

                break;
            case STATE:
                error = TaxFormValidator.validateState(value);

                break;
            case POSTAL_CODE:
                error = TaxFormValidator.validatePostalCode(value, countryLocale);

                break;
            default:
                break;
        }

        this.props.handleAddressErrorsFromStepFour(name, error);

        if (error) {
            this.props.addressErrors[name] = error;
        } else {
            delete this.props.addressErrors[name];
        }
    }

    getErrorMessage = errorKey => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

        const errorMessages = {
            taxAddress1Empty: getText(TAX_ADDRESS_1_EMPTY),
            taxAddress2Empty: getText(TAX_ADDRESS_2_EMPTY),
            taxCityEmpty: getText(TAX_CITY_EMPTY),
            taxStateEmpty: getText(TAX_STATE_EMPTY),
            taxZipCodeEmpty: getText(TAX_ZIP_CODE_EMPTY),
            taxZipCodeInvalid: getText(TAX_ZIP_CODE_INVALID)
        };

        return errorMessages[errorKey] || '';
    };

    renderAddress1 = () => {
        const maxLengthVal = TaxFormValidator.FIELD_LENGTHS.address;
        const errorMessage = this.props.addressErrors.includes(TAX_ADDRESS_1_EMPTY) ? this.getErrorMessage(TAX_ADDRESS_1_EMPTY) : null;
        const hasError = Boolean(errorMessage);
        const selectedCategory = this.props.selectedCategory.toLowerCase();

        return (
            <Box position='relative'>
                <TextInput
                    name={ADDRESS1}
                    onChange={e => {
                        this.props.handleStreetAddressChange(e.target.value);
                        this.validateField(ADDRESS1, e.target.value);
                        this.appendAddressDataToStepFourReduxData(selectedCategory, ADDRESS1, e.target.value);
                    }}
                    label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('streetAddress')}
                    required={true}
                    hideAsterisk={true}
                    maxLength={maxLengthVal}
                    value={this.props.streetAddress}
                    invalid={hasError}
                    message={errorMessage}
                />
            </Box>
        );
    };

    renderAddress2 = () => {
        const maxLengthVal = TaxFormValidator.FIELD_LENGTHS.address;
        const errorMessage = this.props.addressErrors.includes(TAX_ADDRESS_2_EMPTY) ? this.getErrorMessage(TAX_ADDRESS_2_EMPTY) : null;
        const hasError = Boolean(errorMessage);
        const selectedCategory = this.props.selectedCategory.toLowerCase();

        return (
            <Box marginBottom={GRID_GUTTER}>
                <TextInput
                    name={ADDRESS2}
                    autoComplete='address-line2'
                    autoCorrect='off'
                    onChange={e => {
                        this.props.handleAddress2Change(e.target.value);
                        this.validateField(ADDRESS2, e.target.value);
                        this.appendAddressDataToStepFourReduxData(selectedCategory, ADDRESS2, e.target.value);
                    }}
                    label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('address2Label')}
                    maxLength={maxLengthVal}
                    value={this.props.address2}
                    invalid={hasError}
                    message={errorMessage}
                />
            </Box>
        );
    };

    renderPostalCode = () => {
        const hasEmptyZipCodeError = this.props.addressErrors.includes(TAX_ZIP_CODE_EMPTY);
        const hasInvalidZipCodeError = this.props.addressErrors.includes(TAX_ZIP_CODE_INVALID);
        const isCanada = localeUtils.isCanada();
        const maxLength = isCanada ? postalCodeLength : zipCodeLength;

        const errorMessage = hasEmptyZipCodeError
            ? this.getErrorMessage(TAX_ZIP_CODE_EMPTY)
            : hasInvalidZipCodeError
                ? this.getErrorMessage(TAX_ZIP_CODE_INVALID)
                : null;

        const hasError = Boolean(errorMessage);
        const selectedCategory = this.props.selectedCategory.toLowerCase();

        return (
            <TextInput
                name={POSTAL_CODE}
                label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('zipCode')}
                required={true}
                maxLength={maxLength}
                hideAsterisk={true}
                value={this.props.postalCode}
                onChange={e => {
                    this.props.handlePostalCodeChange(e.target.value);
                    this.validateField(POSTAL_CODE, e.target.value);
                    this.appendAddressDataToStepFourReduxData(selectedCategory, POSTAL_CODE, e.target.value);
                }}
                onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                invalid={hasError}
                message={errorMessage}
            />
        );
    };

    renderCity = () => {
        const errorMessage = this.props.addressErrors.includes(TAX_CITY_EMPTY) ? this.getErrorMessage(TAX_CITY_EMPTY) : null;
        const value = this.props.city;
        const hasError = Boolean(errorMessage);
        const selectedCategory = this.props.selectedCategory.toLowerCase();

        return (
            <TextInput
                name={CITY}
                onChange={e => {
                    this.props.handleCityChange(e.target.value);
                    this.validateField(CITY, e.target.value);
                    this.appendAddressDataToStepFourReduxData(selectedCategory, CITY, e.target.value);
                }}
                label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('city')}
                required={true}
                hideAsterisk={true}
                maxLength={TaxFormValidator.FIELD_LENGTHS.city}
                value={value}
                invalid={hasError}
                message={hasError ? errorMessage : null}
                onKeyDown={TaxFormValidator.inputAcceptOnlyLettersAndSpace}
            />
        );
    };

    renderStateProvince = () => {
        const selectedCategory = this.props.selectedCategory.toLowerCase();
        const isDisabled = selectedCategory === lowerCaseVeteransCategory;
        const defaultValue = isDisabled ? OKLAHOMA : this.props.state;
        const errorMessage = this.props.addressErrors.includes(TAX_STATE_EMPTY) && !isDisabled ? this.getErrorMessage(TAX_STATE_EMPTY) : null;
        const hasError = Boolean(errorMessage);

        return (
            <TextInput
                name={STATE}
                onChange={this.handleStateValueChange}
                label={localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim')('state')}
                required={true}
                maxLength={TaxFormValidator.FIELD_LENGTHS.stateRegion}
                hideAsterisk={true}
                value={defaultValue}
                invalid={hasError && !isDisabled}
                message={errorMessage}
                onKeyDown={isDisabled ? null : TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                disabled={isDisabled}
            />
        );
    };

    render() {
        const { localizedAddressTitle } = this.props;

        return (
            <React.Fragment>
                <Text
                    is='h2'
                    fontWeight='bold'
                    marginY={3}
                    fontSize={fontSizes.md}
                >
                    {localizedAddressTitle}
                </Text>
                {this.renderAddress1()}
                {this.renderAddress2()}
                <Box
                    display='flex'
                    justifyContent='space-between'
                    marginY={GRID_GUTTER}
                    flexWrap='wrap'
                >
                    <Box width='32%'>{this.renderPostalCode()}</Box>
                    <Box width='32%'>{this.renderCity()}</Box>
                    <Box width='32%'>{this.renderStateProvince()}</Box>
                </Box>
            </React.Fragment>
        );
    }
}

export default wrapComponent(TaxClaimAddressComponent, 'TaxClaimAddressComponent', true);
