import shoppingListApi from 'services/api/profile/shoppingList';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import Empty from 'constants/empty';
import { isSLSTestEnabledSelector } from 'viewModel/selectors/slsApi/isSLSTestEnabledSelector';
import { VIEW_ALL_PER_PAGE_MAX } from 'constants/Search';
import { GET_MY_LISTS_INITIAL_DATA } from 'constants/actionTypes/myLists';
import locationUtils from 'utils/Location';
import { SET_MY_CUSTOM_LIST } from 'constants/actionTypes/myLists';
import myListsUtils from 'utils/MyLists';
const {
    CACHE_ALL_LIST, CACHE_FULL, CACHE_BASIC, CACHE_LIMITED_LOVE_LIST, CACHE_ALL_LIST_SKUS_ONLY
} = LOCAL_STORAGE;
import { MIN_ITEMS_PER_PAGE, MAX_LIMITED_LOVE_ITEMS_MY_LISTS_HOME_PAGE } from 'constants/sharableList';
const LOVES_DATA_EXPIRY = Storage.MINUTES * 15;

import lovesReducer from 'reducers/loves';
const { ACTION_TYPES: TYPES } = lovesReducer;
const { LOVED_ITEMS_WITH_DETAILS, LOVED_ITEMS_SKU_ONLY, ALL_LOVE_LIST, ALL_LOVE_LIST_SKU_ONLY } = LOCAL_STORAGE;

function setShoppingListIds(shoppingListItems) {
    if (shoppingListItems.length === 0) {
        return [];
    }

    return shoppingListItems.map(love => love.sku.skuId);
}

function setLoveListSkuProductIds(listItems = []) {
    return listItems.map(({ sku: { skuId, productId } }) => `${skuId}-${productId}`);
}

function updateLoveListSkuProductSet(skuProductIds) {
    return {
        type: TYPES.UPDATE_LOVE_LIST_SKU_PRODUCT_IDS,
        loveListSkuProductIds: skuProductIds
    };
}

function updateLovesList(shoppingList) {
    const isSharableListEnabled = myListsUtils.isSharableListEnabled();

    if (isSharableListEnabled) {
        Storage.db.setItem(LOVED_ITEMS_SKU_ONLY, shoppingList);
    } else {
        Storage.local.setItem(LOCAL_STORAGE.LOVES_DATA, shoppingList, LOVES_DATA_EXPIRY);
    }

    return {
        type: TYPES.UPDATE_LOVES_LIST,
        currentLoves: shoppingList.loves,
        totalLovesListItemsCount: shoppingList.totalLovesListItemsCount,
        shareLink: shoppingList.shareLink
    };
}

function updateLovesListSkuDetails(shoppingList) {
    Storage.db.setItem(LOVED_ITEMS_WITH_DETAILS, shoppingList);

    return {
        type: TYPES.UPDATE_LOVES_LIST_SKU_DETAILS,
        currentLovesSkuDetails: shoppingList.loves
    };
}

function updatePublicLovesList(data) {
    return {
        type: TYPES.UPDATE_PUBLIC_LOVES_LIST,
        publicLoves: data.loves,
        totalPublicLovesListItemsCount: data.totalPublicLovesListItemsCount
    };
}

function updateLovesSorting(lovesSelectedSort) {
    return {
        type: TYPES.UPDATE_LOVES_SORTING,
        lovesSelectedSort
    };
}

function updateShoppingListIds(skuIdArray) {
    /* See notes for this in reducers/loves.js */
    return {
        type: TYPES.UPDATE_SHOPPING_LIST_IDS,
        shoppingListIds: skuIdArray
    };
}

function setLovesListSkuOnly(allLoves) {
    return {
        type: TYPES.SET_MY_LISTS_SKU_ONLY,
        allLovedListsSkuOnly: allLoves
    };
}

function getLovesList(profileId, callback, isUpdateShoppingList) {
    return (dispatch, getState) => {
        const reduxState = getState();
        const isSLSABTestEnabled = isSLSTestEnabledSelector(reduxState);
        shoppingListApi
            .getShoppingList(profileId, { itemsPerPage: VIEW_ALL_PER_PAGE_MAX, sortBy: reduxState.loves.lovesSelectedSort }, isSLSABTestEnabled)
            .then(json => {
                const loves = json.shoppingListItems;
                const totalLovesListItemsCount = json.shoppingListItemsCount;

                if (typeof callback === 'function') {
                    callback(loves);
                }

                //prevents loop for loves list
                if (isUpdateShoppingList) {
                    const loveIds = setShoppingListIds(loves);
                    dispatch(updateShoppingListIds(loveIds));
                }

                return dispatch(
                    updateLovesList({
                        loves,
                        totalLovesListItemsCount,
                        shareLink: json.shareLink
                    })
                );
            });
    };
}

