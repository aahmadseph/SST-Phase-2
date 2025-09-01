import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import taxClaimSelector from 'selectors/page/taxClaim/taxClaimSelector';

// Select the wizardForm from the state
const wizardFormSelector = state => {
    return state.page?.taxClaim?.wizardForm || Empty.Object;
};

// Create a selector that transforms the stepData array into a single object
const wizardFormDataSelector = createSelector(wizardFormSelector, taxClaimSelector, (wizardForm, taxClaim) => {
    // Guard clause to handle undefined stepData
    if (!wizardForm.stepData) {
        return Empty.Object;
    }

    // Extract currentCategoryLabel from the wizardForm
    const currentCategoryLabel = wizardForm.currentCategoryLabel || '';
    const currentCategory = wizardForm.currentCategory || '';
    const selectedOrders = wizardForm.selectedOrders;
    // Only use documents from upload step for consistency
    const uploadedDocuments =
        wizardForm?.stepData[1] && wizardForm?.stepData[1].formData ? wizardForm.stepData[1].formData.uploadDocuments || Empty.Array : Empty.Array;

    return wizardForm.stepData.reduce((formData, step) => {
        return {
            ...formData,
            ...step.formData,
            uploadCopy: taxClaim.uploadCopy?.content,
            ordersCopy: taxClaim.ordersCopy?.content,
            consentCopy: taxClaim.consentCopy?.content,
            currentCategoryLabel,
            currentCategory,
            uploadedTaxDocuments: uploadedDocuments,
            selectedOrders
        };
    }, Empty.Object);
});

// Create a selector that transforms the stepData array into a single object for form errors
const wizardFormErrorsSelector = createSelector(
    wizardFormSelector,
    state => state.page?.taxClaim?.genericOrderNumberErrorExists || false,
    (wizardForm, genericOrderNumberErrorExists) => {
        // Guard clause to handle undefined stepData
        if (!wizardForm.stepData) {
            return {
                formErrors: { genericOrderNumberErrorExists }
            };
        }

        // Initialize accumulated errors
        const formErrors = wizardForm.stepData.reduce((accumulatedErrors, step) => {
            // Merge current step's errors with accumulated errors
            Object.keys(step.formErrors || {}).forEach(key => {
                // If the current error is not null, add or update it
                if (step.formErrors[key] !== null) {
                    accumulatedErrors[key] = step.formErrors[key];
                }
            });

            return accumulatedErrors;
        }, {});

        // Merge genericOrderNumberErrorExists to formErrors
        return {
            formErrors: {
                ...formErrors,
                genericOrderNumberErrorExists
            }
        };
    }
);

export {
    wizardFormDataSelector, wizardFormErrorsSelector
};
