import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import localeUtils from 'utils/LanguageLocale';
import framework from 'utils/framework';

const { wrapHOC } = framework;

const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

const fields = createSelector(
    createStructuredSelector({
        taxExemptionTitle: getTextFromResource(getText, 'taxExemptionTitle'),
        taxExemptionMissingSelection: getTextFromResource(getText, 'taxExemptionMissingSelection')
    }),
    textResources => {
        const options = [
            {
                title: getText('taxExemptionDenyTitle'),
                subtitle: getText('taxExemptionDenySubtitle'),
                optInForTaxExemption: false
            },
            {
                title: getText('taxExemptionConfirmTitle'),
                subtitle: getText('taxExemptionConfirmSubtitle'),
                optInForTaxExemption: true
            }
        ];

        return {
            options,
            ...textResources
        };
    }
);

const functions = {};

const withTaxExemptionProps = wrapHOC(connect(fields, functions));

export {
    withTaxExemptionProps, fields, functions
};
