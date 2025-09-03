import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import taxClaimSelector from 'selectors/page/taxClaim/taxClaimSelector';
import FrameworkUtils from 'utils/framework';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import { wizardFormDataSelector, wizardFormErrorsSelector } from 'selectors/taxClaim/wizardFormSelector';
import { step4VariationDataSelector } from 'selectors/taxClaim/step4VariationData';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import TaxClaimActions from 'actions/TaxClaimActions';
import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';
import isInitializedSelector from 'selectors/user/isInitializedSelector';
import HistoryLocationActions from 'actions/framework/HistoryLocationActions';
import { categoryTypesSelector } from 'selectors/taxClaim/categoryTypesSelector';
import { categoryTypesErrorSelector } from 'selectors/taxClaim/categoryTypesErrorSelector';
import taxSubmitResponseSelector from 'selectors/page/taxClaim/taxSubmitResponseSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

const fields = createSelector(
    isAnonymousSelector,
    taxClaimSelector,
    wizardFormDataSelector,
    wizardFormErrorsSelector,
    happeningUserDataSelector,
    isInitializedSelector,
    step4VariationDataSelector,
    categoryTypesSelector,
    categoryTypesErrorSelector,
    taxSubmitResponseSelector,
    createStructuredSelector({
        transactionTaxRefunds: getTextFromResource(getText, 'transactionTaxRefunds'),
        generalInfo: getTextFromResource(getText, 'generalInfo')
    }),
    (
        isAnonymous,
        taxClaim,
        wizardFormData,
        wizardFormErrors,
        userData,
        isInitialized,
        step4VariationData,
        categoryTypes,
        categoryTypesError,
        taxApiResponse,
        textResources
    ) => {
        // Add step4VariationData to the parameters
        // Initialize content based on whether the user is initialized
        let content;
        let subTitle = null;
        const orderDate = taxClaim?.orderDetails?.orderDate;

        if (isInitialized) {
            // If user is initialized, decide content based on anonymity
            content = isAnonymous ? taxClaim.anonCopy?.content : taxClaim.generalCopy?.content;
            subTitle = !isAnonymous ? textResources.generalInfo : null;
        } else {
            // If user is not initialized, nothing at all should be shown
            content = null;
        }

        // Grouping firstName, lastName, and email into userGeneralData object
        const userGeneralData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };

        // Merge orderDate and other props into wizardFormData
        const updatedWizardFormData = {
            ...wizardFormData,
            orderDate,
            userGeneralData
        };

        const taxSubmitApiResponses = {
            submitSuccess: taxApiResponse.taxFormSubmitSuccess,
            submitError: taxApiResponse.taxFormSubmitError
        };

        return {
            content,
            title: textResources.transactionTaxRefunds,
            subTitle,
            wizardFormData: updatedWizardFormData,
            wizardFormErrors,
            userGeneralData,
            step4VariationData,
            categoryTypes,
            startAppText: getText('startApplication'),
            initAppErrorText: categoryTypesError?.message ? getText(categoryTypesError?.message) : null,
            userIsLoggedIn: isInitialized && !isAnonymous,
            taxSubmitApiResponses
        };
    }
);

const functions = {
    initTaxFlow: TaxClaimActions.initTaxFlow,
    setWizardCurrentStep: TaxClaimActions.setWizardCurrentStep,
    addWizardFormData: TaxClaimActions.addWizardFormData,
    updateStep4Data: TaxClaimActions.updateStep4Data,
    getOrderDetails: TaxClaimActions.getOrderDetails,
    submitFinalTaxForm: TaxClaimActions.submitFinalTaxFormAction,
    replaceLocation: HistoryLocationActions.replaceLocation,
    handleApiSubmitError: TaxClaimActions.handleApiSubmitError,
    addShippingAddress: TaxClaimActions.addShippingAddress,
    setDefaultShippingAddress: TaxClaimActions.setDefaultShippingAddressAction
};

const withTaxClaimProps = wrapHOC(connect(fields, functions));

export {
    withTaxClaimProps, fields, functions
};
