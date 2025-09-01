import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocale from 'utils/LanguageLocale';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AutoReplenishment/locales', 'AutoReplenishment');

const localizationSelector = createStructuredSelector({
    autoReplenish: getTextFromResource(getText, 'autoReplenish')
});

const fields = createSelector(localizationSelector, localization => {
    return {
        localization
    };
});

const functions = {
    loadContentfulContent: AutoReplenishmentActions.loadContentfulContent
};

const withAutoReplenishmentMainProps = connect(fields, functions);

export {
    fields, functions, withAutoReplenishmentMainProps
};
