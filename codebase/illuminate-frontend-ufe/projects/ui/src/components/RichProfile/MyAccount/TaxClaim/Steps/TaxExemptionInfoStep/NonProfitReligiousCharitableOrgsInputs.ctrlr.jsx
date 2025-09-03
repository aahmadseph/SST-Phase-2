import React from 'react';
import { wrapComponent } from 'utils/framework';
import { Box, Grid, Text } from 'components/ui';
import BaseClass from 'components/BaseClass';
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

class NonProfitReligiousCharitableOrgsInputs extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            firstName: props.firstName || props.userGeneralData?.firstName || '',
            lastName: props.lastName || props.userGeneralData?.lastName || '',
            creditCardIssued: props.creditCardIssued || BOOLEAN_VALUES.NO // Default value
        };
    }

    componentDidMount() {
        this.props.handleCreditCardIssuedChange(BOOLEAN_VALUES.NO);
    }

    handleOrganizationPositionChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationPositionChange(value);
        this.props.updateStep4Data('nprco', 'organizationPosition', value);

        const organizationPositionError = TaxFormValidator.validateOrganizationPosition(value);

        if (!organizationPositionError) {
            this.props.clearErrors();
        }
    };

    handleOrganizationNameChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationNameChange(value);
        this.props.updateStep4Data('nprco', 'organizationName', value);

        const organizationNameError = TaxFormValidator.validateOrganizationName(value);

        if (!organizationNameError) {
            this.props.clearErrors();
        }
    };

    handleOrganizationUrlChange = event => {
        const { value } = event.target;
        this.props.handleOrganizationUrlChange(value);
        this.props.updateStep4Data('nprco', 'organizationUrl', value);

        const organizationUrlError = TaxFormValidator.validateOrganizationUrl(value);

        if (!organizationUrlError) {
            this.props.clearErrors();
        }
    };

    handleStateIssuedTaxExemptNumberChange = event => {
        const { value } = event.target;
        this.props.handleStateIssuedTaxExemptNumberChange(value);
        this.props.updateStep4Data('nprco', 'stateIssuedTaxExemptNumber', value);
    };

    handlePhoneNumberChange = event => {
        const { value } = event.target;
        this.props.handlePhoneNumberChange(value);
        this.props.updateStep4Data('nprco', 'phoneNumber', value);
    };

    handleFirstNameChange = event => {
        const { value } = event.target;
        this.setState({ firstName: value });
        this.props.handleCCFirstNameChange(value);
        this.props.updateStep4Data('nprco', 'firstName', value);
    };

    handleLastNameChange = event => {
        const { value } = event.target;
        this.setState({ lastName: value });
        this.props.handleCCLastNameChange(value);
        this.props.updateStep4Data('nprco', 'lastName', value);
    };

    handleCreditCardIssuedChange = booleanValue => {
        this.setState({ creditCardIssued: booleanValue });
        this.props.handleCreditCardIssuedChange(booleanValue);
        this.props.updateStep4Data('nprco', 'creditCardIssued', booleanValue);

        if (booleanValue) {
            this.props.clearErrors();
        }
    };

    render() {
        const {
            organizationPosition,
            organizationName,
            organizationUrl,
            stateIssuedTaxExemptNumber,
            phoneNumber,
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
            updateStep4Data
        } = this.props;

        const nprcoErrors = formErrors?.nprcoErrors || Empty.Object;

        const organizationPositionHasError = Boolean(nprcoErrors.organizationPositionEmpty);
        const organizationPositionErrorMessage = organizationPositionHasError ? ErrorsUtils.getMessage(ORGANIZATION_POSITION_EMPTY) : '';

        const organizationNameHasError = Boolean(nprcoErrors.organizationNameEmpty);
        const organizationNameErrorMessage = organizationNameHasError ? ErrorsUtils.getMessage(ORGANIZATION_NAME_EMPTY) : '';

        const organizationUrlHasError = Boolean(nprcoErrors.organizationUrlEmpty);
        const organizationUrlErrorMessage = organizationUrlHasError ? ErrorsUtils.getMessage(ORGANIZATION_URL_EMPTY) : '';

        const creditCardIssuedHasError = Boolean(nprcoErrors.creditCardIssuedEmpty);

        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

        const { firstName, lastName, creditCardIssued } = this.state;

        return (
            <Box>
                <Grid
                    columns='1fr'
                    gap='16'
                >
                    <TextInput
                        label={getText('organizationPositionLabel')}
                        value={organizationPosition}
                        onChange={this.handleOrganizationPositionChange}
                        maxLength={TaxFormValidator.FIELD_LENGTHS.organizationPosition}
                        validateError={TaxFormValidator.validateOrganizationPosition}
                        invalid={organizationPositionHasError}
                        message={organizationPositionErrorMessage}
                    />
                </Grid>

                <Box>
                    <Text
                        is='h3'
                        css={styles.title}
                        marginY={3}
                    >
                        {getText('organizationLabel')}
                    </Text>

                    <Grid
                        columns='1fr'
                        gap='16'
                    >
                        <TextInput
                            label={getText('organizationNameLabel')}
                            value={organizationName}
                            onChange={this.handleOrganizationNameChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.organizationName}
                            validateError={TaxFormValidator.validateOrganizationName}
                            invalid={organizationNameHasError}
                            message={organizationNameErrorMessage}
                        />
                        <TextInput
                            label={getText('organizationUrlLabel')}
                            value={organizationUrl}
                            onChange={this.handleOrganizationUrlChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.organizationUrl}
                            validateError={TaxFormValidator.validateOrganizationUrl}
                            invalid={organizationUrlHasError}
                            message={organizationUrlErrorMessage}
                        />
                        <TextInput
                            label={getText('stateIssuedTaxExemptNumberLabel')}
                            value={stateIssuedTaxExemptNumber}
                            onChange={this.handleStateIssuedTaxExemptNumberChange}
                            maxLength={TaxFormValidator.FIELD_LENGTHS.stateIssuedTaxExemptNumber}
                        />
                        <Box width='334px'>
                            <TextInput
                                label={getText('phoneNumberLabel')}
                                value={phoneNumber}
                                onChange={this.handlePhoneNumberChange}
                                maxLength={TaxFormValidator.FIELD_LENGTHS.phoneNumber}
                            />
                        </Box>
                    </Grid>
                </Box>

                <Box>
                    <Grid columns='1fr'>
                        {TaxClaimUtils.isTaxExemptionEnabled() ? (
                            <AddressForm
                                localizedAddressTitle={getText('organizationAddressLabel')}
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
                                localizedAddressTitle={getText('organizationAddressLabel')}
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
                            maxLength={35}
                            value={firstName}
                            onChange={this.handleFirstNameChange}
                        />
                        <TextInput
                            label={getText('lastName')}
                            autoCorrect='off'
                            required={true}
                            hideAsterisk={true}
                            maxLength={35}
                            value={lastName}
                            onChange={this.handleLastNameChange}
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

export default wrapComponent(NonProfitReligiousCharitableOrgsInputs, 'NonProfitReligiousCharitableOrgsInputs', true);
