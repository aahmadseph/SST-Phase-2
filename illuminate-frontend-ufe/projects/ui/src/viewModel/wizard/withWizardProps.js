import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector, createStructuredSelector } from 'reselect';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';
import { userSelector } from 'selectors/user/userSelector';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import userUtils from 'utils/User';
import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';

const { allUnansweredPrefs, isAllAnswered, isLastUnansweredIndex, getCategory } = BeautyPreferencesUtils;
const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { openRegisterBIModal, setIsColorIQLastAnsweredTrait } = BeautyPreferencesActions;
const getText = getLocaleResourceFile('components/Wizard/locales', 'Wizard');

const fields = createSelector(
    userSelector,
    beautyPreferencesSelector,
    createStructuredSelector({
        back: getTextFromResource(getText, 'back'),
        retake: getTextFromResource(getText, 'retake'),
        saveAndContinueText: getTextFromResource(getText, 'saveAndContinue'),
        signInToSave: getTextFromResource(getText, 'signInToSave'),
        apiErrorModalTitle: getTextFromResource(getText, 'apiErrorModalTitle'),
        apiErrorModalMessage: getTextFromResource(getText, 'apiErrorModalMessage'),
        errorButtonText: getTextFromResource(getText, 'errorButtonText'),
        joinBI: getTextFromResource(getText, 'joinBI'),
        seeMatchingProducts: getTextFromResource(getText, 'seeMatchingProducts')
    }),
    (_, ownProps) => ownProps.resultsCallback,
    (user, beautyPreferencesState, textResources, resultsCallback) => {
        const beautyPreferences = beautyPreferencesState.beautyPreferences;
        const {
            saveAndContinueText, signInToSave, joinBI, seeMatchingProducts, ...restTextResources
        } = textResources;
        const isMySephoraPage = Location.isMySephoraPage();
        const isSignedIn = user.profileId;
        const isBI = userUtils.isBI();
        const saveButtonText = isMySephoraPage ? (isSignedIn ? (isBI ? saveAndContinueText : joinBI) : signInToSave) : seeMatchingProducts;
        const currentCategory = getCategory(PREFERENCE_TYPES.COLOR_IQ);
        const isColorIQLastAnsweredTrait = isLastUnansweredIndex(
            PREFERENCE_TYPES.COLOR_IQ,
            isAllAnswered(beautyPreferences),
            allUnansweredPrefs(beautyPreferences)
        );

        return {
            user,
            beautyPreferences,
            isSignedIn,
            isBI,
            saveButtonText,
            currentCategory,
            isMySephoraPage,
            resultsCallback,
            isColorIQLastAnsweredTrait,
            ...restTextResources
        };
    }
);

const functions = {
    openRegisterBIModal,
    setIsColorIQLastAnsweredTrait
};

const withWizardProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withWizardProps
};
