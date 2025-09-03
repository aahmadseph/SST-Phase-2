import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Empty from 'constants/empty';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/SearchableProfileContent/locales', 'SearchableProfileContent');

const localization = createStructuredSelector({
    viewIngredientList: getTextFromResource(getText, 'viewIngredientList'),
    ingredientPreferencesTitle: getTextFromResource(getText, 'ingredientPreferencesTitle'),
    ingredientPreferencesSearchText: getTextFromResource(getText, 'ingredientPreferencesSearchText'),
    viewAllBrands: getTextFromResource(getText, 'viewAllBrands'),
    favoriteBrandsTitle: getTextFromResource(getText, 'favoriteBrandsTitle'),
    favoriteBrandsSearchText: getTextFromResource(getText, 'favoriteBrandsSearchText')
});

const fields = createSelector(beautyPreferencesSelector, localization, (beautyPreferencesState, textResources) => {
    const brandIds = beautyPreferencesState?.mappedBrandsList?.brandIds || Empty.Array;

    return {
        textResources,
        brandIds
    };
});

const withSearchableProfileContentProps = wrapHOC(connect(fields));

export {
    fields, withSearchableProfileContentProps
};
