import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import localeUtils from 'utils/LanguageLocale';
import framework from 'utils/framework';

const { wrapHOC } = framework;

const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

const fields = createSelector(
    createStructuredSelector({
        taxExemptAddress: getTextFromResource(getText, 'taxExemptAddress'),
        taxExemptAddressSubtitle: getTextFromResource(getText, 'taxExemptAddressSubtitle')
    }),
    textResources => {
        return {
            ...textResources
        };
    }
);

const functions = {};

const withAddressFormProps = wrapHOC(connect(fields, functions));

export {
    withAddressFormProps, fields, functions
};
