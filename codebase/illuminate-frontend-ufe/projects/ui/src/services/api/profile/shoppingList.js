/* eslint-disable no-unused-vars */
import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import headerUtils from 'utils/Headers';
import shoppingListUtils from 'utils/ShoppingList';
import Storage from 'utils/localStorage/Storage';
import Empty from 'constants/empty';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
const { StorageTypes } = Storage;
const { userXTimestampHeader } = headerUtils;
import myListsUtils from 'utils/MyLists';
import { RECENT_ITEMS_PAGINATION_SIZE } from 'constants/sharableList';
// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Shopping+List
const DEFAULT_CURRENT_PAGE = 1;
const {
    LOVED_ITEMS_WITH_DETAILS, LOVED_ITEMS_SKU_ONLY, LIMITED_LOVED_ITEMS, ALL_LOVE_LIST, ALL_LOVE_LIST_SKU_ONLY
} = LOCAL_STORAGE;

const LOVES_DATA_EXPIRY = Storage.MINUTES * 15;
const MAX_ITEMS = 100;
const cacheListsConstants = {
    cacheFull: {
        key: LOVED_ITEMS_WITH_DETAILS,
        expiry: LOVES_DATA_EXPIRY,
        storageType: StorageTypes.IndexedDB
    },

    cacheBasic: {
        key: LOVED_ITEMS_SKU_ONLY,
        expiry: LOVES_DATA_EXPIRY,
        storageType: StorageTypes.IndexedDB
    },
    cacheAllList: {
        key: ALL_LOVE_LIST,
        expiry: LOVES_DATA_EXPIRY,
        storageType: StorageTypes.IndexedDB
    },
    cacheAllListSkusOnly: {
        key: ALL_LOVE_LIST_SKU_ONLY,
        expiry: LOVES_DATA_EXPIRY,
        storageType: StorageTypes.IndexedDB
    },
    cacheLimitedLoveList: {
        key: LIMITED_LOVED_ITEMS,
        expiry: LOVES_DATA_EXPIRY,
        storageType: StorageTypes.IndexedDB
    }
};

const _makeMultipleRequests = function (requestParamsList) {
    return Promise.all(requestParamsList.map(requestParams => ufeApi.makeRequest(requestParams.url, requestParams.options))).then(values => {
        let promise;

        const errors = values.filter(data => data.errorCode);

        if (errors.length) {
            promise = Promise.reject(errors);
        } else {
            promise = Promise.resolve(values);
        }

        return promise;
    });
};

function addItemsToShoppingList(params) {
    return _makeMultipleRequests(
        params.map(data => {
            const options = {
                skuId: data.skuId,
                source: data.loveSource,
                productId: data.productId
            };

            if (data.isRopisSku) {
                options.fulfillmentType = 'ROPIS';
            }

            let url = '/api/users/profiles/shoppingList';

            if (shoppingListUtils.isSLSServiceEnabled()) {
                url = '/api/v3/users/profiles/shoppingList';
            }

            return {
                url: url,
                options: {
                    method: 'POST',
                    headers: userXTimestampHeader(),
                    body: JSON.stringify(options)
                }
            };
        })
    );
}

function removeItemsFromShoppingList(params, profileId, productId) {
    return _makeMultipleRequests(
        params.map(skuId => {
            const urlBase = shoppingListUtils.isSLSServiceEnabled() ? '/api/v3/users/profiles/' : '/api/users/profiles/';
            let url = urlBase + profileId + '/shoppingList/' + skuId;

            if (productId) {
                url = url + '?productId=' + productId;
            }

            return {
                url,
                options: { method: 'DELETE' }
            };
        })
    );
}

