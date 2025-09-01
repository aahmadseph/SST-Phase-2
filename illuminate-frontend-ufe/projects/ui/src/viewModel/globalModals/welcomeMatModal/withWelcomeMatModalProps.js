import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/WelcomeMatModal/locales', 'WelcomeMatModal');

const fields = createSelector(
    createStructuredSelector({
        accessMessage1: getTextFromResource(getText, 'accessMessage1'),
        accessMessage2: getTextFromResource(getText, 'accessMessage2'),
        doesNotShip: getTextFromResource(getText, 'doesNotShip'),
        internationalSites: getTextFromResource(getText, 'internationalSites'),
        continueTo: getTextFromResource(getText, 'continue')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = null;

const withWelcomeMatModalProps = wrapHOC(connect(fields, functions));

export {
    withWelcomeMatModalProps, fields, functions
};
