import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import myListsUtils from 'utils/MyLists';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyLists/SavedInLists/locales', 'SavedInLists');

const localization = createStructuredSelector({
    savedIn: getTextFromResource(getText, 'savedIn'),
    and: getTextFromResource(getText, 'and')
});

const fields = createSelector(
    (_state, ownProps) => ownProps.listNames,
    localization,
    (listNames, textResources) => {
        const { savedIn, and } = textResources;
        const savedInListsText = myListsUtils.savedInListsText({ listNames, savedIn, and });

        return {
            savedInListsText,
            localization: textResources
        };
    }
);

const withSavedInListsProps = wrapHOC(connect(fields));

export {
    fields, withSavedInListsProps
};
