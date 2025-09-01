const TYPES = {
    SHOW_MORE_STORES_ON_MAP: 'SHOW_MORE_STORES_ON_MAP',
    OPEN_INFO_WINDOW: 'OPEN_INFO_WINDOW'
};

function showMoreStoresOnMap(stores) {
    return {
        type: TYPES.SHOW_MORE_STORES_ON_MAP,
        stores: stores
    };
}

function openInfoWindow(storeId) {
    return {
        type: TYPES.OPEN_INFO_WINDOW,
        storeId
    };
}

export default {
    TYPES,
    showMoreStoresOnMap,
    openInfoWindow
};
