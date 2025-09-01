import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Grid } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import localeUtils from 'utils/LanguageLocale';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import Empty from 'constants/empty';
import { CategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';

const {
    VALIDATION_CONSTANTS: {
        FREIGHT_FORWARDER_NAME_EMPTY,
        FREIGHT_FORWARDER_NAME_INVALID,
        FREIGHT_FORWARDER_CERT_NUMBER_EMPTY,
        FREIGHT_FORWARDER_CERT_NUMBER_INVALID
    }
} = TaxFormValidator;

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
const MAX_FF_NAME_LENGTH = 50;
const MAX_FF_CERT_LENGTH = 25;

class FreightForwarderInputs extends BaseClass {
    handleFreightForwarderNameChange = event => {
        const { value } = event.target;

        // CB method from WizardForm
        this.props.handleFreightForwarderNameChange(value);
        this.props.updateStep4Data(CategoryType.EXPORT_SALE_FREIGHT_FORWARDER.toLowerCase(), 'freightForwarderName', value);

        const freightNameError = TaxFormValidator.validateFreightForwarderName(value);

        if (!freightNameError) {
            this.props.clearErrors('freightForwarderErrors', FREIGHT_FORWARDER_NAME_EMPTY);
            this.props.clearErrors('freightForwarderErrors', FREIGHT_FORWARDER_NAME_INVALID);
        }
    };

    handleFreightCertNumberChange = event => {
        const { value } = event.target;

        // CB method from WizardForm
        this.props.handleFreightCertNumberChange(value);
        this.props.updateStep4Data(CategoryType.EXPORT_SALE_FREIGHT_FORWARDER.toLowerCase(), 'freightForwarderCertNumber', value);

        const freightCertNumberError = TaxFormValidator.validateFreightForwarderCertNumber(value);

        if (!freightCertNumberError) {
            this.props.clearErrors('freightForwarderErrors', FREIGHT_FORWARDER_CERT_NUMBER_EMPTY);
            this.props.clearErrors('freightForwarderErrors', FREIGHT_FORWARDER_CERT_NUMBER_INVALID);
        }
    };

    render() {
        const { freightName, formErrors, freightCertNumber } = this.props;

        // Safeguard against null or undefined values
        const freightForwarderErrors = formErrors?.freightForwarderErrors || Empty.Object;

        // Error type checks
        const isFreightForwarderNameError = Boolean(freightForwarderErrors.freightForwarderNameEmpty);
        const isFreightForwarderNameInvalid = Boolean(freightForwarderErrors.freightForwarderNameInvalid);
        const isFreightCertNumberEmptyError = Boolean(freightForwarderErrors.freightForwarderCertNumberEmpty);
        const isFreightCertNumberInvalidError = Boolean(freightForwarderErrors.freightForwarderCertNumberInvalid);

        // Grab error messages from locale
        const freightForwarderNameErrorMessage = isFreightForwarderNameError
            ? getText('freightForwarderNameEmpty')
            : isFreightForwarderNameInvalid
                ? getText('freightForwarderNameInvalid')
                : '';

        const freightCertNumberErrorMessage = isFreightCertNumberEmptyError
            ? getText('freightForwarderCertEmpty')
            : isFreightCertNumberInvalidError
                ? getText('freightForwarderCertInvalid')
                : '';

        return (
            <Box>
                <Grid
                    columns='1fr'
                    gap='16'
                >
                    <TextInput
                        placeholder={getText('freightForwarderNameInputLabel')}
                        value={freightName}
                        onChange={this.handleFreightForwarderNameChange}
                        maxLength={MAX_FF_NAME_LENGTH}
                        validateError={TaxFormValidator.validateFreightForwarderName}
                        invalid={isFreightForwarderNameError || isFreightForwarderNameInvalid}
                        message={freightForwarderNameErrorMessage}
                        hideAsterisk={true}
                    />
                    <TextInput
                        placeholder={getText('freightForwarderCertNumberInputLabel')}
                        value={freightCertNumber}
                        onChange={this.handleFreightCertNumberChange}
                        maxLength={MAX_FF_CERT_LENGTH}
                        hideAsterisk={true}
                        invalid={isFreightCertNumberEmptyError || isFreightCertNumberInvalidError}
                        message={freightCertNumberErrorMessage}
                    />
                </Grid>
            </Box>
        );
    }
}

class FreightForwarderViewInfo extends BaseClass {
    render() {
        const { styles, step4VariationData, taxClaimGetText, wizardFormData } = this.props;
        const { issueDate, expirationDate } = wizardFormData || Empty.Object;

        return (
            <>
                <LegacyGrid.Cell>
                    <div css={styles.flexContainer}>
                        <span css={styles.viewLabel}>{taxClaimGetText('freightForwarderNameInputLabel')}:</span>
                        <span css={styles.viewLabelData}>{step4VariationData?.freightForwarderName}</span>
                    </div>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell>
                    <div css={styles.flexContainer}>
                        <span css={styles.viewLabel}>{taxClaimGetText('freightForwarderCertNumberInputLabel')}:</span>
                        <span css={styles.viewLabelData}>{step4VariationData?.freightForwarderCertNumber}</span>
                    </div>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell>
                    <div css={styles.flexContainer}>
                        <span css={styles.viewLabel}>{taxClaimGetText('certIssueDateLabel')}:</span>
                        <span css={styles.viewLabelData}>{issueDate}</span>
                    </div>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell>
                    <div css={styles.flexContainer}>
                        <span css={styles.viewLabel}>{taxClaimGetText('certExpirationDateLabel')}:</span>
                        <span css={styles.viewLabelData}>{expirationDate}</span>
                    </div>
                </LegacyGrid.Cell>
            </>
        );
    }
}

const FreightForwarderInputsWrapped = wrapComponent(FreightForwarderInputs, 'FreightForwarderInputs');
const FreightForwarderViewInfoWrapped = wrapComponent(FreightForwarderViewInfo, 'FreightForwarderViewInfo');

export default {
    FreightForwarderInputsWrapped,
    FreightForwarderViewInfoWrapped
};
