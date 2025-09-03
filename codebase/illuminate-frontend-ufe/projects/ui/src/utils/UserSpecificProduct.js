import deepExtend from './deepExtend';

/**
 * Returns a map of all skuId->sku for all skus in a product.  This ibcludes all sku groups,
 * such as ymalSkus, ancillarySkus, etc...
 *
 * @param userSpecificProductDetails
 * @returns {Map}
 */
const buildMapOfUserSpecificSkuDetails = function (userSpecificProductDetails = {}, product) {
    const safelySet = function (skuMap, id, newValue, skuWithoutUserDetails) {
        const oldValue = skuMap.get(id);
        const newObject = deepExtend({}, oldValue, newValue);

        if (newObject.actionFlags && skuWithoutUserDetails && skuWithoutUserDetails.actionFlags) {
            newObject.actionFlags = {
                ...skuWithoutUserDetails.actionFlags,
                ...newObject.actionFlags
            };
        }

        skuMap.set(id, newObject);
    };
    const {
        regularChildSkus = [],
        onSaleChildSkus = [],
        simillarSkus = [],
        ymalSkus = [],
        ancillarySkus = [],
        recentlyViewedSkus = []
    } = userSpecificProductDetails;

    const {
        regularChildSkus: regularChildSkusProduct = [],
        onSaleChildSkus: onSaleChildSkusProduct = [],
        simillarSkus: simillarSkusProduct = [],
        ymalSkus: ymalSkusProduct = [],
        ancillarySkus: ancillarySkusProduct = [],
        recentlyViewedSkus: recentlyViewedSkusProduct = []
    } = product;

    const skuMap = new Map();

    if (userSpecificProductDetails.currentSku) {
        safelySet(skuMap, userSpecificProductDetails.currentSku.skuId, userSpecificProductDetails.currentSku, product.currentSku);
    }

    regularChildSkus.forEach(skuDetails => {
        const skuWithoutUserDetails = regularChildSkusProduct.find(sku => sku.skuId === skuDetails.skuId);
        safelySet(skuMap, skuDetails.skuId, skuDetails, skuWithoutUserDetails);
    });

    onSaleChildSkus.forEach(skuDetails => {
        const skuWithoutUserDetails = onSaleChildSkusProduct.find(sku => sku.skuId === skuDetails.skuId);
        safelySet(skuMap, skuDetails.skuId, skuDetails, skuWithoutUserDetails);
    });

    simillarSkus.forEach(skuDetails => {
        const skuWithoutUserDetails = simillarSkusProduct.find(sku => sku.skuId === skuDetails.skuId);
        safelySet(skuMap, skuDetails.skuId, skuDetails, skuWithoutUserDetails);
    });

    ymalSkus.forEach(skuDetails => {
        const skuWithoutUserDetails = ymalSkusProduct.find(sku => sku.skuId === skuDetails.skuId);
        safelySet(skuMap, skuDetails.skuId, skuDetails, skuWithoutUserDetails);
    });

    ancillarySkus.forEach(skuDetails => {
        const skuWithoutUserDetails = ancillarySkusProduct.find(sku => sku.skuId === skuDetails.skuId);
        safelySet(skuMap, skuDetails.skuId, skuDetails, skuWithoutUserDetails);
    });

    recentlyViewedSkus.forEach(skuDetails => {
        const skuWithoutUserDetails = recentlyViewedSkusProduct.find(sku => sku.skuId === skuDetails.skuId);
        safelySet(skuMap, skuDetails.skuId, skuDetails, skuWithoutUserDetails);
    });

    return skuMap;
};

/**
 * This copies only to a single level.  It does not deep copy within skus, for example
 *
 * This is necessary because our product store data is not normalized
 *
 * @param product
 */
