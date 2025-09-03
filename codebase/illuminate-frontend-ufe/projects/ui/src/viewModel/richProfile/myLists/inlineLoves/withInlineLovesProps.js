import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { myListsSelector } from 'selectors/page/myLists/myListsSelector';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import myListsUtils from 'utils/MyLists';
import LimitedLoveListItemsSelector from 'selectors/loves/limitedLoveListItems/limitedLoveListItemsSelector';
import LoveActions from 'actions/LoveActions';
import initializedCurrentLovesSelector from 'selectors/loves/initializedCurrentLovesSelector';
import { MAX_FLYOUT_RECENT_ITEMS } from 'constants/sharableList';

const { wrapHOC } = FrameworkUtils;
const { limitedLoveListItemsSelector } = LimitedLoveListItemsSelector;

const fields = createSelector(
    userSelector,
    myListsSelector,
    lovesSelector,
    limitedLoveListItemsSelector,
    initializedCurrentLovesSelector,
    (user, myLists, loves, limitedLoveListItems, currentLoves) => {
        const isSharableListEnabled = myListsUtils.isSharableListEnabled();
        const isEmptyLists = !myLists?.allLoves?.some(list => list.shoppingListItemsCount > 0);
        const isPerfImprovementEnabled = myListsUtils.isPerfImprovementEnabled();
        const recentlyItemsAdded = currentLoves?.currentLoves
            .map(item => {
                return {
                    ...item,
                    ...item?.sku
                };
            })
            .slice(0, MAX_FLYOUT_RECENT_ITEMS);

        return {
            user,
            myLists,
            limitedLoveListItems,
            isSharableListEnabled,
            isEmptyLists,
            isPerfImprovementEnabled,
            ...(isPerfImprovementEnabled && { recentlyItemsAdded }),
            ...(isSharableListEnabled && { loves })
        };
    }
);

const functions = dispatch => ({
    getAllLists: ({ options, force }) => {
        const action = LoveActions.getAllLists({ force, options });
        dispatch(action);
    },
    fetchAllLovedItems: ({ force } = {}) => {
        const action = LoveActions.getFlatLoveListSkusWithDetails({ force });
        dispatch(action);
    },
    getLimitedLoveListItems: ({ callback, refreshCache, options }) => {
        const action = LoveActions.getLimitedLoveListItems({ callback, force: refreshCache, options });
        dispatch(action);
    }
});

const withInlineLovesProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withInlineLovesProps
};
