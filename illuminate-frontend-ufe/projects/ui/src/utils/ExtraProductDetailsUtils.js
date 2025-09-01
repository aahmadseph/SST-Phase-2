/* eslint-disable no-use-before-define */
import deepExtend from 'utils/deepExtend';

const AVAILABILITY = {
    OUT_OF_STOCK: 'Out of Stock',
    LIMITED_STOCK: 'Limited Stock',
    IN_STOCK: 'In Stock'
};

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target, ...sources) {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }

                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

function mergeActionFlags(actionFlagsProduct = {}, actionFlagsAlternate) {
    Object.assign(actionFlagsProduct, actionFlagsAlternate);
}

function mergeCurrentSkuIntoChildSkus(childSkus, currentAlternateSku) {
    if (childSkus) {
        const currentSku = childSkus.find(sku => sku.skuId === currentAlternateSku.skuId);

        if (currentSku) {
            mergeActionFlags(currentSku.actionFlags, currentAlternateSku.actionFlags);
            deepMerge(currentSku, currentAlternateSku);
        }
    }
}

function mergeChildSkus(childSkus, alternateChildSkus) {
    if (childSkus && childSkus.length > 0) {
        let currentAlternateSku;
        childSkus.forEach(currentSku => {
            currentAlternateSku = alternateChildSkus.find(sku => sku.skuId === currentSku.skuId);

            if (currentAlternateSku) {
                mergeActionFlags(currentSku.actionFlags, currentAlternateSku.actionFlags);
            }

            deepMerge(currentSku, currentAlternateSku);
        });
    }
}

function mergeCurrentSku(regularProduct, alternateProduct) {
    mergeActionFlags(regularProduct.currentSku.actionFlags, alternateProduct.currentSku.actionFlags);
    deepMerge(regularProduct.currentSku, alternateProduct.currentSku);

    if (alternateProduct.pickupMessage) {
        regularProduct.pickupMessage = alternateProduct.pickupMessage;
    }
}

function findCurrentSkuInChildren(currentSkuId, childrenSkus) {
    if (childrenSkus) {
        return childrenSkus.find(sku => sku.skuId === currentSkuId);
    } else {
        return null;
    }
}