const deepCopyProduct = function (product) {
    const {
        regularChildSkus = [], onSaleChildSkus = [], simillarSkus = [], ymalSkus = [], ancillarySkus = [], recentlyViewedSkus = []
    } = product;

    const newProduct = Object.assign({}, product);
    newProduct.currentSku = Object.assign({}, product.currentSku);

    newProduct.regularChildSkus = regularChildSkus.slice();
    newProduct.onSaleChildSkus = onSaleChildSkus.slice();
    newProduct.simillarSkus = simillarSkus.slice();
    newProduct.ymalSkus = ymalSkus.slice();
    newProduct.ancillarySkus = ancillarySkus.slice();
    newProduct.recentlyViewedSkus = recentlyViewedSkus.slice();

    return newProduct;
};

// TODO 2/10/21 The whole util has to be refactored. It's used by a reducer and it's IMPURE
const UserSpecificProductUtil = {
    // This method adds User specific details to currentProduct Object
    // for example currentSku, regularChildSkus, onSaleChildSkus, simillarSkus, ymalSkus
    // ancillarySkus and recentlyViewedSkus because this information will be pulled
    // for each user after initial cached product common information is loaded in ctrlr
    addUserSpecificDetailsToProduct: function (product, userSpecificProductDetails = {}) {
        const userSpecificProduct = deepCopyProduct(product);

        // If we have user-specific data, flag the product as ready
        if (Object.keys(userSpecificProductDetails).length !== 0) {
            userSpecificProduct.isUserSpecificReady = true;

            userSpecificProduct.usingDefaultUserSpecificData = userSpecificProductDetails.usingDefaultUserSpecificData;

            const {
                regularChildSkus = [], onSaleChildSkus = [], simillarSkus = [], ymalSkus = [], ancillarySkus = []
            } = userSpecificProduct;

            const skuMap = buildMapOfUserSpecificSkuDetails(userSpecificProductDetails, product);

            const mergedActionFlags = {
                ...userSpecificProduct.currentSku.actionFlags,
                ...(userSpecificProductDetails.currentSku?.actionFlags || {})
            };

            Object.assign(userSpecificProduct.currentSku, skuMap.get(userSpecificProductDetails.currentSku?.skuId), {
                actionFlags: mergedActionFlags
            });

            regularChildSkus.forEach((sku, i) => {
                const userSpecificData = skuMap.get(sku.skuId);

                if (userSpecificData) {
                    regularChildSkus[i] = Object.assign({}, regularChildSkus[i], userSpecificData);
                } else {
                    // eslint-disable-next-line no-console
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            onSaleChildSkus.forEach((sku, i) => {
                const userSpecificData = skuMap.get(sku.skuId);

                if (userSpecificData) {
                    onSaleChildSkus[i] = Object.assign({}, onSaleChildSkus[i], userSpecificData);
                } else {
                    // eslint-disable-next-line no-console
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            simillarSkus.forEach((sku, i) => {
                const userSpecificData = skuMap.get(sku.skuId);

                if (userSpecificData) {
                    simillarSkus[i] = Object.assign({}, simillarSkus[i], userSpecificData);
                } else {
                    // eslint-disable-next-line no-console
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            ymalSkus.forEach((sku, i) => {
                const userSpecificData = skuMap.get(sku.skuId);

                if (userSpecificData) {
                    ymalSkus[i] = Object.assign({}, ymalSkus[i], userSpecificData);
                } else {
                    // eslint-disable-next-line no-console
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            ancillarySkus.forEach((sku, i) => {
                const userSpecificData = skuMap.get(sku.skuId);

                if (userSpecificData) {
                    ancillarySkus[i] = Object.assign({}, ancillarySkus[i], userSpecificData);
                } else {
                    // eslint-disable-next-line no-console
                    console.debug('No user specific data found for sku ' + sku.skuId);
                }
            });

            // Unlike other properties, recentlyViewedSkus needs to be replaced
            // because recentlyViewedSkus is not available on initial load
            // and thus we need to add it once it is created and pulled as part
            // of full user call after ctrlr is already initialized
            if (userSpecificProductDetails.recentlyViewedSkus) {
                userSpecificProduct.recentlyViewedSkus = userSpecificProductDetails.recentlyViewedSkus;
            }
        }

        if (!userSpecificProduct.brand) {
            userSpecificProduct.brand = {};
        }

        return userSpecificProduct;
    }
};

export default UserSpecificProductUtil;
