import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';

const { shouldUpdateProgressBarMessage } = BeautyPreferencesUtils;
const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/locales', 'BeautyPreferences');

const fields = createSelector(
    createStructuredSelector({
        beautyPreferencesTitle: getTextFromResource(getText, 'beautyPreferencesTitle'),
        beautyPreferencesDesc: getTextFromResource(getText, 'beautyPreferencesDesc'),
        profileCompletionStatusHeading: getTextFromResource(getText, 'profileCompletionStatusHeading'),
        profileCompleteMessageHeading: getTextFromResource(getText, 'profileCompleteMessageHeading'),
        checkRecommendationsLinkHeading: getTextFromResource(getText, 'checkRecommendationsLinkHeading'),
        profileInterimMessageHeading: getTextFromResource(getText, 'profileInterimMessageHeading')
    }),
    beautyPreferencesSelector,
    (textResources, beautyPreferencesState) => {
        const beautyPreferences = beautyPreferencesState.beautyPreferences;
        const profileCompletionPercentage = beautyPreferencesState.profileCompletionPercentage;
        const { beautyPreferencesDesc, profileInterimMessageHeading, ...restTextResources } = textResources;
        const profileStatusMessage = shouldUpdateProgressBarMessage(beautyPreferences) ? profileInterimMessageHeading : beautyPreferencesDesc;

        return {
            ...restTextResources,
            profileStatusMessage,
            profileCompletionPercentage
        };
    }
);

const withProfileCompletionStatusProps = wrapHOC(connect(fields));

export {
    fields, withProfileCompletionStatusProps
};
