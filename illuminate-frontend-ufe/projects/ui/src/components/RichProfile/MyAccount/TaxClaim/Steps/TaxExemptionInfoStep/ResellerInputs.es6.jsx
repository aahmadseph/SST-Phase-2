import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Grid, Text } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes, fontWeights, colors } from 'style/config';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import ErrorsUtils from 'utils/Errors';
import Empty from 'constants/empty';
import ErrorConstants from 'utils/ErrorConstants';
import TaxClaimAddressComponent from 'components/RichProfile/MyAccount/TaxClaim/Steps/GenericFormComponents/TaxClaimAddressComponent';
import CreditCardIssuedRadioGroup from 'components/RichProfile/MyAccount/TaxClaim/Steps/GenericFormComponents/CreditCardIssuedRadioGroup';

import AddressForm from 'components/RichProfile/MyAccount/TaxClaim/AddressForm/AddressForm';
import TaxClaimUtils from 'utils/TaxClaim';

// Define boolean constants
const BOOLEAN_VALUES = {
    YES: true,
    NO: false
};

const {
    ERROR_CODES: { ORGANIZATION_POSITION_EMPTY, ORGANIZATION_NAME_EMPTY, ORGANIZATION_URL_EMPTY }
} = ErrorConstants;

class ResellerInputs extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            firstName: props.firstName || props.userGeneralData?.firstName || '',
            lastName: props.lastName || props.userGeneralData?.lastName || '',
            creditCardIssued: BOOLEAN_VALUES.NO
        };
    }

    handleFocus = field => {
        this.setState({ [field]: true });
    };

    handleBlur = field => {
        this.setState({ [field]: false });
    };

    handleOrganizationPositionChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationPositionChange(value);
        this.props.updateStep4Data('r', 'organizationPosition', value);

        const organizationPositionError = TaxFormValidator.validateOrganizationPosition(value);

        if (!organizationPositionError) {
            this.props.clearErrors('rErrors', ORGANIZATION_POSITION_EMPTY);
        }
    };

    handleOrganizationNameChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationNameChange(value);
        this.props.updateStep4Data('r', 'organizationName', value);

        const organizationNameError = TaxFormValidator.validateOrganizationName(value);

        if (!organizationNameError) {
            this.props.clearErrors('rErrors', ORGANIZATION_NAME_EMPTY);
        }
    };

    handleOrganizationTypeChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationTypeChange(value);
        this.props.updateStep4Data('r', 'organizationType', value);
    };

    handleOrganizationUrlChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationUrlChange(value);
        this.props.updateStep4Data('r', 'organizationUrl', value);

        const organizationUrlError = TaxFormValidator.validateOrganizationUrl(value);

        if (!organizationUrlError) {
            this.props.clearErrors('rErrors', ORGANIZATION_URL_EMPTY);
        }
    };

    handleStateIssuedTaxExemptNumberChange = event => {
        const { value } = event.target;
        this.props.handleStateIssuedTaxExemptNumberChange(value);
        this.props.updateStep4Data('r', 'stateIssuedTaxExemptNumber', value);
    };

    handlePhoneNumberChange = event => {
        const { value } = event.target;
        this.props.handlePhoneNumberChange(value);
        this.props.updateStep4Data('r', 'phoneNumber', value);
    };

    handleFirstNameChange = event => {
        const { value } = event.target;
        this.setState({ firstName: value });
        this.props.handleCCFirstNameChange(value);
        this.props.updateStep4Data('r', 'firstName', value);
    };

    handleLastNameChange = event => {
        const { value } = event.target;
        this.setState({ lastName: value });
        this.props.handleCCLastNameChange(value);
        this.props.updateStep4Data('r', 'lastName', value);
    };

    handleCreditCardIssuedChange = booleanValue => {
        this.props.clearErrors();
        this.setState({ creditCardIssued: booleanValue });
        this.props.handleCreditCardIssuedChange(booleanValue);
        this.props.updateStep4Data('r', 'creditCardIssued', booleanValue);
    };

    render() {
        const {
            organizationPosition,
            organizationName,
            organizationType,
            organizationUrl,
            stateIssuedTaxExemptNumber,
            phoneNumber,
            updateStep4Data,
            formErrors,
            handleStreetAddressChange,
            handleAddress2Change,
            handleCityChange,
            handleStateChange,
            handlePostalCodeChange,
            streetAddress,
            address2,
            city,
            state,
            postalCode,
            addressErrors,
            handleAddressErrorsFromStepFour,
            selectedCategory,
            creditCardIssued
        } = this.props;

        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
        const rErrors = formErrors?.rErrors || Empty.Object;

        const organizationPositionHasError = Boolean(rErrors.organizationPositionEmpty);
        const organizationPositionErrorMessage = organizationPositionHasError ? ErrorsUtils.getMessage(ORGANIZATION_POSITION_EMPTY) : '';

        const organizationNameHasError = Boolean(rErrors.organizationNameEmpty);
        const organizationNameErrorMessage = organizationNameHasError ? ErrorsUtils.getMessage(ORGANIZATION_NAME_EMPTY) : '';

        const organizationUrlHasError = Boolean(rErrors.organizationUrlEmpty);
        const organizationUrlErrorMessage = organizationUrlHasError ? ErrorsUtils.getMessage(ORGANIZATION_URL_EMPTY) : '';

        const creditCardIssuedHasError = Boolean(rErrors.creditCardIssuedEmpty);

        const { firstName, lastName } = this.state;

        return (
            <Box>
                <Grid
                    columns='1fr'
                    gap='16'
                >
                    <TextInput
                        label={getText('businessPositionLabel')}
                        value={organizationPosition}
                        onChange={this.handleOrganizationPositionChange}
                        maxLength={TaxFormValidator.FIELD_LENGTHS.organizationPosition}
                        validateError={TaxFormValidator.validateOrganizationPosition}
                        invalid={organizationPositionHasError}
                        message={organizationPositionErrorMessage}
                        onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                        onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                    />
                </Grid>

                <Box>
                    <Text
                        is='h3'
                        css={styles.title}
                        marginY={3}
                    >
                        {getText('businessLabel')}
                    </Text>

                    <Grid
                        columns='1fr'
                        gap='16'
                    >
                        <TextInput
                            label={getText('businessNameLabel')}
                            value={organizationName}
                            onChange={this.handleOrganizationNameChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.organizationName}
                            validateError={TaxFormValidator.validateOrganizationName}
                            invalid={organizationNameHasError}
                            message={organizationNameErrorMessage}
                            onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                            onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                        />
                        <TextInput
                            label={getText('businessTypeLabel')}
                            value={organizationType}
                            onChange={this.handleOrganizationTypeChange}
                            onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                            onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                        />
                        <TextInput
                            label={getText('businessUrlLabel')}
                            value={organizationUrl}
                            onChange={this.handleOrganizationUrlChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.organizationUrl}
                            validateError={TaxFormValidator.validateOrganizationUrl}
                            invalid={organizationUrlHasError}
                            message={organizationUrlErrorMessage}
                            onKeyDown={TaxFormValidator.inputAcceptURLCharacters}
                            onPaste={TaxFormValidator.pasteAcceptURLCharacters}
                        />
                        <TextInput
                            label={getText('stateSalesTaxPermitNumberLabel')}
                            value={stateIssuedTaxExemptNumber}
                            onChange={this.handleStateIssuedTaxExemptNumberChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.stateIssuedTaxExemptNumber}
                            onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                            onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                        />
                        <TextInput
                            width='208px'
                            label={getText('phoneNumberLabel')}
                            value={phoneNumber}
                            onChange={this.handlePhoneNumberChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.phoneNumber}
                            onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                            onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                        />
                    </Grid>
                </Box>

                <Box>
                    <Grid columns='1fr'>
                        {TaxClaimUtils.isTaxExemptionEnabled() ? (
                            <AddressForm
                                localizedAddressTitle={getText('businessAddressLabel')}
                                firstName={this.props.firstName}
                                lastName={this.props.lastName}
                                phoneNumber={this.props.phoneNumber}
                                country={localeUtils.getCurrentCountry().toUpperCase()}
                                streetAddress={streetAddress}
                                address2={address2}
                                city={city}
                                state={state}
                                postalCode={postalCode}
                                selectedCategory={selectedCategory}
                                addressErrors={this.props.addressErrors}
                                handleStreetAddressChange={handleStreetAddressChange}
                                handleAddress2Change={handleAddress2Change}
                                handleCityChange={handleCityChange}
                                handleStateChange={handleStateChange}
                                handlePostalCodeChange={handlePostalCodeChange}
                                addAddressErrors={this.props.addAddressErrors}
                                updateStep4Data={updateStep4Data}
                                handleAddressErrorsFromStepFour={handleAddressErrorsFromStepFour}
                            />
                        ) : (
                            <TaxClaimAddressComponent
                                localizedAddressTitle={getText('businessAddressLabel')}
                                streetAddress={streetAddress}
                                address2={address2}
                                city={city}
                                state={state}
                                postalCode={postalCode}
                                handleStreetAddressChange={handleStreetAddressChange}
                                handleAddress2Change={handleAddress2Change}
                                handleCityChange={handleCityChange}
                                handleStateChange={handleStateChange}
                                handlePostalCodeChange={handlePostalCodeChange}
                                addressErrors={addressErrors}
                                handleAddressErrorsFromStepFour={handleAddressErrorsFromStepFour}
                                selectedCategory={selectedCategory}
                                updateStep4Data={updateStep4Data}
                            />
                        )}
                    </Grid>
                </Box>

                <Box>
                    <Text
                        is='h3'
                        css={styles.title}
                        marginY={3}
                    >
                        {getText('creditCardSecondTitle')}
                    </Text>

                    <Grid
                        columns='1fr 1fr'
                        gap='16'
                    >
                        <TextInput
                            label={getText('firstName')}
                            autoCorrect='off'
                            required={true}
                            hideAsterisk={true}
                            maxLength={50}
                            value={firstName}
                            onChange={this.handleFirstNameChange}
                            onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                            onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                        />
                        <TextInput
                            label={getText('lastName')}
                            autoCorrect='off'
                            required={true}
                            hideAsterisk={true}
                            maxLength={50}
                            value={lastName}
                            onChange={this.handleLastNameChange}
                            onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                            onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                        />
                    </Grid>
                </Box>

                <Box>
                    <Text
                        is='h3'
                        css={styles.title}
                        marginY={3}
                    >
                        {getText('creditCardIssued')}
                    </Text>

                    {creditCardIssuedHasError ? (
                        <Text
                            css={styles.error}
                            role='alert'
                            aria-live='assertive'
                        >
                            {getText('invalidCreditCardIssued')}
                        </Text>
                    ) : null}
                    <CreditCardIssuedRadioGroup
                        creditCardIssued={creditCardIssued}
                        onChange={this.handleCreditCardIssuedChange}
                    />
                </Box>
            </Box>
        );
    }
}

const styles = {
    title: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold
    },
    dateInput: {
        width: '208px'
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red,
        marginTop: '16px',
        marginBottom: '16px'
    }
};

export default wrapComponent(ResellerInputs, 'ResellerInputs');