function mergeListsById(existing = Empty.Array, incoming = Empty.Array) {
    const mergedMap = new Map();

    // Add all existing lists to the map
    for (const list of existing) {
        mergedMap.set(list.shoppingListId, { ...list });
    }

    // Merge incoming lists
    for (const list of incoming) {
        if (mergedMap.has(list.shoppingListId)) {
            const existingList = mergedMap.get(list.shoppingListId);
            const existingItems = existingList.shoppingListItems || Empty.Array;
            const incomingItems = list.shoppingListItems || Empty.Array;
            const mergedItems = [
                ...existingItems,
                ...incomingItems.filter(item => !existingItems.some(e => e.sku.skuId === item.sku.skuId && e.sku.productId === item.sku.productId))
            ];

            mergedMap.set(list.shoppingListId, {
                ...existingList,
                ...list,
                shoppingListItems: mergedItems
            });
        } else {
            // Add new list if not already present
            mergedMap.set(list.shoppingListId, { ...list });
        }
    }

    return Array.from(mergedMap.values());
}

function getAllListsSkusOverview({ force = false, options = Empty.Object, cbCleanup = Empty.function } = Empty.Object) {
    return (dispatch, getState) => {
        const { user } = getState();

        const biAccountId = user?.beautyInsiderAccount?.biAccountId || user.profileId;

        shoppingListApi
            .getAllLists(biAccountId, { key: CACHE_ALL_LIST_SKUS_ONLY, invalidate: force }, options)
            .then(async json => {
                await Storage.db.setItem(ALL_LOVE_LIST_SKU_ONLY, json, LOVES_DATA_EXPIRY);

                dispatch(setLovesListSkuOnly(json));
            })
            .catch(() => {
                cbCleanup();
            });
    };
}

function getAllLists({
    callback, force = false, options = Empty.Object, cbCleanup = () => {}, _mergeIndexedData = true
} = Empty.Object) {
    return (dispatch, getState) => {
        const reduxState = getState();
        const { user } = reduxState;
        const existingData = reduxState.page.myLists || Empty.Object;
        const biAccountId = user?.beautyInsiderAccount?.biAccountId || user.profileId;

        if (typeof callback === 'function') {
            callback();
        }

        shoppingListApi
            .getAllLists(biAccountId, { key: CACHE_ALL_LIST, invalidate: force }, options)
            .then(async json => {
                const mergedAllLoves = { allLoves: mergeListsById(existingData.allLoves, json.allLoves) };
                const dataToStore = options?.currentPage && options?.currentPage > 1 ? mergedAllLoves : json;

                await Storage.db.setItem(ALL_LOVE_LIST, dataToStore, LOVES_DATA_EXPIRY);

                return dispatch({
                    type: GET_MY_LISTS_INITIAL_DATA,
                    payload: dataToStore
                });
            })
            .catch(() => {
                cbCleanup();
            });
    };
}

function setLovesList(shoppingList) {
    return dispatch => {
        const loves = (shoppingList && shoppingList.shoppingListItems) || shoppingList.loves || shoppingList.skus || Empty.Array;

        const loveIds = setShoppingListIds(loves);
        const totalLovesListItemsCount = shoppingList.shoppingListItemsCount || shoppingList.totalLovesListItemsCount || shoppingList.totalSkus || 0;
        const skuProductIds = setLoveListSkuProductIds(loves);

        dispatch(updateShoppingListIds(loveIds));

        const result = dispatch(
            updateLovesList({
                loves,
                shareLink: shoppingList.shareLink || '',
                totalLovesListItemsCount: totalLovesListItemsCount
            })
        );
        dispatch(updateLoveListSkuProductSet(skuProductIds));

        return !loves.length ? null : result;
    };
}

function setLimitedLoveListItems(limitedLoveListItems) {
    return {
        type: TYPES.SET_LIMITED_LOVE_LIST_ITEMS,
        payload: limitedLoveListItems
    };
}

