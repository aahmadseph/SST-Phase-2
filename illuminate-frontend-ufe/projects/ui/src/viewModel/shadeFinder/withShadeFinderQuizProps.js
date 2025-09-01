import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/ShadeFinder/locales', 'ShadeFinderQuiz');

const localization = createStructuredSelector({
    shadeFinderTitle: getTextFromResource(getText, 'shadeFinderTitle')
});

const fields = createSelector(localization, textResources => {
    const newProps = {
        ...textResources
    };

    return newProps;
});

const withShadeFinderQuizProps = wrapHOC(connect(fields));

export {
    fields, localization, withShadeFinderQuizProps
};
