import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import localeUtils from 'utils/LanguageLocale';
import framework from 'utils/framework';
import { wizardFormDataSelector } from 'selectors/taxClaim/wizardFormSelector';

const { wrapHOC } = framework;

const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

const fields = createSelector(
    wizardFormDataSelector,
    createStructuredSelector({
        taxExemptAddress: getTextFromResource(getText, 'taxExemptAddress'),
        taxExemptAddressSubtitle: getTextFromResource(getText, 'taxExemptAddressSubtitle'),
        existingAddressLabel: getTextFromResource(getText, 'existingAddressLabel'),
        addAddressLabel: getTextFromResource(getText, 'addAddressLabel'),
        taxExemptionMissingSelection: getTextFromResource(getText, 'taxExemptionMissingSelection')
    }),
    (wizardFormData, textResources) => {
        const selectedCategory = wizardFormData.currentCategory;

        return {
            selectedCategory,
            ...textResources
        };
    }
);

const functions = {};

const withTaxAddressProps = wrapHOC(connect(fields, functions));

export {
    withTaxAddressProps, fields, functions
};
