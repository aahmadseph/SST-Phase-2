const lovesReducer = require('reducers/loves').default;
const loveActions = require('actions/LoveActions').default;
const { TYPES: ACTION_TYPES } = loveActions;

describe('loves reducer', () => {
    it('should return the initial state', () => {
        expect(lovesReducer(undefined, {})).toEqual({
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
        });
    });

    it('should update state with an array of loved items', () => {
        const initialState = {
            currentLoves: [],
            shoppingListIds: [],
            totalLovesListItemsCount: 0,
            shareLink: null
        };

        const newState = lovesReducer(initialState, {
            type: ACTION_TYPES.UPDATE_LOVES_LIST,
            currentLoves: [2, 4, 6],
            shoppingListIds: [],
            totalLovesListItemsCount: 0,
            shareLink: null
        });

        expect(newState).toEqual({
            currentLoves: [2, 4, 6],
            currentLovesIsInitialized: true,
            shoppingListIds: [],
            totalLovesListItemsCount: 0,
            shareLink: null
        });
    });

    it('should update state with an array of loved items sku ids', () => {
        const initialState = {
            currentLoves: [],
            shoppingListIds: []
        };

        const newState = lovesReducer(initialState, {
            type: ACTION_TYPES.UPDATE_SHOPPING_LIST_IDS,
            shoppingListIds: [1, 2, 3]
        });

        expect(newState).toEqual({
            currentLoves: [],
            shoppingListIds: [1, 2, 3]
        });
    });
});
