import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import { tiledProfileContentSelector } from 'viewModel/header/beautyPreferences/tiledProfileContent/withTiledProfileContentProps';
import { localization } from 'viewModel/header/beautyPreferences/preferencesModal/withPreferencesModalProps';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const preferencesModalTextResources = localization;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/BeautyProfileHeading/locales', 'BeautyProfileHeading');

const textItemsSelector = createStructuredSelector({
    selectOne: getTextFromResource(getText, 'selectOne'),
    selectAllThatApply: getTextFromResource(getText, 'selectAllThatApply'),
    skinType: getTextFromResource(getText, 'skinType'),
    skinConcerns: getTextFromResource(getText, 'skinConcerns'),
    skinTone: getTextFromResource(getText, 'skinTone'),
    hairDescrible: getTextFromResource(getText, 'hairDescrible'),
    hairTexture: getTextFromResource(getText, 'hairTexture'),
    hairConcerns: getTextFromResource(getText, 'hairConcerns'),
    hairConcernsBenefits: getTextFromResource(getText, 'hairConcernsBenefits'),
    hairColor: getTextFromResource(getText, 'hairColor'),
    eyeColor: getTextFromResource(getText, 'eyeColor'),
    ageRange: getTextFromResource(getText, 'ageRange'),
    fragrancePreferences: getTextFromResource(getText, 'fragrancePreferences'),
    shoppingPreferences: getTextFromResource(getText, 'shoppingPreferences'),
    ingredientPreferences: getTextFromResource(getText, 'ingredientPreferences'),
    favoriteBrands: getTextFromResource(getText, 'favoriteBrands'),
    colorIQ: getTextFromResource(getText, 'colorIQ'),
    ofText: getTextFromResource(getText, 'ofText')
});

const fields = createSelector(
    beautyPreferencesSelector,
    textItemsSelector,
    preferencesModalTextResources,
    tiledProfileContentSelector,
    (beautyPreferencesState, textResources, preferencesModalTexts, tiledTextResources) => {
        const brandNames = beautyPreferencesState?.mappedBrandsList?.brandNames || Empty.Object;

        return {
            ...preferencesModalTexts,
            ...tiledTextResources,
            ...textResources,
            brandNames
        };
    }
);

const withBeautyProfileHeadingProps = wrapHOC(connect(fields));

export {
    textItemsSelector, fields, withBeautyProfileHeadingProps
};