const ExtraProductDetailsUtils = {
    removeReserveOnlinePickUpInStoreDetailsToProduct: function (productWithAlternateDetails, previousProduct) {
        const currentSkuId = productWithAlternateDetails.currentSku.skuId;

        let currentSku = findCurrentSkuInChildren(currentSkuId, previousProduct.regularChildSkus);

        if (!currentSku && previousProduct.ancillarySkus) {
            currentSku = findCurrentSkuInChildren(currentSkuId, previousProduct.ancillarySkus);
        }

        if (!currentSku && previousProduct.onSaleChildSkus) {
            currentSku = findCurrentSkuInChildren(currentSkuId, previousProduct.onSaleChildSkus);
        }

        if (currentSku) {
            previousProduct.currentSku = currentSku;
        }

        return previousProduct;
    },

    // This method adds alternate (ROPIS or SDD) specific details to currentProduct Object
    // for example currentSku, regularChildSkus, onSaleChildSkus and ancillarySkus
    // because this information will be pulled if the user chooses the Reserve Online
    // Pick Up In Store option in product page after initial cached product common
    // information is loaded in ctrlr
    addReserveOnlinePickUpInStoreDetailsToProduct: function (product, reserveOnlinePickUpInStoreProductDetails = {}) {
        let clonedProduct = deepExtend({}, product);
        mergeCurrentSku(clonedProduct, reserveOnlinePickUpInStoreProductDetails);

        if (reserveOnlinePickUpInStoreProductDetails.regularChildSkus) {
            mergeChildSkus(clonedProduct.regularChildSkus, reserveOnlinePickUpInStoreProductDetails.regularChildSkus);
        }

        // TODO: ancillarySkus correspond to «Use It With», so we are not updating it for now since Quick Look
        // stock availability is not being updated. Uncomment these lines when QuickLook product availability is updated
        // if (reserveOnlinePickUpInStoreProductDetails.ancillarySkus) {
        //     mergeChildSkus(clonedProduct.ancillarySkus, reserveOnlinePickUpInStoreProductDetails.ancillarySkus);
        // }
        if (reserveOnlinePickUpInStoreProductDetails.onSaleChildSkus) {
            mergeChildSkus(clonedProduct.onSaleChildSkus, reserveOnlinePickUpInStoreProductDetails.onSaleChildSkus);
        }

        // ROPIS API returns a list of childSkus excluding the current sku. We're traversing through the
        // skus to make sure the current sku gets merged with its ROPIS properties as well
        if (clonedProduct.regularChildSkus) {
            mergeCurrentSkuIntoChildSkus(clonedProduct.regularChildSkus, reserveOnlinePickUpInStoreProductDetails.currentSku);
        }

        if (clonedProduct.ancillarySkus) {
            mergeCurrentSkuIntoChildSkus(clonedProduct.ancillarySkus, reserveOnlinePickUpInStoreProductDetails.currentSku);
        }

        if (clonedProduct.onSaleChildSkus) {
            mergeCurrentSkuIntoChildSkus(clonedProduct.onSaleChildSkus, reserveOnlinePickUpInStoreProductDetails.currentSku);
        }

        clonedProduct = Object.assign(reserveOnlinePickUpInStoreProductDetails, clonedProduct);

        return clonedProduct;
    },

    isProductRopisUpdated: function (product) {
        return product.pickupMessage !== undefined && product.pickupMessage !== null;
    },

    isProductSameDayDeliveryUpdated: function (product) {
        const sameDayAvailabilityStatus = product.currentSku?.actionFlags?.sameDayAvailabilityStatus;

        return sameDayAvailabilityStatus !== undefined && sameDayAvailabilityStatus !== null;
    },

    hasProductExtraProps: function (product) {
        return ExtraProductDetailsUtils.isProductRopisUpdated(product) || ExtraProductDetailsUtils.isProductSameDayDeliveryUpdated(product);
    },

    isOutOfStock: function (availabilityStatus) {
        return availabilityStatus === AVAILABILITY.OUT_OF_STOCK;
    },

    isLimitedStock: function (availabilityStatus) {
        return availabilityStatus === AVAILABILITY.LIMITED_STOCK;
    },

    isinStock: function (availabilityStatus) {
        return availabilityStatus === AVAILABILITY.IN_STOCK;
    },

    // Return the availability status of the current sku, used when
    // actionFlags.availabilityStatus is undefined
    getStockAvailabilityStatus: function (currentSku) {
        if (!currentSku) {
            return null;
        }

        switch (true) {
            case currentSku.isOutOfStock:
                return AVAILABILITY.OUT_OF_STOCK;
            case currentSku.isLimitedStock || currentSku.isOnlyFewLeft:
                return AVAILABILITY.LIMITED_STOCK;
            default:
                return AVAILABILITY.IN_STOCK;
        }
    },

    availabilityLabel: function (availabilityStatus) {
        if (ExtraProductDetailsUtils.isOutOfStock(availabilityStatus) || availabilityStatus === false) {
            return 'outOfStock';
        } else if (ExtraProductDetailsUtils.isLimitedStock(availabilityStatus)) {
            return 'limitedStock';
        } else if (ExtraProductDetailsUtils.isinStock(availabilityStatus) || availabilityStatus === true) {
            return 'inStock';
        } else {
            return 'selectForStoreAvailability';
        }
    },

    isLabelInStockStatus: function (availabilityLabel) {
        return availabilityLabel?.match(/(inStock|limitedStock)/)?.length;
    },

    AVAILABILITY_STATUS: AVAILABILITY,

    mergeActionFlags,
    mergeChildSkus,
    mergeCurrentSku,
    mergeCurrentSkuIntoChildSkus,
    findCurrentSkuInChildren
};

export default ExtraProductDetailsUtils;
