import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { myListsSelector } from 'selectors/page/myLists/myListsSelector';
import LoveActions from 'actions/LoveActions';
const { wrapHOC } = FrameworkUtils;
import localeUtils from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Header/InlineLoves/locales', 'InlineLoves');

const localization = createStructuredSelector({
    noLovesAdded: getTextFromResource(getText, 'noLovesAdded'),
    noLovesMyListDesc: getTextFromResource(getText, 'noLovesMyListDesc'),
    signInButton: getTextFromResource(getText, 'signInButton'),
    createAccountButton: getTextFromResource(getText, 'createAccountButton'),
    browse: getTextFromResource(getText, 'browse')
});

const fields = createSelector(userSelector, myListsSelector, localization, (user, myLists, textResources) => {
    return {
        user,
        myLists,
        localization: {
            ...textResources
        }
    };
});

const functions = dispatch => ({
    getAllLists: ({ force, options }) => {
        const action = LoveActions.getAllLists({ force, options });
        dispatch(action);
    }
});

const withInlineLovesListProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withInlineLovesListProps
};
