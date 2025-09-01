/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { localization as preferencesModalTextResources } from 'viewModel/header/beautyPreferences/preferencesModal/withPreferencesModalProps';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Header/BeautyPreferences/TiledProfileContent/locales', 'TiledProfileContent');

const tiledProfileContentSelector = createStructuredSelector({
    notSure: getTextFromResource(getText, 'notSure'),
    noPreference: getTextFromResource(getText, 'noPreference'),
    // fragnance
    floral: getTextFromResource(getText, 'floral'),
    warmspicy: getTextFromResource(getText, 'warmspicy'),
    fresh: getTextFromResource(getText, 'fresh'),
    woodyEarthy: getTextFromResource(getText, 'woodyEarthy'),
    // haircolor
    blonde: getTextFromResource(getText, 'blonde'),
    brown: getTextFromResource(getText, 'brown'),
    auburn: getTextFromResource(getText, 'auburn'),
    black: getTextFromResource(getText, 'black'),
    red: getTextFromResource(getText, 'red'),
    gray: getTextFromResource(getText, 'gray'),
    // skinTone
    fairLight: getTextFromResource(getText, 'fairLight'),
    fair: getTextFromResource(getText, 'fair'),
    light: getTextFromResource(getText, 'light'),
    lightMedium: getTextFromResource(getText, 'lightMedium'),
    medium: getTextFromResource(getText, 'medium'),
    mediumTan: getTextFromResource(getText, 'mediumTan'),
    tan: getTextFromResource(getText, 'tan'),
    deep: getTextFromResource(getText, 'deep'),
    rich: getTextFromResource(getText, 'rich'),
    // skinType
    comboSk: getTextFromResource(getText, 'comboSk'),
    drySk: getTextFromResource(getText, 'drySk'),
    normalSk: getTextFromResource(getText, 'normalSk'),
    oilySk: getTextFromResource(getText, 'oilySk'),
    // eyeColor
    blue: getTextFromResource(getText, 'blue'),
    green: getTextFromResource(getText, 'green'),
    hazel: getTextFromResource(getText, 'hazel'),
    // hairConcerns
    curlEnhancing: getTextFromResource(getText, 'curlEnhancing'),
    heatProtection: getTextFromResource(getText, 'heatProtection'),
    'hold_&style_extending': getTextFromResource(getText, 'hold_&style_extending'),
    oily_scalp: getTextFromResource(getText, 'oily_scalp'),
    scalp_build_up: getTextFromResource(getText, 'scalp_build_up'),
    shine: getTextFromResource(getText, 'shine'),
    volumizing: getTextFromResource(getText, 'volumizing'),
    brassiness: getTextFromResource(getText, 'brassiness'),
    colorFading: getTextFromResource(getText, 'colorFading'),
    colorSafe: getTextFromResource(getText, 'colorSafe'),
    damageSplitEnds: getTextFromResource(getText, 'damageSplitEnds'),
    dandruff: getTextFromResource(getText, 'dandruff'),
    flakyDryScalp: getTextFromResource(getText, 'flakyDryScalp'),
    frizzHr: getTextFromResource(getText, 'frizzHr'),
    straighteningSmoothing: getTextFromResource(getText, 'straighteningSmoothing'),
    thinning: getTextFromResource(getText, 'thinning'),
    uvprorection: getTextFromResource(getText, 'uvprorection'),
    //hairDescrible
    fine: getTextFromResource(getText, 'fine'),
    thick: getTextFromResource(getText, 'thick'),
    // hairTexture
    curly: getTextFromResource(getText, 'curly'),
    straight: getTextFromResource(getText, 'straight'),
    wavy: getTextFromResource(getText, 'wavy'),
    coily: getTextFromResource(getText, 'coily'),
    // skinConcerns
    acneBlemishes: getTextFromResource(getText, 'acneBlemishes'),
    antiAging: getTextFromResource(getText, 'antiAging'),
    darkCircles: getTextFromResource(getText, 'darkCircles'),
    unevenTexture: getTextFromResource(getText, 'unevenTexture'),
    pores: getTextFromResource(getText, 'pores'),
    puffiness: getTextFromResource(getText, 'puffiness'),
    redness: getTextFromResource(getText, 'redness'),
    unevenSkinTone: getTextFromResource(getText, 'unevenSkinTone'),
    darkSpots: getTextFromResource(getText, 'darkSpots'),
    dryness: getTextFromResource(getText, 'dryness'),
    fineLinesWrinkles: getTextFromResource(getText, 'fineLinesWrinkles'),
    lossOfFirmnessElasticity: getTextFromResource(getText, 'lossOfFirmnessElasticity'),
    // ageRange
    '20s': getTextFromResource(getText, '20s'),
    '30s': getTextFromResource(getText, '30s'),
    '40s': getTextFromResource(getText, '40s'),
    '50s': getTextFromResource(getText, '50s'),
    // shoppingPreferences
    bestOfAllure: getTextFromResource(getText, 'bestOfAllure'),
    bestOfAllureDesc: getTextFromResource(getText, 'bestOfAllureDesc'),
    bipocOwnedBrands: getTextFromResource(getText, 'bipocOwnedBrands'),
    bipocOwnedBrandsDesc: getTextFromResource(getText, 'bipocOwnedBrandsDesc'),
    blackOwnedBrands: getTextFromResource(getText, 'blackOwnedBrands'),
    blackOwnedBrandsDesc: getTextFromResource(getText, 'blackOwnedBrandsDesc'),
    onlyAtSephora: getTextFromResource(getText, 'onlyAtSephora'),
    onlyAtSephoraDesc: getTextFromResource(getText, 'onlyAtSephoraDesc'),
    luxuryFragrance: getTextFromResource(getText, 'luxuryFragrance'),
    luxuryFragranceDesc: getTextFromResource(getText, 'luxuryFragranceDesc'),
    luxuryHair: getTextFromResource(getText, 'luxuryHair'),
    luxuryHairDesc: getTextFromResource(getText, 'luxuryHairDesc'),
    luxuryMakeup: getTextFromResource(getText, 'luxuryMakeup'),
    luxuryMakeupDesc: getTextFromResource(getText, 'luxuryMakeupDesc'),
    luxurySkincare: getTextFromResource(getText, 'luxurySkincare'),
    luxurySkincareDesc: getTextFromResource(getText, 'luxurySkincareDesc'),
    planetAware: getTextFromResource(getText, 'planetAware'),
    planetAwareDesc: getTextFromResource(getText, 'planetAwareDesc')
});

const fields = createSelector(tiledProfileContentSelector, preferencesModalTextResources, (textResources, preferencesModalTexts) => {
    return {
        ...preferencesModalTexts,
        ...textResources
    };
});

const withTiledProfileContentProps = wrapHOC(connect(fields));

export {
    fields, withTiledProfileContentProps, tiledProfileContentSelector
};