function getShoppingList(profileId, options = {}) {
    const id = options.isPublicLovesList ? 'current' : profileId;
    let url = '/api/users/profiles/' + id + '/shoppingList';

    if (shoppingListUtils.isSLSServiceEnabled()) {
        url = '/api/v3/users/profiles/' + id + '/shoppingList';
    }

    const { itemsPerPage, currentPage, sortBy } = options;

    const qsParams = {
        itemsPerPage,
        currentPage,
        sortBy
    };

    if (options.token) {
        qsParams.token = options.token;
        qsParams.currentPage = DEFAULT_CURRENT_PAGE; //always 1 for shared list
    }

    const qs = urlUtils.makeQueryString(qsParams);

    if (qs) {
        url += '?' + qs;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function getAllLists(biAccountId, config = Empty.Object, options = {}) {
    const isPerfImprovementEnabled = myListsUtils.isPerfImprovementEnabled();
    const configSettings = {
        cache: {
            ...(cacheListsConstants[config.key] || Empty.Object),
            invalidate: config.invalidate || false
        }
    };

    let url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists/all`;
    const qsParams = {
        ...(options.itemsPerPage && { itemsPerPage: options.itemsPerPage }),
        ...(isPerfImprovementEnabled ? { includeApis: 'loves' } : Empty.Object),
        currentPage: options.currentPage || 1,
        skipProductDetails: options.skipProductDetails || false,
        includeInactiveSkus: options.includeInactiveSkus || true,
        fetchAllLovesList: options.fetchAllLovesList || true
    };

    url += `?${urlUtils.makeQueryString(qsParams)}`;

    return ufeApi.makeRequest(url, { method: 'GET' }, configSettings).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function createNewList(shoppingListName, profileId, isDefault = false) {
    const url = `/gway/v1/dotcom/users/profiles/${profileId}/lists/new`;
    const body = {
        shoppingListName,
        shoppingListType: 'LOVES' // All new lists are created as LOVES type
    };

    if (isDefault) {
        body.isDefault = true;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

function renameSharableList(biAccountId, payload) {
    const url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists/rename`;

    const body = {
        shoppingListType: 'LOVES',
        isDefault: false,
        ...payload
    };

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
        .then(data => {
            return data.errorCode ? Promise.reject(data) : data;
        });
}

function addItemToSharableList(biAccountId, payload) {
    const url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists`;
    const body = {
        shoppingListType: 'LOVES',
        ...payload
    };

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        .then(data => {
            return data.errorCode ? Promise.reject(data) : data;
        });
}

function removeSharableList({ biAccountId, listId }) {
    const url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists/${listId}`;

    return ufeApi
        .makeRequest(url, {
            method: 'DELETE'
        })
        .then(data => {
            return data.errorCode ? Promise.reject(data) : data;
        });
}

function removeItemFromSharableList(biAccountId, skuId, options = Empty.Object) {
    let url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists/skus/${skuId}`;
    const qsParams = {
        productId: options.productId,
        type: options.type,
        id: options.id
    };
    url += `?${urlUtils.makeQueryString(qsParams)}`;

    return ufeApi
        .makeRequest(url, {
            method: 'DELETE'
        })
        .then(data => {
            return data.errorCode ? Promise.reject(data) : data;
        });
}

function getShoppingListById(biAccountId, shoppingListId, options = Empty.Object) {
    let url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists/fetch`;
    const qsParams = {
        itemsPerPage: options.itemsPerPage || RECENT_ITEMS_PAGINATION_SIZE,
        currentPage: options.currentPage || 1,
        skipProductDetails: options.skipProductDetails || false,
        includeInactiveSkus: options.includeInactiveSkus || true,
        sortBy: options.sortBy || 'recently'
    };

    if (shoppingListId) {
        qsParams.id = shoppingListId;
    }

    url += `?${urlUtils.makeQueryString(qsParams)}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function getSkusFromAllLists(biAccountId, config = Empty.Object, options = Empty.Object) {
    const configSettings = {
        cache: {
            ...(cacheListsConstants[config.key] || Empty.Object),
            invalidate: config.invalidate || false
        }
    };

    let url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists/skus/all`;
    const qsParams = {
        itemsPerPage: options.itemsPerPage || 100,
        currentPage: options.currentPage || 1,
        listShortNameLength: options.listShortNameLength || 20,
        skipProductDetails: options.skipProductDetails || false,
        includeInactiveSkus: options.includeInactiveSkus || true,
        fetchAllLovesList: options.fetchAllLovesList || true,
        sortBy: options.sortBy || 'recently'
    };

    if (options.filterType) {
        qsParams.filterType = options.filterType;
    }

    if (options.type) {
        qsParams.type = options.type;
    }

    url += `?${urlUtils.makeQueryString(qsParams)}`;

    return ufeApi.makeRequest(url, { method: 'GET' }, configSettings).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function getSharedShoppingListByToken({ biAccountId = 'current', sharedListToken, options = {} }) {
    let url = `/gway/v1/dotcom/users/profiles/${biAccountId}/lists`;

    const qsParams = {
        itemsPerPage: options.itemsPerPage || 60,
        currentPage: options.currentPage || 1,
        skipProductDetails: options.skipProductDetails || false,
        includeInactiveSkus: options.includeInactiveSkus || true,
        sortBy: options.sortBy || 'recently'
    };

    if (sharedListToken) {
        qsParams.token = sharedListToken;
    }

    url += `?${urlUtils.makeQueryString(qsParams)}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    addItemsToShoppingList,
    removeItemsFromShoppingList,
    getShoppingList,
    getAllLists,
    createNewList,
    renameSharableList,
    addItemToSharableList,
    removeItemFromSharableList,
    removeSharableList,
    getShoppingListById,
    getSkusFromAllLists,
    getSharedShoppingListByToken
};
