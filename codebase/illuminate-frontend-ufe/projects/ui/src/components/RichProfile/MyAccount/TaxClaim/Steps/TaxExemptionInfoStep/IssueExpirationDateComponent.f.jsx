import React from 'react';
import { Box, Grid, Text } from 'components/ui';
import InputDate from 'components/Inputs/InputDate/InputDate';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes, fontWeights, space } from 'style/config';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import { wrapFunctionalComponent } from 'utils/framework';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';

const {
    ERROR_CODES: {
        ISSUE_DATE_EMPTY,
        EXPIRATION_DATE_EMPTY,
        DATE_RANGE_INVALID,
        ISSUE_DATE_OUT_OF_BOUNDS,
        EXPIRATION_DATE_OUT_OF_BOUNDS,
        EXPIRATION_DATE_INVALID
    }
} = ErrorConstants;

const IssueExpirationDateComponent = props => {
    const { title, issueDate, expirationDate, formErrors } = props;
    const selectedCategory = props.selectedCategory.toLowerCase();

    const appendAddressDataToStepFourReduxData = (category, objectKey, value) => {
        props.updateStep4Data(category, objectKey, value);
    };

    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    const hasEmptyIssueDateError = Boolean(formErrors?.issueDateErrors?.issueDateEmpty);
    const hasExpirationDateError = Boolean(
        formErrors?.expirationDateErrors?.expirationDateEmpty || formErrors?.expirationDateErrors?.expirationDateInvalid
    );
    const hasOutOfBoundsIssueDateError = Boolean(formErrors?.issueDateErrors?.issueDateOutOfBounds);
    const hasOutOfBoundsExpirationDateError = Boolean(formErrors?.expirationDateErrors?.expirationDateOutOfBounds);
    const hasError = Boolean(hasEmptyIssueDateError || hasExpirationDateError);

    const emptyIssueDateMsg = hasEmptyIssueDateError && ErrorsUtils.getMessage(ISSUE_DATE_EMPTY);
    const emptyExpDateMsg = formErrors?.expirationDateErrors?.expirationDateEmpty
        ? ErrorsUtils.getMessage(EXPIRATION_DATE_EMPTY)
        : formErrors?.expirationDateErrors?.expirationDateInvalid
            ? ErrorsUtils.getMessage(EXPIRATION_DATE_INVALID)
            : null;
    const outOfBoundsIssueDateMsg = hasOutOfBoundsIssueDateError && ErrorsUtils.getMessage(ISSUE_DATE_OUT_OF_BOUNDS);
    const outOfBoundsExpDateMsg = hasOutOfBoundsExpirationDateError && ErrorsUtils.getMessage(EXPIRATION_DATE_OUT_OF_BOUNDS);

    const handleInitialDateChange = event => {
        const { value } = event.target;
        const issueDateChanged = 'issueDate';
        props.handleInitialDateChange(value);
        appendAddressDataToStepFourReduxData(selectedCategory, issueDateChanged, value);

        if (value) {
            props.clearErrors('issueDateErrors', ISSUE_DATE_EMPTY);

            const isInvalid = TaxFormValidator.validateIssueDate(value);

            if (!isInvalid) {
                props.clearErrors('issueDateErrors', ISSUE_DATE_OUT_OF_BOUNDS);
            }
        }
    };

    const handleEndDateChange = event => {
        const { value } = event.target;
        const localExpDate = 'expirationDate';
        props.handleEndDateChange(value);
        appendAddressDataToStepFourReduxData(selectedCategory, localExpDate, value);

        if (value && props.issueDate) {
            props.clearErrors('expirationDateErrors', EXPIRATION_DATE_EMPTY);

            const isInvalid = TaxFormValidator.validateExpirationDate(value, issueDate);

            if (!isInvalid) {
                props.clearErrors('expirationDateErrors', DATE_RANGE_INVALID);
                props.clearErrors('expirationDateErrors', EXPIRATION_DATE_INVALID);
                props.clearErrors('expirationDateErrors', EXPIRATION_DATE_OUT_OF_BOUNDS);
            }
        }
    };

    return (
        <Box>
            <Text
                is='h3'
                css={styles.idCardLabel}
            >
                {title}
            </Text>
            {hasError && (
                <InputMsg
                    role={hasError ? 'alert' : null}
                    color={hasError ? 'error' : null}
                    children={getText(DATE_RANGE_INVALID)}
                    css={styles.invalidDate}
                />
            )}
            <Grid
                gap={1}
                gridTemplateColumns='1fr 1fr'
            >
                <InputDate
                    min='1900-01-01'
                    max='2099-12-31'
                    css={styles.inputDate}
                    onChange={handleInitialDateChange}
                    placeholder={getText('issueDateInputLabel')}
                    label={getText('issueDateInputLabel')}
                    value={issueDate}
                    invalid={hasEmptyIssueDateError || hasOutOfBoundsIssueDateError}
                    message={hasEmptyIssueDateError ? emptyIssueDateMsg : hasOutOfBoundsIssueDateError ? outOfBoundsIssueDateMsg : null}
                />
            </Grid>
            <Grid
                gap={1}
                gridTemplateColumns='1fr 1fr'
            >
                <InputDate
                    min='1900-01-01'
                    max='2099-12-31'
                    css={styles.inputDate}
                    onChange={handleEndDateChange}
                    placeholder={getText('expirationDateInputLabel')}
                    label={getText('expirationDateInputLabel')}
                    value={expirationDate}
                    invalid={hasExpirationDateError || hasOutOfBoundsExpirationDateError}
                    message={hasExpirationDateError ? emptyExpDateMsg : hasOutOfBoundsExpirationDateError ? outOfBoundsExpDateMsg : null}
                />
            </Grid>
        </Box>
    );
};

const styles = {
    inputDate: {
        width: '45%'
    },
    idCardLabel: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold
    },
    invalidDate: {
        fontSizes: fontSizes.base,
        lineHeight: '18px',
        marginBottom: space[4]
    }
};

export default wrapFunctionalComponent(IssueExpirationDateComponent, 'IssueExpirationDateComponent');
