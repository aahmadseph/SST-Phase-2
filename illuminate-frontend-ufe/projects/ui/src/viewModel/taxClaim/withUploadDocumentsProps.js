import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import localeUtils from 'utils/LanguageLocale';

import { wizardFormDataSelector } from 'selectors/taxClaim/wizardFormSelector';

import { FreightForwarderType, CategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';

const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

import TaxClaimActions from 'actions/TaxClaimActions';

const fields = createSelector(
    wizardFormDataSelector,
    createStructuredSelector({
        categoryStepSubtitle: getTextFromResource(getText, 'categoryStepSubtitle'),
        nextAction: getTextFromResource(getText, 'nextAction'),
        emptyText: getTextFromResource(getText, 'none'),
        maxDocumentsHint: getTextFromResource(getText, 'maxDocumentsHint'),
        missingFreightForwarder: getTextFromResource(getText, 'missingFreightForwarder'),
        invalidFile: getTextFromResource(getText, 'invalidFile')
    }),
    (wizardFormData, textResources) => {
        const {
            uploadedTaxDocuments, uploadCopy, taxExemptionCategory, selectedFreightForwarderType, currentCategory
        } = wizardFormData;
        const documentLabel = getText(taxExemptionCategory ? `documentsLabelFor${taxExemptionCategory}` : 'documentsLabelForO');
        const items = Object.entries(FreightForwarderType);
        const isFreightForwarderSelected = taxExemptionCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER;

        return {
            uploadedTaxDocuments,
            documentLabel,
            uploadCopy,
            taxExemptionCategory,
            selectedFreightForwarderType,
            items,
            isFreightForwarderSelected,
            currentCategory,
            ...textResources
        };
    }
);

const functions = {
    addWizardFormData: TaxClaimActions.addWizardFormData
};

const withUploadDocumentsProps = wrapHOC(connect(fields, functions));

export {
    withUploadDocumentsProps, fields, functions
};
