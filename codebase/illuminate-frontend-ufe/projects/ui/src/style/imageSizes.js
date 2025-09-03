const PRODUCT_TILE = [164, 230];
const THUMBNAIL_PRODUCT_MEDIA_ITEM = 48;
const INCREASED_PRODUCT_TILE = [175, 315];

const getProductTileSize = increaseImageSizeGrid => {
    return increaseImageSizeGrid ? INCREASED_PRODUCT_TILE : PRODUCT_TILE;
};

export {
    PRODUCT_TILE, getProductTileSize, THUMBNAIL_PRODUCT_MEDIA_ITEM
};
