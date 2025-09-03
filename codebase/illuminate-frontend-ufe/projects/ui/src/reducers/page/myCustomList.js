import { SET_MY_CUSTOM_LIST } from 'constants/actionTypes/myLists';

const initialState = {
    profileStatus: 0,
    profileLocale: '',
    isInitialized: false,
    shoppingListItems: [],
    shoppingListItemsCount: 0,
    shoppingListId: '',
    shoppingListName: '',
    shoppingListType: '',
    shareLink: '',
    socialBadgeLogo: '',
    isDefault: false
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_MY_CUSTOM_LIST: {
            return { ...state, ...payload, isInitialized: true };
        }

        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
