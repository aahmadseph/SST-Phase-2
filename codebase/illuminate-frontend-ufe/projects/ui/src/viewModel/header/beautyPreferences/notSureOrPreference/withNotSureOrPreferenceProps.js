import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { notSureOption, noPreferenceOption } from 'constants/beautyPreferences';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/NotSureOrPreference/locales', 'NotSureOrPreference');

const fields = createSelector(
    createStructuredSelector({
        notSureOption: getTextFromResource(getText, notSureOption),
        noPreferenceOption: getTextFromResource(getText, noPreferenceOption)
    }),
    textResources => {
        return {
            ...textResources
        };
    }
);

const withNotSureOrPreferenceProps = wrapHOC(connect(fields));

export {
    fields, withNotSureOrPreferenceProps
};
