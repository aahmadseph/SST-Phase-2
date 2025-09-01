import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Grid, Text } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes, fontWeights, colors } from 'style/config';
import ErrorConstants from 'utils/ErrorConstants';
import Empty from 'constants/empty';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';

const {
    ERROR_CODES: { TRIBE_NAME_EMPTY, TRIBE_RESERVE_NAME_EMPTY }
} = ErrorConstants;

const IndigenousAmericanInputs = props => {
    const { updateStep4Data, formErrors, taxClaimGetText, wizardFormData } = props;
    const { tribeName, tribeIdNumber, tribeReserveName } = wizardFormData;

    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    const handleTribeNameChange = event => {
        const { value } = event.target;

        props.handleTribeNameChange(value);
        updateStep4Data('ia', 'tribeName', value);

        const tribeNameError = TaxFormValidator.validateTribeName(value);

        if (!tribeNameError) {
            props.clearErrors('tribeNameErrors', TRIBE_NAME_EMPTY);
        }
    };

    const handleTribeIdNumberChange = event => {
        const { value } = event.target;

        props.handleTribeIdNumberChange(value);

        updateStep4Data('ia', 'tribeIdNumber', value);
    };

    const handleTribeReserveNameChange = event => {
        const { value } = event.target;

        props.handleTribeReserveNameChange(value);

        updateStep4Data('ia', 'tribeReserveName', value);

        const tribeReserveNameError = TaxFormValidator.validateTribeReserveName(value);

        if (!tribeReserveNameError) {
            props.clearErrors('tribeReserveNameErrors', TRIBE_RESERVE_NAME_EMPTY);
        }
    };

    const tribeNameErrors = formErrors?.tribeNameErrors || Empty.Object;
    const tribeReserveNameErrors = formErrors?.tribeReserveNameErrors || Empty.Object;

    const tribeNameHasError = Boolean(tribeNameErrors.tribeNameEmpty);
    const tribeNameErrorMessage = tribeNameHasError ? taxClaimGetText(TRIBE_NAME_EMPTY) : '';

    const tribeReserveNameHasError = Boolean(tribeReserveNameErrors.tribeReserveNameEmpty);
    const tribeReserveNameErrorMessage = tribeReserveNameHasError ? taxClaimGetText(TRIBE_RESERVE_NAME_EMPTY) : '';

    return (
        <Box>
            <Grid columns='1fr'>
                <TextInput
                    label={getText('tribeNameInputLabel')}
                    value={tribeName}
                    onChange={handleTribeNameChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.tribeName}
                    validateError={TaxFormValidator.validateTribeName}
                    invalid={tribeNameHasError}
                    message={tribeNameHasError ? tribeNameErrorMessage : ''}
                />

                <TextInput
                    label={getText('tribeIdNumberInputLabel')}
                    value={tribeIdNumber}
                    onChange={handleTribeIdNumberChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.tribalIdNumber}
                />

                <TextInput
                    label={getText('tribeReserveNameLabel')}
                    value={tribeReserveName}
                    onChange={handleTribeReserveNameChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.tribeReserveName}
                    minLength={TaxFormValidator.FIELD_LENGTHS.tribeReserveNameMin}
                    onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                    validateError={TaxFormValidator.validateTribeReserveName}
                    invalid={tribeReserveNameHasError}
                    message={tribeReserveNameHasError ? tribeReserveNameErrorMessage : ''}
                />
            </Grid>

            <Box>
                <Text
                    is='h3'
                    css={styles.idCardLabel}
                >
                    {getText('idCardLabel')}
                </Text>
            </Box>
        </Box>
    );
};

const styles = {
    idCardLabel: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red,
        marginTop: '16px',
        marginBottom: '16px'
    }
};

export default wrapFunctionalComponent(IndigenousAmericanInputs, 'IndigenousAmericanInputs');
