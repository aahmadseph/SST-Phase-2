import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'actions/Actions';
import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import { userSelector } from 'selectors/user/userSelector';
import SocialProfileSelector from 'selectors/socialInfo/socialProfile/socialProfileSelector';
import { textItemsSelector as beautyProfileHeadingsSelector } from 'viewModel/header/beautyPreferences/beautyProfileHeading/withBeautyProfileHeadingProps';
import beautyPrefsUtils from 'utils/BeautyPreferences';
import urlUtils from 'utils/Url';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import BeautyPreferencesBindings from 'analytics/bindingMethods/pages/beautyPreferences/BeautyPreferencesBindings';
import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { socialProfileSelector } = SocialProfileSelector;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const {
    setMultipleBeautyPreferences,
    updateBeautyPreferences,
    fireAnalytics,
    fireAnalyticsDataOverwrites,
    setInitialBeautyPreferences,
    setExpandedPreference,
    openRegisterBIModal,
    openPrivacySettingsModal,
    closePrivacySettingsModal,
    fetchGroupedBrandsList,
    fetchColorIQLabDescriptions,
    setIsColorIQLastAnsweredTrait,
    setFilteredOutUserFavoriteBrandIDs,
    signInToSaveClick,
    skipThisQuestionClick,
    saveAndContinueClick
} = BeautyPreferencesActions;
const { showInfoModal } = Actions;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/locales', 'BeautyPreferences');

const textFieldsSelector = createStructuredSelector({
    save: getTextFromResource(getText, 'save'),
    saveAndContinue: getTextFromResource(getText, 'saveAndContinue'),
    skipThisQues: getTextFromResource(getText, 'skipThisQues'),
    signIn: getTextFromResource(getText, 'signIn'),
    biSignIn: getTextFromResource(getText, 'biSignIn'),
    confettiModalTitle: getTextFromResource(getText, 'confettiModalTitle'),
    confettiModalMessage: getTextFromResource(getText, 'confettiModalMessage'),
    confettiModalButton: getTextFromResource(getText, 'confettiModalButton'),
    privacySettings: getTextFromResource(getText, 'privacySettings'),
    apiErrorModalTitle: getTextFromResource(getText, 'apiErrorModalTitle'),
    apiErrorModalMessage: getTextFromResource(getText, 'apiErrorModalMessage'),
    errorButtonText: getTextFromResource(getText, 'buttonText')
});

const fields = createSelector(
    beautyPreferencesSelector,
    userSelector,
    socialProfileSelector,
    textFieldsSelector,
    beautyProfileHeadingsSelector,
    (beautyPreferencesState, user, socialProfile, textResources, headingsTextFields) => {
        const brandNames = beautyPreferencesState.mappedBrandsList?.brandNames;
        const beautyPreferences = beautyPreferencesState.beautyPreferences;
        const expandedPreference = beautyPreferencesState.expandedPreference;
        const isColorIQLastAnsweredTrait = beautyPreferencesState.isColorIQLastAnsweredTrait;
        const { favoriteBrandsSpoke } = urlUtils.getParams();
        const isFavoriteBrandsSpoke = !!(favoriteBrandsSpoke && favoriteBrandsSpoke[0] && favoriteBrandsSpoke[0] === 'true');
        const refinements = beautyPrefsUtils.getDynamicRefinements() || Empty.Array;

        return {
            beautyPreferences,
            expandedPreference,
            user,
            socialProfile,
            isAllAnswered: beautyPrefsUtils.isAllAnswered(beautyPreferences),
            allUnansweredPrefs: beautyPrefsUtils.allUnansweredPrefs(beautyPreferences),
            getNextUnansweredQuestion: beautyPrefsUtils.getNextUnansweredQuestion,
            isLastUnansweredIndex: beautyPrefsUtils.isLastUnansweredIndex,
            isAtLeastOneAnswered: beautyPrefsUtils.isAtLeastOneAnswered(beautyPreferences),
            isColorIQLastAnsweredTrait,
            isFavoriteBrandsSpoke,
            brandNames,
            refinements,
            ...textResources,
            ...headingsTextFields
        };
    }
);

const functions = {
    openAccordion: BeautyPreferencesBindings.openAccordion,
    setMultipleBeautyPreferences,
    updateBeautyPreferences,
    fireAnalytics,
    fireAnalyticsDataOverwrites,
    showInfoModal,
    setInitialBeautyPreferences,
    setExpandedPreference,
    openRegisterBIModal,
    openPrivacySettingsModal,
    closePrivacySettingsModal,
    fetchGroupedBrandsList,
    fetchColorIQLabDescriptions,
    setIsColorIQLastAnsweredTrait,
    setFilteredOutUserFavoriteBrandIDs,
    signInToSaveClick,
    skipThisQuestionClick,
    saveAndContinueClick
};

const withBeautyPreferencesProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withBeautyPreferencesProps, textFieldsSelector
};
