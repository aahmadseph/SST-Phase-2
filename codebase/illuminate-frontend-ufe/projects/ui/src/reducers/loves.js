const ACTION_TYPES = {
    UPDATE_LOVES_LIST: 'UPDATE_LOVES_LIST',
    UPDATE_LOVES_LIST_SKU_DETAILS: 'UPDATE_LOVES_LIST_SKU_DETAILS',
    UPDATE_PUBLIC_LOVES_LIST: 'UPDATE_PUBLIC_LOVES_LIST',
    UPDATE_SHOPPING_LIST_IDS: 'UPDATE_SHOPPING_LIST_IDS',
    UPDATE_LOVE_LIST_SKU_PRODUCT_IDS: 'UPDATE_LOVE_LIST_SKU_PRODUCT_IDS',
    UPDATE_LOVES_SORTING: 'UPDATE_LOVES_SORTING',
    SHOW_MY_LISTS_MODAL: 'SHOW_MY_LISTS_MODAL',
    SET_SKU_LOVE_DATA: 'SET_SKU_LOVE_DATA',
    SET_SKU_LOVE_IMAGE_DATA: 'SET_SKU_LOVE_IMAGE_DATA',
    SET_LOVE_LIST_NAME: 'SET_LOVE_LIST_NAME',
    CREATE_NEW_LIST: 'CREATE_NEW_LIST',
    SET_LOVE_LIST_UPDATED: 'SET_LOVE_LIST_UPDATED',
    SET_LIMITED_LOVE_LIST_ITEMS: 'SET_LIMITED_LOVE_LIST_ITEMS',
    SET_SALE_FILTER: 'SET_SALE_FILTER',
    SET_SORT_BY_FILTER: 'SET_SORT_BY_FILTER',
    SET_MY_LISTS_SKU_ONLY: 'SET_MY_LISTS_SKU_ONLY'
};

const initialState = {
    currentLoves: [],
    currentLovesSkuDetails: [],
    shoppingListIds: [],
    loveListSkuProductIds: [],
    publicLoves: [],
    totalLovesListItemsCount: 0,
    totalPublicLovesListItemsCount: 0,
    shareLink: null,
    currentLovesIsInitialized: false,
    lovesSelectedSort: '',
    showMyListsModal: false,
    showCreateModal: false,
    skuLoveData: {
        loveSource: null,
        skuId: null,
        productId: null
    },
    skuLoveImageData: {},
    loveListName: '',
    isLoveListUpdated: false,
    limitedLoveListItems: null,
    isSaleFilterEnabled: false,
    sortBy: 'recently',
    allLovedListsSkuOnly: []
};

/* shoppingListIds contains the skuId of every loved item in currentLoves.
 *
 * This is to ease the handling of add/remove loves locally upon POST/DELETE success.
 * The addLove and removeLove actions will manipulate the requested sku accordingly here
 * as we don't really need to fetch the updated list of loved skus if the API operations
 * were successful. This state will not persist session, however, each page load will
 * populate the list correctly.
 */

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_LOVES_LIST:
            return Object.assign({}, state, {
                currentLovesIsInitialized: true,
                currentLoves: action.currentLoves,
                totalLovesListItemsCount: action.totalLovesListItemsCount,
                shareLink: action.shareLink
            });
        case ACTION_TYPES.UPDATE_LOVES_LIST_SKU_DETAILS:
            return Object.assign({}, state, {
                currentLovesSkuDetails: action.currentLovesSkuDetails
            });
        case ACTION_TYPES.UPDATE_SHOPPING_LIST_IDS:
            return Object.assign({}, state, { shoppingListIds: action.shoppingListIds });
        case ACTION_TYPES.UPDATE_LOVE_LIST_SKU_PRODUCT_IDS:
            return Object.assign({}, state, { loveListSkuProductIds: action.loveListSkuProductIds });
        case ACTION_TYPES.UPDATE_LOVES_SORTING:
            return Object.assign({}, state, { lovesSelectedSort: action.lovesSelectedSort });
        case ACTION_TYPES.UPDATE_PUBLIC_LOVES_LIST:
            return Object.assign({}, state, {
                publicLoves: action.publicLoves,
                totalPublicLovesListItemsCount: action.totalPublicLovesListItemsCount
            });
        case ACTION_TYPES.SHOW_MY_LISTS_MODAL:
            return Object.assign({}, state, {
                showMyListsModal: action.showMyListsModal
            });
        case ACTION_TYPES.SET_SKU_LOVE_DATA:
            return {
                ...state,
                skuLoveData: action.payload
            };
        case ACTION_TYPES.SET_SKU_LOVE_IMAGE_DATA:
            return {
                ...state,
                skuLoveImageData: action.payload
            };
        case ACTION_TYPES.SET_LIMITED_LOVE_LIST_ITEMS:
            return {
                ...state,
                limitedLoveListItems: action.payload
            };
        case ACTION_TYPES.SET_LOVE_LIST_NAME:
            return {
                ...state,
                loveListName: action.payload
            };
        case ACTION_TYPES.SET_LOVE_LIST_UPDATED:
            return {
                ...state,
                isLoveListUpdated: action.payload
            };
        case ACTION_TYPES.SET_SALE_FILTER:
            return {
                ...state,
                isSaleFilterEnabled: action.payload
            };
        case ACTION_TYPES.SET_SORT_BY_FILTER:
            return {
                ...state,
                sortBy: action.payload
            };
        case ACTION_TYPES.SET_MY_LISTS_SKU_ONLY:
            return {
                ...state,
                allLovedListsSkuOnly: action.allLovedListsSkuOnly
            };
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
