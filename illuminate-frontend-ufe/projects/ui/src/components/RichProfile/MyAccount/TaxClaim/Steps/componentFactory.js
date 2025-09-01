import React from 'react';
import TaxExemptionCategoryStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionCategoryStep';
import UploadDocumentsStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/UploadDocumentsStep';
import OrderNumberInputStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/OrderNumberInputStep';
import TaxExemptionInfoStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep';
import AdditionalCommentsStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/AdditionalCommentsStep';
import FinalReviewStep from 'components/RichProfile/MyAccount/TaxClaim/Steps/FinalReviewStep';

const componentMap = {
    TaxExemptionCategoryStep: {
        view: TaxExemptionCategoryStep.ConnectedTaxExemptionCategoryViewStep,
        edit: TaxExemptionCategoryStep.ConnectedTaxExemptionCategoryEditStep
    },
    UploadDocumentsStep: { view: UploadDocumentsStep.ConnectedUploadDocumentsViewStep, edit: UploadDocumentsStep.ConnectedUploadDocumentsEditStep },
    OrderNumberInputStep: {
        view: OrderNumberInputStep.ConnectedOrderNumberInputViewStep,
        edit: OrderNumberInputStep.ConnectedOrderNumberInputEditStep
    },
    TaxExemptionInfoStep: {
        view: TaxExemptionInfoStep.TaxExemptionInfoStepViewWrapped,
        edit: TaxExemptionInfoStep.TaxExemptionInfoStepEditWrapped
    },
    AdditionalCommentsStep: {
        view: AdditionalCommentsStep.AdditionalCommentsStepViewWrapped,
        edit: AdditionalCommentsStep.AdditionalCommentsStepEditWrapped
    },
    FinalReviewStep: {
        edit: FinalReviewStep.FinalReviewStepEditWrapped
    }
};

export function createComponent(type, mode, props) {
    // TaxExemptionInfoStep
    const Component = componentMap[type][mode];

    // If there's no component for the requested mode, default to view
    return Component ? <Component {...props} /> : null;
}
