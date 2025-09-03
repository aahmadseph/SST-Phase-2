import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Text } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import localeUtils from 'utils/LanguageLocale';

// Define boolean constants
const BOOLEAN_VALUES = {
    YES: true,
    NO: false
};

const CreditCardIssuedRadioGroup = ({ creditCardIssued, onChange }) => {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    const handleRadioChange = event => {
        const { value } = event.target;
        const booleanValue = value === 'true' ? BOOLEAN_VALUES.YES : BOOLEAN_VALUES.NO;
        onChange(booleanValue);
    };

    return (
        <Grid
            columns='1fr'
            gap='16'
        >
            <Radio
                name='creditCardIssued'
                value={BOOLEAN_VALUES.YES}
                checked={creditCardIssued === BOOLEAN_VALUES.YES}
                onChange={handleRadioChange}
                hasFocusStyles={false}
            >
                <Text>{getText('yes')}</Text>
            </Radio>
            <Radio
                name='creditCardIssued'
                value={BOOLEAN_VALUES.NO}
                checked={creditCardIssued === BOOLEAN_VALUES.NO}
                onChange={handleRadioChange}
                hasFocusStyles={false}
            >
                <Text>{getText('no')}</Text>
            </Radio>
        </Grid>
    );
};

export default wrapFunctionalComponent(CreditCardIssuedRadioGroup, 'CreditCardIssuedRadioGroup');
