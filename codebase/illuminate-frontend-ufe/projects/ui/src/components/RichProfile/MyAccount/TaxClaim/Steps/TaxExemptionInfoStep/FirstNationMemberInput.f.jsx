import React from 'react';
import { Box, Grid } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import localeUtils from 'utils/LanguageLocale';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import { wrapFunctionalComponent } from 'utils/framework';
import ErrorConstants from 'utils/ErrorConstants';
import FormValidator from 'utils/FormValidator';

const {
    ERROR_CODES: {
        REGISTRATION_NUMBER_EMPTY, REGISTRATION_NUMBER_INVALID, REGISTRY_GROUP_EMPTY, REGISTRY_BAND_EMPTY, NAME_OF_RESERVATION_EMPTY
    }
} = ErrorConstants;

const FirstNationMemberInput = props => {
    const {
        registrationNumber, registryGroupNumber, registryBandName, nameOfReservation, aliasName, formErrors
    } = props;

    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    const handleRegistrationNumberChange = event => {
        const { value } = event.target;
        props.handleRegistrationNumberChange(value);
        props.updateStep4Data('fa', 'registrationNumber', value);

        if (!TaxFormValidator.validateRegistrationNumber(value)) {
            props.clearErrors('fnmErrors', REGISTRATION_NUMBER_EMPTY);
            props.clearErrors('fnmErrors', REGISTRATION_NUMBER_INVALID);
        }
    };

    const handleAliasChange = event => {
        const { value } = event.target;
        props.handleAliasChange(value);
        props.updateStep4Data('fa', 'alias', value);
    };

    const handleRegistryGroupChange = event => {
        const { value } = event.target;
        props.handleRegistryGroupChange(value);
        props.updateStep4Data('fa', 'registryGroupNumber', value);

        if (!TaxFormValidator.validateRegistryGroup(value)) {
            props.clearErrors('fnmErrors', REGISTRY_GROUP_EMPTY);
        }
    };

    const handleRegistryBandChange = event => {
        const { value } = event.target;
        props.handleRegistryBandChange(value);
        props.updateStep4Data('fa', 'registryBandName', value);

        if (!TaxFormValidator.validateRegistryBand(value)) {
            props.clearErrors('fnmErrors', REGISTRY_BAND_EMPTY);
        }
    };

    const handleNameOfReservationChange = event => {
        const { value } = event.target;
        props.handleNameOfReservationChange(value);
        props.updateStep4Data('fa', 'nameOfReservation', value);

        if (!TaxFormValidator.validateNameOfReservation(value)) {
            props.clearErrors('fnmErrors', NAME_OF_RESERVATION_EMPTY);
        }
    };

    const hasRegistrationEmptyError = Boolean(formErrors?.fnmErrors?.registrationNumberEmpty);
    const hasRegistrationInvaidError = Boolean(formErrors?.fnmErrors?.registrationNumberInvalid);
    const hasRegistryGroupError = Boolean(formErrors?.fnmErrors?.registryGroupEmpty);
    const hasRegistryBandError = Boolean(formErrors?.fnmErrors?.registryBandNameEmpty);
    const hasEmptyNameOfReservationError = Boolean(formErrors?.fnmErrors?.nameOfReservationEmpty);

    const registrationErrorMessage = hasRegistrationEmptyError ? getText(`${REGISTRATION_NUMBER_EMPTY}`) : getText(`${REGISTRATION_NUMBER_INVALID}`);

    return (
        <Box>
            <Grid>
                <TextInput
                    label={getText('registrationNumber')}
                    value={registrationNumber}
                    onChange={handleRegistrationNumberChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.registrationNumber}
                    invalid={hasRegistrationEmptyError || hasRegistrationInvaidError}
                    message={hasRegistrationEmptyError || hasRegistrationInvaidError ? registrationErrorMessage : ''}
                    onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                    onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                />
            </Grid>
            <Grid>
                <TextInput
                    label={getText('alias')}
                    value={aliasName}
                    onChange={handleAliasChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.registrationNumber}
                    onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                    onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                />
            </Grid>
            <Grid
                gap={1}
                gridTemplateColumns='1fr 1fr'
            >
                <TextInput
                    label={getText('registryGroupNumber')}
                    value={registryGroupNumber}
                    onChange={handleRegistryGroupChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.registryGroupNumber}
                    onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                    onPaste={FormValidator.pasteAcceptOnlyNumbers}
                    invalid={hasRegistryGroupError}
                    message={hasRegistryGroupError ? getText(`${REGISTRY_GROUP_EMPTY}`) : ''}
                />
                <TextInput
                    label={getText('registryBandName')}
                    value={registryBandName}
                    onChange={handleRegistryBandChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.registryBandName}
                    invalid={hasRegistryBandError}
                    message={hasRegistryBandError ? getText(`${REGISTRY_BAND_EMPTY}`) : ''}
                    onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                    onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                />
            </Grid>
            <Grid>
                <TextInput
                    label={getText('nameOfReservation')}
                    value={nameOfReservation}
                    onChange={handleNameOfReservationChange}
                    maxLength={TaxFormValidator.FIELD_LENGTHS.registryBandName}
                    invalid={hasEmptyNameOfReservationError}
                    message={hasEmptyNameOfReservationError ? getText(`${NAME_OF_RESERVATION_EMPTY}`) : ''}
                    onKeyDown={TaxFormValidator.inputAcceptOnlyAlphaNumeric}
                    onPaste={TaxFormValidator.pasteAcceptOnlyAlphaNumeric}
                />
            </Grid>
        </Box>
    );
};

export default wrapFunctionalComponent(FirstNationMemberInput, 'FirstNationMemberInput');
