import PageActionCreators from 'actions/framework/PageActionCreators';
import { SET_MY_LISTS } from 'constants/actionTypes/myLists';
import shoppingListApi from 'services/api/profile/shoppingList';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import LoveActions from 'actions/LoveActions';
import myListsUtils from 'utils/MyLists';
import { MAX_ITEMS_PER_PAGE, MIN_ITEMS_PER_PAGE } from 'constants/sharableList';
const { CACHE_ALL_LIST, CACHE_FULL } = LOCAL_STORAGE;

class MyListsActionCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => ({});

    openPage = ({ events: { onPageUpdated, onDataLoaded, onError } }) => {
        return async (dispatch, getState) => {
            try {
                const { user, loves } = getState();
                const isPerfImprovementEnabled = myListsUtils.isPerfImprovementEnabled();

                let data = {};
                let allLovedItems = {};

                if (user?.beautyInsiderAccount?.biAccountId) {
                    const options = { itemsPerPage: isPerfImprovementEnabled ? MIN_ITEMS_PER_PAGE : MAX_ITEMS_PER_PAGE };
                    data = await shoppingListApi.getAllLists(
                        user.beautyInsiderAccount.biAccountId,
                        {
                            key: CACHE_ALL_LIST,
                            invalidate: loves.isLoveListUpdated
                        },
                        options
                    );

                    allLovedItems = await shoppingListApi.getSkusFromAllLists(
                        user.beautyInsiderAccount.biAccountId,
                        { key: CACHE_FULL, invalidate: true },
                        { itemsPerPage: 60, currentPage: 1 }
                    );
                }

                onDataLoaded({ ...data, ...allLovedItems });

                dispatch({
                    type: SET_MY_LISTS,
                    payload: data
                });
                dispatch(LoveActions.setLoveListUpdated(false));

                dispatch(
                    LoveActions.updateLovesListSkuDetails({
                        loves: allLovedItems.skus || []
                    })
                );

                onPageUpdated({ ...data, ...allLovedItems });

                return Promise.resolve();
            } catch (error) {
                onError(error);

                return Promise.reject(error);
            }
        };
    };
}

const MyListsPageActions = new MyListsActionCreators();

export default MyListsPageActions;
