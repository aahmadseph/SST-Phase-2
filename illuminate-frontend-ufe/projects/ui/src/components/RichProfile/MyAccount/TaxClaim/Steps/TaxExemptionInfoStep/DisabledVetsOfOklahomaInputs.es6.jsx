import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Grid } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import InputDate from 'components/Inputs/InputDate/InputDate';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes, colors } from 'style/config';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import ErrorsUtils from 'utils/Errors';
import ErrorConstants from 'utils/ErrorConstants';
import TaxClaimAddressComponent from 'components/RichProfile/MyAccount/TaxClaim/Steps/GenericFormComponents/TaxClaimAddressComponent';

const {
    ERROR_CODES: { EXEMPTION_NUMBER_EMPTY, EXEMPTION_NUMBER_INVALID, EFFECTIVE_DATE_EMPTY, EFFECTIVE_DATE_INVALID }
} = ErrorConstants;

class DisabledVetsOfOklahomaInputs extends BaseClass {
    handleVeteranExemptionNumberChange = event => {
        const { value } = event.target;
        this.props.updateStep4Data('dvifo', 'veteranExemptionNumber', value);
        this.props.handleVeteranExemptionNumberChange(value);

        const exemptionNumberError = TaxFormValidator.validateExemptionNumber(value);

        if (!exemptionNumberError) {
            this.props.clearErrors('disabledVetsOfOklahomaErrors', EXEMPTION_NUMBER_EMPTY);
            this.props.clearErrors('disabledVetsOfOklahomaErrors', EXEMPTION_NUMBER_INVALID);
        }
    };

    handleEffectiveDateChange = event => {
        const { value } = event.target;
        this.props.updateStep4Data('dvifo', 'veteranEffectiveDate', value);
        this.props.handleVeteranEffectiveDateChange(value);

        const effectiveDateError = TaxFormValidator.validateExpirationDate(value);

        if (!effectiveDateError) {
            this.props.clearErrors('disabledVetsOfOklahomaErrors', EFFECTIVE_DATE_EMPTY);
            this.props.clearErrors('disabledVetsOfOklahomaErrors', EFFECTIVE_DATE_INVALID);
        }
    };

    render() {
        const {
            veteranExemptionNumber,
            veteranEffectiveDate,
            updateStep4Data,
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
            formErrors,
            isTaxExemptionEnabled
        } = this.props;

        const exemptionNumberErrors =
            formErrors?.disabledVetsOfOklahomaErrors?.taxExemptionNumberEmpty || formErrors?.disabledVetsOfOklahomaErrors?.taxExemptionNumberInvalid;
        const effectiveDateErrors =
            formErrors?.disabledVetsOfOklahomaErrors?.taxEffectiveDateEmpty || formErrors?.disabledVetsOfOklahomaErrors?.taxEffectiveDateInvalid;

        // Refactored render block
        const disabledVetsOfOklahomaErrors = formErrors?.disabledVetsOfOklahomaErrors;

        const exemptionNumberErrorKeys = Object.keys(disabledVetsOfOklahomaErrors || {}).filter(
            key => disabledVetsOfOklahomaErrors[key] === true && key.startsWith('taxExemptionNumber')
        );

        const effectiveDateErrorKeys = Object.keys(disabledVetsOfOklahomaErrors || {}).filter(
            key => disabledVetsOfOklahomaErrors[key] === true && key.startsWith('taxEffectiveDate')
        );

        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
        const exemptionNumberErrorMessage = exemptionNumberErrors ? ErrorsUtils.getMessage(exemptionNumberErrorKeys[0]) : '';
        const effectiveDateErrorMessage = effectiveDateErrors ? ErrorsUtils.getMessage(effectiveDateErrorKeys[0]) : '';

        return (
            <Box>
                <Grid columns='1fr'>
                    <TextInput
                        placeholder={getText('exemptionNumberPlaceholder')}
                        label={getText('exemptionNumberLabel')}
                        value={veteranExemptionNumber}
                        onChange={this.handleVeteranExemptionNumberChange}
                        maxLength={TaxFormValidator.FIELD_LENGTHS.exemptionNumber}
                        invalid={exemptionNumberErrorKeys.length > 0}
                        message={exemptionNumberErrorMessage}
                    />
                    <InputDate
                        width={styles.dateInput}
                        onChange={this.handleEffectiveDateChange}
                        placeholder={getText('effectiveDatePlaceholder').toUpperCase()}
                        label={getText('effectiveDateLabel')}
                        value={veteranEffectiveDate}
                        invalid={effectiveDateErrorKeys.length > 0}
                        message={effectiveDateErrorMessage}
                    />
                </Grid>
                {!isTaxExemptionEnabled && (
                    <Box>
                        <TaxClaimAddressComponent
                            localizedAddressTitle={getText('addressTitle')}
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
                            handleAddressErrorsFromStepFour={this.props.handleAddressErrorsFromStepFour}
                            selectedCategory={this.props.selectedCategory}
                            updateStep4Data={updateStep4Data}
                            formErrors={formErrors}
                        />
                    </Box>
                )}
            </Box>
        );
    }
}

const styles = {
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

export default wrapComponent(DisabledVetsOfOklahomaInputs, 'DisabledVetsOfOklahomaInputs');
