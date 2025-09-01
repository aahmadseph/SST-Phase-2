import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import LoveActions from 'actions/LoveActions';

const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/CreateNewList/locales', 'CreateNewListModal');
const { wrapHOC } = FrameworkUtils;

const localization = createStructuredSelector({
    createNewList: getTextFromResource(getText, 'createNewList'),
    createList: getTextFromResource(getText, 'createList'),
    enterListName: getTextFromResource(getText, 'enterListName'),
    listLimitReachedTitle: getTextFromResource(getText, 'listLimitReachedTitle'),
    listLimitReachedMessage: getTextFromResource(getText, 'listLimitReachedMessage'),
    myLists: getTextFromResource(getText, 'myLists'),
    gotIt: getTextFromResource(getText, 'gotIt')
});

const fields = createSelector(userSelector, localization, (user, textResources) => {
    return {
        user,
        localization: textResources
    };
});

const functions = dispatch => ({
    showCreateNewListModal: isOpen => {
        const action = {
            type: 'SHOW_CREATE_NEW_LIST_MODAL',
            payload: isOpen
        };
        dispatch(action);
    },
    createNewList: (shoppingListName, newSkuToAdd) => {
        const action = LoveActions.createNewList(shoppingListName, newSkuToAdd);

        return dispatch(action);
    }
});

const withCreateNewListModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withCreateNewListModalProps
};
