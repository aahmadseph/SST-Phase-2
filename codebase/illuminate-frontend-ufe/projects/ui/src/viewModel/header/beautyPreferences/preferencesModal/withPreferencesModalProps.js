/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Empty from 'constants/empty';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/PreferencesModal/locales', 'PreferencesModal');

const localization = createStructuredSelector({
    selectAllThatApply: getTextFromResource(getText, 'selectAllThatApply'),
    clear: getTextFromResource(getText, 'clear'),
    apply: getTextFromResource(getText, 'apply'),
    noResults: getTextFromResource(getText, 'noResults'),
    notSure: getTextFromResource(getText, 'notSure'),
    noPreference: getTextFromResource(getText, 'noPreference'),
    // ingredients
    aha_glycolic_acid: getTextFromResource(getText, 'aha_glycolic_acid'),
    alcoholFree: getTextFromResource(getText, 'alcoholFree'),
    antioxidants: getTextFromResource(getText, 'antioxidants'),
    benzoyl_peroxide: getTextFromResource(getText, 'benzoyl_peroxide'),
    bondBuilding: getTextFromResource(getText, 'bondBuilding'),
    cleanAtSephora: getTextFromResource(getText, 'cleanAtSephora'),
    crueltyFree: getTextFromResource(getText, 'crueltyFree'),
    fragrance_free: getTextFromResource(getText, 'fragrance_free'),
    hyaluronic_acid: getTextFromResource(getText, 'hyaluronic_acid'),
    hydroquinone: getTextFromResource(getText, 'hydroquinone'),
    mineral: getTextFromResource(getText, 'mineral'),
    naturallyDerived: getTextFromResource(getText, 'naturallyDerived'),
    oil_free: getTextFromResource(getText, 'oil_free'),
    organic: getTextFromResource(getText, 'organic'),
    paraben_free: getTextFromResource(getText, 'paraben_free'),
    peptides: getTextFromResource(getText, 'peptides'),
    retinoid: getTextFromResource(getText, 'retinoid'),
    salicylicAcid: getTextFromResource(getText, 'salicylicAcid'),
    siliconeFree: getTextFromResource(getText, 'siliconeFree'),
    squalane: getTextFromResource(getText, 'squalane'),
    sulfate_free: getTextFromResource(getText, 'sulfate_free'),
    sulfur: getTextFromResource(getText, 'sulfur'),
    vegan: getTextFromResource(getText, 'vegan'),
    vitamin_c: getTextFromResource(getText, 'vitamin_c'),
    cbd: getTextFromResource(getText, 'cbd'),
    mineralPhysical: getTextFromResource(getText, 'mineralPhysical'),
    niacinamide: getTextFromResource(getText, 'niacinamide'),
    nonComedogenic: getTextFromResource(getText, 'nonComedogenic'),
    zinc: getTextFromResource(getText, 'zinc')
});

const fields = createSelector(localization, beautyPreferencesSelector, (textResources, beautyPreferencesState) => {
    const brandNames = beautyPreferencesState?.mappedBrandsList?.brandNames || Empty.Object;
    const {
        selectAllThatApply, clear, apply, noResults, notSure, noPreference
    } = textResources;

    return {
        localization: {
            selectAllThatApply,
            clear,
            apply,
            noResults,
            notSure,
            noPreference
        },
        brandNames
    };
});

const withPreferencesModalProps = wrapHOC(connect(fields));

export {
    localization, fields, withPreferencesModalProps
};