function getFlatLoveListSkusWithDetails({ callback = null, force = false, options = {} } = Empty.Object) {
    return async (dispatch, getState) => {
        const {
            user,
            loves: { currentLovesSkuDetails, isSaleFilterEnabled, sortBy }
        } = getState();
        const biAccountId = user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : user.profileId;

        if (!biAccountId) {
            return;
        }

        const data = await shoppingListApi.getSkusFromAllLists(
            biAccountId,
            { key: CACHE_FULL, invalidate: force },
            {
                itemsPerPage: options.itemsPerPage || 5,
                currentPage: options.currentPage || 1,
                listShortNameLength: options.listShortNameLength || 20,
                skipProductDetails: options.skipProductDetails || false,
                includeInactiveSkus: options.includeInactiveSkus || true,
                sortBy: options.sortBy || sortBy || 'recently',
                filterType: options.filterType || isSaleFilterEnabled ? 'onSale' : null
            }
        );

        const loves = data.skus || data.loves || [];

        if (typeof callback === 'function') {
            callback(loves);
        }

        dispatch(
            updateLovesListSkuDetails({
                loves: options.currentPage === 1 ? loves : [...currentLovesSkuDetails, ...loves]
            })
        );
    };
}

function lovesListChanged(data, profileId, dispatch, callback, cleanup = () => {}) {
    if (typeof callback === 'function') {
        callback(data);
    }

    dispatch(
        getLovesList(profileId, lovesRes => {
            cleanup();

            return dispatch(updateShoppingListIds(lovesRes.map(loveItem => loveItem.sku.skuId)));
        })
    );

    // TODO 17.2: Handle optimistically
}

function getFlatLoveListSkusOverview(isUpdateShoppingList, callback, force = false) {
    return (dispatch, getState) => {
        const { user } = getState();
        const biAccountId = user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : user.profileId;

        if (!biAccountId) {
            return;
        }

        shoppingListApi
            .getSkusFromAllLists(
                biAccountId,
                { key: CACHE_BASIC, invalidate: force },
                {
                    itemsPerPage: 2000,
                    currentPage: 1,
                    listShortNameLength: 20,
                    skipProductDetails: true,
                    includeInactiveSkus: true
                }
            )
            .then(json => {
                const loves = Array.isArray(json.skus) ? json.skus : [];
                const totalLovesListItemsCount = json.totalSkus ?? 0;

                if (typeof callback === 'function') {
                    callback(loves);
                }

                if (isUpdateShoppingList) {
                    const loveIds = setShoppingListIds(loves);
                    const skuProductIds = setLoveListSkuProductIds(loves);
                    dispatch(updateShoppingListIds(loveIds));
                    dispatch(updateLoveListSkuProductSet(skuProductIds));
                }

                return dispatch(
                    updateLovesList({
                        loves,
                        totalLovesListItemsCount,
                        shareLink: json.shareLink
                    })
                );
            });
    };
}

function getLimitedLoveListItems({ callback, force = false, options = {} }) {
    return async (dispatch, getState) => {
        const { user } = getState();

        const biAccountId = user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : user.profileId;

        if (!biAccountId) {
            return;
        }

        const data = await shoppingListApi.getSkusFromAllLists(
            biAccountId,
            { key: CACHE_LIMITED_LOVE_LIST, invalidate: force },
            {
                itemsPerPage: options.itemsPerPage || 10,
                currentPage: options.currentPage || 1,
                listShortNameLength: options.listShortNameLength || 20,
                skipProductDetails: options.skipProductDetails || false,
                includeInactiveSkus: options.includeInactiveSkus || true,
                fetchAllLovesList: options.fetchAllLovesList || false,
                filterType: options.filterType || 'gtbtg',
                type: options.type || 'loves'
            }
        );
        const loves = data.skus || data.loves || [];
        dispatch(setLimitedLoveListItems(loves));

        if (typeof callback === 'function') {
            callback(loves);
        }
    };
}

