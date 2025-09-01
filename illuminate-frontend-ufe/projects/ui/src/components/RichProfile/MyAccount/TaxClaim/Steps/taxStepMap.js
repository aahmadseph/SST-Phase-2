import localeUtils from 'utils/LanguageLocale';

const taxClaimGetText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

export const taxStepMap = {
    TaxExemptionCategoryStep: {
        title: taxClaimGetText('categoryStepTitle'),
        displayName: taxClaimGetText('categoryStepDisplayName')
    },
    UploadDocumentsStep: {
        title: taxClaimGetText('uploadStepTitle'),
        displayName: taxClaimGetText('uploadStepDisplayName')
    },
    OrderNumberInputStep: {
        title: taxClaimGetText('orderNumberInputStepTitle'),
        displayName: taxClaimGetText('orderNumberInputStepDisplayName')
    },
    TaxExemptionInfoStep: {
        title: taxClaimGetText('taxExemptionInfoStepTitle'),
        displayName: taxClaimGetText('taxExemptionInfoStepDisplayName')
    },
    AdditionalCommentsStep: {
        title: taxClaimGetText('additionalCommentsStepTitle'),
        displayName: taxClaimGetText('additionalCommentsStepDisplayName')
    },
    FinalReviewStep: {
        title: taxClaimGetText('finalReviewStepTitle'),
        displayName: taxClaimGetText('finalReviewStepDisplayName')
    }
};
