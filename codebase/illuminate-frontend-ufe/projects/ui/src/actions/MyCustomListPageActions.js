/* eslint-disable no-unused-vars */
import PageActionCreators from 'actions/framework/PageActionCreators';
import { SET_MY_CUSTOM_LIST } from 'constants/actionTypes/myLists';
import locationUtils from 'utils/Location';
import shoppingListApi from 'services/api/profile/shoppingList';
import { Pages } from 'constants/Pages';
import LoveActions from 'actions/LoveActions';

class MyCustomListActionCreators extends PageActionCreators {
    isNewPage = () => true;

    updatePage = () => {};

    openPage = ({ events: { onPageUpdated, onDataLoaded, onError } }) => {
        return async (dispatch, getState) => {
            try {
                const { user } = getState();
                const biAccountId = user?.beautyInsiderAccount?.biAccountId;
                const shoppingListId = locationUtils.getMyCustomListId();
                const sharedListToken = locationUtils.getSharedListToken();

                let data = {};
                let redirectTo404 = false;

                if (shoppingListId && biAccountId) {
                    data = await shoppingListApi.getShoppingListById(biAccountId, shoppingListId, {
                        itemsPerPage: 60,
                        currentPage: 1
                    });
                }

                if (sharedListToken) {
                    data = await shoppingListApi.getSharedShoppingListByToken({
                        biAccountId,
                        sharedListToken,
                        options: {
                            itemsPerPage: 60,
                            currentPage: 1
                        }
                    });

                    // redirecting to 404 if the shared list has no ID, meaning is not found
                    if (data.isSharedList && !data.shoppingListId) {
                        redirectTo404 = true;
                    }
                }

                if (redirectTo404) {
                    onError(true, { path: Pages.Error404 }, true);
                }

                onDataLoaded(data);
                dispatch({
                    type: SET_MY_CUSTOM_LIST,
                    payload: data
                });
                dispatch(LoveActions.setLoveListName(data.shoppingListName || ''));
                onPageUpdated(data);

                return Promise.resolve();
            } catch (error) {
                onError(error);

                return Promise.reject(error);
            }
        };
    };
}

const MyCustomListPageActions = new MyCustomListActionCreators();

export default MyCustomListPageActions;
