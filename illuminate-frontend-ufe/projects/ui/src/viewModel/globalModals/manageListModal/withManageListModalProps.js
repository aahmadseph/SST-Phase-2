import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';

import LoveActions from 'actions/LoveActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ManageListModal/locales', 'ManageListModal');

const localization = createStructuredSelector({
    manageList: getTextFromResource(getText, 'manageList'),
    deleteList: getTextFromResource(getText, 'deleteList'),
    listName: getTextFromResource(getText, 'listName'),
    save: getTextFromResource(getText, 'save'),
    cancel: getTextFromResource(getText, 'cancel')
});

const fields = createSelector(localization, textResources => {
    return {
        localization: {
            ...textResources
        }
    };
});

const functions = dispatch => ({
    renameSharableList: (productSkuData, onSuccess, onError) => {
        const action = LoveActions.renameSharableList(productSkuData, onSuccess, onError);
        dispatch(action);
    },
    fetchData: options => {
        return store.dispatch(LoveActions.getShoppingListById(options));
    },
    setLoveListName: listName => {
        return store.dispatch(LoveActions.setLoveListName(listName));
    }
});

const withManageListModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withManageListModalProps
};
