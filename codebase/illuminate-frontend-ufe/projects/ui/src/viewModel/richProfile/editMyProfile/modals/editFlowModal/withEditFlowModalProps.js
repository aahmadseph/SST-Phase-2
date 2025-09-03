import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/EditMyProfile/Modals/EditFlowModal/locales', 'EditFlowModal');

const fields = createSelector(
    beautyPreferencesSelector,
    (_state, ownProps) => ownProps.content,
    createStructuredSelector({
        saveText: getTextFromResource(getText, 'saveText'),
        savedText: getTextFromResource(getText, 'savedText')
    }),
    ({ beautyPreferences }, content, textResources) => {
        const isPhotosAndBio = content === 0;

        return {
            beautyPreferences,
            isPhotosAndBio,
            ...textResources
        };
    }
);

const withEditFlowModalProps = wrapHOC(connect(fields));

export {
    fields, withEditFlowModalProps
};