function addLove(data, cbSuccess, cbCleanup = () => {}) {
    return (dispatch, getState) => {
        const reduxState = getState();
        const profileId = reduxState.user.profileId;
        const isSLSABTestEnabled = isSLSTestEnabledSelector(reduxState);
        const dataArray = data instanceof Array ? data : [data];
        const isSharableListEnabled = myListsUtils.isSharableListEnabled();
        shoppingListApi
            .addItemsToShoppingList(
                dataArray.filter(value => Object.keys(value).length !== 0),
                isSLSABTestEnabled
            )
            .then(res => {
                if (isSharableListEnabled) {
                    dispatch(getFlatLoveListSkusWithDetails({ callback: cbSuccess, force: true, options: { currentPage: 1 } }));
                    dispatch(getLimitedLoveListItems({ force: true, options: { itemsPerPage: MAX_LIMITED_LOVE_ITEMS_MY_LISTS_HOME_PAGE } }));
                    dispatch(getAllLists({ force: true, options: { itemsPerPage: MIN_ITEMS_PER_PAGE } }));
                    dispatch(getFlatLoveListSkusOverview(true, null, true));
                } else {
                    lovesListChanged(res[dataArray.length - 1], profileId, dispatch, cbSuccess, cbCleanup);
                }
            })
            .catch(cbCleanup);
    };
}

function removeLove(data, cbSuccess, cbCleanup = () => {}, productId) {
    return (dispatch, getState) => {
        const reduxState = getState();
        const profileId = reduxState.user.profileId;
        const isSLSABTestEnabled = isSLSTestEnabledSelector(reduxState);
        const dataArray = data instanceof Array ? data : [data];
        shoppingListApi
            .removeItemsFromShoppingList(dataArray, profileId, productId, isSLSABTestEnabled)
            .then(res => {
                lovesListChanged(res[dataArray.length - 1], profileId, dispatch, cbSuccess, cbCleanup);
            })
            .catch(cbCleanup);
    };
}

function showMyListsModal(isOpen, showCreateListModal = false) {
    return {
        type: TYPES.SHOW_MY_LISTS_MODAL,
        showMyListsModal: isOpen,
        showCreateListModal
    };
}

function setSkuLoveData(skuLoveData) {
    return {
        type: TYPES.SET_SKU_LOVE_DATA,
        payload: skuLoveData
    };
}

function setSkuLoveImageData(skuLoveImageData) {
    return {
        type: TYPES.SET_SKU_LOVE_IMAGE_DATA,
        payload: skuLoveImageData
    };
}

function setLoveListName(loveListName) {
    return {
        type: TYPES.SET_LOVE_LIST_NAME,
        payload: loveListName
    };
}

function setLoveListUpdated(isLoveListUpdated) {
    return {
        type: TYPES.SET_LOVE_LIST_UPDATED,
        payload: isLoveListUpdated
    };
}

function renameSharableList(skuLoveData, cbSuccess = () => {}, cbCleanup = () => {}) {
    return (dispatch, getState) => {
        const { user } = getState();
        const biAccountId = user.beautyInsiderAccount?.biAccountId || user.profileId;

        return shoppingListApi
            .renameSharableList(biAccountId, skuLoveData)
            .then(responseData => {
                cbSuccess(responseData);
                dispatch(setLoveListUpdated(true));

                return responseData;
            })
            .catch(err => {
                cbCleanup(err);

                return Promise.reject(err);
            });
    };
}

function addItemToSharableList(skuLoveData, cbSuccess = () => {}, cbCleanup = () => {}) {
    return (dispatch, getState) => {
        const { user } = getState();
        const biAccountId = user.beautyInsiderAccount?.biAccountId || user.profileId;

        return shoppingListApi
            .addItemToSharableList(biAccountId, skuLoveData)
            .then(responseData => {
                cbSuccess(responseData);

                return responseData;
            })
            .catch(err => {
                cbCleanup(err);

                return Promise.reject(err);
            });
    };
}

function createNewList(data, newSkuToAdd = null, isDefault) {
    return (dispatch, getState) => {
        const { user } = getState();
        const biAccountId = user.beautyInsiderAccount?.biAccountId || user.profileId;

        return shoppingListApi
            .createNewList(data, biAccountId, isDefault)
            .then(response => {
                if (newSkuToAdd?.skuId) {
                    const skuWithListInfo = {
                        ...newSkuToAdd,
                        shoppingListId: response.shoppingListId,
                        shoppingListName: response.shoppingListName
                    };

                    return dispatch(
                        addItemToSharableList(
                            skuWithListInfo,
                            () => {},
                            () => {}
                        )
                    ).then(() => {
                        dispatch(getAllLists({ force: true, options: { itemsPerPage: MIN_ITEMS_PER_PAGE } }));

                        return response;
                    });
                }

                dispatch(getAllLists({ force: true, options: { itemsPerPage: MIN_ITEMS_PER_PAGE } }));

                return response;
            })
            .catch(e => Promise.reject(e));
    };
}

