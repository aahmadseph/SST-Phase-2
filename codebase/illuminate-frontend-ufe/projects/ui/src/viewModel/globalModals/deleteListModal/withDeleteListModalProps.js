import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LoveActions from 'actions/LoveActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import LoveListNameSelector from 'selectors/loves/loveListName/loveListNameSelector';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/DeleteListModal/locales', 'DeleteListModal');
const { loveListNameSelector } = LoveListNameSelector;

const localization = createStructuredSelector({
    deleteList: getTextFromResource(getText, 'deleteList'),
    deleteText: getTextFromResource(getText, 'deleteText'),
    yesDeleteList: getTextFromResource(getText, 'yesDeleteList'),
    noKeepList: getTextFromResource(getText, 'noKeepList')
});

const fields = createSelector(loveListNameSelector, localization, (loveListName, textResources) => {
    return {
        loveListName,
        localization: {
            ...textResources
        }
    };
});

const functions = dispatch => ({
    removeSharableList: ({ listId, cbSuccess = () => {}, cbCleanup = () => {} }) => {
        const action = LoveActions.removeSharableList({ listId, cbSuccess, cbCleanup });
        dispatch(action);
    },
    getFlatLoveListSkusOverview: (isUpdateShoppingList, callback, force) => {
        const action = LoveActions.getFlatLoveListSkusOverview(isUpdateShoppingList, callback, force);
        dispatch(action);
    }
});

const withDeleteListModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withDeleteListModalProps
};
