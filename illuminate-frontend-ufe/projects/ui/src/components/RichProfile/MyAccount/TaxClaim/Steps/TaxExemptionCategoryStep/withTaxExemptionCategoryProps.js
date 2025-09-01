import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import localeUtils from 'utils/LanguageLocale';

import { wizardFormDataSelector } from 'selectors/taxClaim/wizardFormSelector';
import { categoryTypesSelector } from 'selectors/taxClaim/categoryTypesSelector';

const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

import TaxClaimActions from 'actions/TaxClaimActions';

const fields = createSelector(
    wizardFormDataSelector,
    categoryTypesSelector,
    createStructuredSelector({
        categoryStepSubtitle: getTextFromResource(getText, 'categoryStepSubtitle'),
        nextAction: getTextFromResource(getText, 'nextAction')
    }),
    (wizardFormData, categoryTypes, textResources) => {
        const items = categoryTypes;
        const categories = items.map(({ category }) => ({
            categoryType: category,
            displayName: getText(`categoryTitleFor${category}`)
        }));
        const selectedCategory = wizardFormData.currentCategory;

        return {
            selectedCategory,
            categories,
            ...textResources
        };
    }
);

const functions = {
    addWizardFormData: TaxClaimActions.addWizardFormData
};

const withTaxExemptionCategoryProps = wrapHOC(connect(fields, functions));

export {
    withTaxExemptionCategoryProps, fields, functions
};