function removeItemFromSharableList(productLoveData, cbSuccess = () => {}, cbCleanup = () => {}) {
    return (dispatch, getState) => {
        const { user } = getState();
        const biAccountId = user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : user.profileId;
        const { skuId, productId, type, id } = productLoveData;

        return shoppingListApi
            .removeItemFromSharableList(biAccountId, skuId, { productId, type, id })
            .then(responseData => {
                cbSuccess(responseData);

                return Promise.resolve(responseData);
            })
            .catch(err => {
                cbCleanup(err);

                return Promise.reject(err);
            });
    };
}

function removeSharableList({ listId, cbSuccess = () => {}, cbCleanup = () => {} }) {
    return (dispatch, getState) => {
        const { user } = getState();
        const biAccountId = user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : user.profileId;

        return shoppingListApi
            .removeSharableList({ biAccountId, listId })
            .then(responseData => {
                cbSuccess(responseData);
                dispatch(setLoveListUpdated(true));

                return responseData;
            })
            .catch(err => {
                cbCleanup(err);

                return Promise.reject(err);
            });
    };
}

function getShoppingListById(options = {}) {
    return async (dispatch, getState) => {
        const {
            page: {
                myCustomList: { shoppingListItems }
            },
            loves: { sortBy },
            user
        } = getState();
        const shoppingListId = locationUtils.getMyCustomListId();
        const sharedListToken = locationUtils.getSharedListToken();
        const biAccountId = user?.beautyInsiderAccount?.biAccountId || user.profileId;
        let data = {};

        if (shoppingListId && biAccountId) {
            data = await shoppingListApi.getShoppingListById(biAccountId, shoppingListId, {
                ...options,
                sortBy: options.sortBy || sortBy || 'recently'
            });
            data.shoppingListItems = options.currentPage > 1 ? [...shoppingListItems, ...data.shoppingListItems] : data.shoppingListItems;
            data.isSharedList = false;
        }

        if (sharedListToken) {
            data = await shoppingListApi.getSharedShoppingListByToken({ biAccountId, sharedListToken, options });
            data = {
                ...data?.loves,
                isSharedList: true,
                shoppingListItems:
                    options.currentPage > 1 ? [...shoppingListItems, ...(data?.loves?.shoppingListItems || [])] : data?.loves?.shoppingListItems
            };
        }

        dispatch({
            type: SET_MY_CUSTOM_LIST,
            payload: data
        });
        dispatch(setLoveListName(data.shoppingListName || ''));
    };
}

function loadFlatLoveListSkusOverviewFromCache() {
    return async dispatch => {
        try {
            const entry = await Storage.db.getItem(LOVED_ITEMS_SKU_ONLY);

            if (!entry) {
                return;
            }

            const loves = entry.skus;
            const totalLovesListItemsCount = entry.totalSkus;
            const shareLink = entry.shareLink || '';

            dispatch(
                updateLovesList({
                    loves,
                    totalLovesListItemsCount,
                    shareLink
                })
            );
        } catch (err) {
            Sephora.logger.error('No cache to load:', err);
        }
    };
}

function setSaleFilter(isSaleFilterEnabled) {
    return {
        type: TYPES.SET_SALE_FILTER,
        payload: isSaleFilterEnabled
    };
}

function setSortByFilter(sortByFilter) {
    return {
        type: TYPES.SET_SORT_BY_FILTER,
        payload: sortByFilter
    };
}

export default {
    TYPES,
    getLovesList,
    setLovesList,
    updateLovesList,
    updatePublicLovesList,
    updateShoppingListIds,
    addLove,
    removeLove,
    updateLovesSorting,
    updateLovesListSkuDetails,
    showMyListsModal,
    setSkuLoveData,
    setSkuLoveImageData,
    setLoveListName,
    getAllLists,
    getAllListsSkusOverview,
    createNewList,
    renameSharableList,
    addItemToSharableList,
    removeItemFromSharableList,
    removeSharableList,
    setLoveListUpdated,
    getShoppingListById,
    setSaleFilter,
    setSortByFilter,
    getLimitedLoveListItems,
    setLimitedLoveListItems,
    getFlatLoveListSkusWithDetails,
    getFlatLoveListSkusOverview,
    loadFlatLoveListSkusOverviewFromCache
};
