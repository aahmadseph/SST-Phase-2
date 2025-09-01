import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import beautyPrefsUtils from 'utils/BeautyPreferences';
import stringUtils from 'utils/String';
import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { updateBeautyPreferences, setMultipleBeautyPreferences } = BeautyPreferencesActions;
const getText = getLocaleResourceFile('components/GlobalModals/BeautyPreferencesModal/locales', 'BeautyPreferencesModal');

const fields = createSelector(
    beautyPreferencesSelector,
    userSelector,
    createStructuredSelector({
        modalTitle: getTextFromResource(getText, 'modalTitle'),
        modalSubTitle1: getTextFromResource(getText, 'modalSubTitle1'),
        modalSubTitle2: getTextFromResource(getText, 'modalSubTitle2'),
        skipThisQuestion: getTextFromResource(getText, 'skipThisQuestion'),
        next: getTextFromResource(getText, 'next'),
        done: getTextFromResource(getText, 'done'),
        apiErrorModalTitle: getTextFromResource(getText, 'apiErrorModalTitle'),
        apiErrorModalMessage: getTextFromResource(getText, 'apiErrorModalMessage'),
        errorButtonText: getTextFromResource(getText, 'buttonText'),
        savedTitle: getTextFromResource(getText, 'savedTitle'),
        savedMessage1: getTextFromResource(getText, 'savedMessage1', ['{0}']),
        savedMessage2: getTextFromResource(getText, 'savedMessage2'),
        savedMessage3: getTextFromResource(getText, 'savedMessage3'),
        linkText: getTextFromResource(getText, 'linkText'),
        keepGoing: getTextFromResource(getText, 'keepGoing'),
        gotIt: getTextFromResource(getText, 'buttonText')
    }),
    ({ beautyPreferences }, user, initialTextResources) => {
        const { savedMessage1, ...textResources } = initialTextResources;
        const messageWithUserFristName = stringUtils.format(savedMessage1, user.firstName);

        return {
            beautyPreferences: beautyPreferences,
            profileId: user.profileId,
            isAtLeastOneAnswered: beautyPrefsUtils.isAtLeastOneAnswered(beautyPreferences),
            messageWithUserFristName,
            savedMessage1: messageWithUserFristName,
            ...textResources
        };
    }
);

const functions = {
    updateBeautyPreferences,
    setMultipleBeautyPreferences
};

const withBeautyPreferencesModalProps = wrapHOC(connect(fields, functions));

export {
    withBeautyPreferencesModalProps, fields, functions
};
