const ACTION_TYPES = {
    SET_GALLERY_GRID_DATA: 'SET_GALLERY_GRID_DATA',
    SET_CAROUSEL_GALLERY_DATA: 'SET_CAROUSEL_GALLERY_DATA',
    SET_ACTIVE_GALLERY_ITEM_INDEX: 'SET_ACTIVE_GALLERY_ITEM_INDEX',
    SET_LOVE_COUNT_GALLERY_ITEM: 'SET_LOVE_COUNT_GALLERY_ITEM',
    SET_LOVE_COUNT_IN_CAROUSEL: 'SET_LOVE_COUNT_IN_CAROUSEL'
};

const initialState = {
    gridGalleryData: [],
    carouselGalleryData: [],
    activeGalleryItemIndex: 0
};

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case ACTION_TYPES.SET_GALLERY_GRID_DATA:
            return Object.assign({}, state, {
                gridGalleryData: payload
            });
        case ACTION_TYPES.SET_CAROUSEL_GALLERY_DATA:
            return Object.assign({}, state, {
                carouselGalleryData: payload
            });
        case ACTION_TYPES.SET_ACTIVE_GALLERY_ITEM_INDEX:
            return Object.assign({}, state, {
                activeGalleryItemIndex: payload
            });
        case ACTION_TYPES.SET_LOVE_COUNT_GALLERY_ITEM:
            return Object.assign({}, state, {
                gridGalleryData: state.gridGalleryData.map(item => {
                    if (item.id === payload.id) {
                        return payload;
                    }

                    return item;
                })
            });
        case ACTION_TYPES.SET_LOVE_COUNT_IN_CAROUSEL:
            return Object.assign({}, state, {
                carouselGalleryData: state.carouselGalleryData.map(item => {
                    if (item.id === payload.id) {
                        return payload;
                    }

                    return item;
                })
            });
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
