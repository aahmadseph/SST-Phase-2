import {
    CHANNELS, COUNTRIES, LANGUAGES
} from '#server/services/utils/Constants.mjs';

function overrideLocAndCh(apiOptions) {
    // Override channel, language and country, based in ch and loc query params.
    // Set defaults for missing or incorrect param values.
    const updatedApiOptions = Object.assign({}, apiOptions);
    const channelQueryParam = updatedApiOptions.parseQuery?.ch;
    const locQueryParam = updatedApiOptions.parseQuery?.loc;
    const validChannels = Object.values(CHANNELS);
    const validLoc = [
        `${LANGUAGES.EN}-${COUNTRIES.US.toUpperCase()}`,
        `${LANGUAGES.EN}-${COUNTRIES.CA.toUpperCase()}`,
        `${LANGUAGES.FR}-${COUNTRIES.CA.toUpperCase()}`
    ];

    if (channelQueryParam && validChannels.includes(channelQueryParam)) {
        updatedApiOptions.channel = channelQueryParam;
    } else {
        updatedApiOptions.channel = CHANNELS.RWD;
    }

    if (locQueryParam && validLoc.includes(locQueryParam)) {
        const [language, country] = locQueryParam.split('-');
        updatedApiOptions.language = language;
        updatedApiOptions.country = country;
    } else {
        updatedApiOptions.language = LANGUAGES.EN;
        updatedApiOptions.country = COUNTRIES.US.toUpperCase();
    }

    return updatedApiOptions;
}

function mergeStockAvailabilityWithProductSkus(productDetails, stockAvailability) {
    const {
        currentSku = {}, ancillarySkus, regularChildSkus, onSaleChildSkus
    } = productDetails;

    const DEFAULT_OOS = {
        isOutOfStock: true
    };

    const setOutOfStock = item => {
        return {
            ...item,
            ...DEFAULT_OOS
        };
    };

    // Product details response contains the stock availabilty for Distribution Center.
    // We don't want that information in Item Substitution, so we set isOutOfStock as true for all skus.
    const updatedProductDetails = {
        currentSku: {
            ...currentSku,
            ...DEFAULT_OOS
        },
        ancillarySkus: ancillarySkus?.length && ancillarySkus.map(setOutOfStock),
        regularChildSkus: regularChildSkus?.length && regularChildSkus.map(setOutOfStock),
        onSaleChildSkus: onSaleChildSkus?.length && onSaleChildSkus.map(setOutOfStock)
    };

    // For an uknown reason, we could receive an empty response from PXS when trying
    // to get the stock availability.
    // For that case, we will simply return all the ancillarySkus, regularChildSkus
    // and onSaleChildSkus as OOS.
    if (!stockAvailability) {
        return {
            ...productDetails,
            ...updatedProductDetails
        };
    }

    const { regularChildSkus: regularChidSkusWithStock = [] } = stockAvailability;

    // When stockAvailability comes from /samedayproduct, currentSku is not part
    // of regularChildSkus, even when we send x-ufe-request: true to API.
    // We need to add it manually until this is fixed API side.
    const skuIdComparer = ({ skuId }) => skuId === currentSku.skuId;
    const shouldIncludeCurrentSkuToRegularChildSkus = !regularChidSkusWithStock.some(skuIdComparer);

    if (shouldIncludeCurrentSkuToRegularChildSkus) {
        regularChidSkusWithStock.unshift(stockAvailability.currentSku);
    }

    for (const skuStockAvailability of regularChidSkusWithStock) {
        const {
            skuId, actionFlags, ...restStockAvailabilityDetails
        } = skuStockAvailability;

        // Update currentSku with stock availability.
        // Replace actionFlags with the skuStockAvailability's actionFlags
        // as productDetails' actionFlags reflects the stock availabilty for Distribution Center.
        if (updatedProductDetails?.currentSku?.skuId === skuId) {
            updatedProductDetails.currentSku = {
                ...updatedProductDetails.currentSku,
                ...restStockAvailabilityDetails,
                actionFlags
            };
        }

        // Update regularChildSkus with stock availability.
        const targetSkuIndex = updatedProductDetails.regularChildSkus?.findIndex(item => item.skuId === skuId);

        if (targetSkuIndex >= 0) {
            const targetSku = updatedProductDetails.regularChildSkus[targetSkuIndex];
            // Replace regularChildSkus actionFlags with the skuStockAvailability's actionFlags
            // as actionFlags from regularChildSkus in productDetails contains
            // the stock availabilty for Distribution Center.
            updatedProductDetails.regularChildSkus[targetSkuIndex] = {
                ...targetSku,
                ...restStockAvailabilityDetails,
                actionFlags
            };
        }
    }

    return {
        ...productDetails,
        ...updatedProductDetails
    };
}

function mergeProductDetailsWithRecoProducts(productDetails, recoProducts, selectedProductId) {
    const updatedRecoProducts = [...recoProducts];
    const recoProductIdx = updatedRecoProducts.findIndex(reco => reco.productId === selectedProductId);

    if (recoProductIdx >= 0) {
        updatedRecoProducts[recoProductIdx] = {
            ...updatedRecoProducts[recoProductIdx],
            currentSku: productDetails.currentSku,
            productPage: { ...productDetails }
        };
    }

    return updatedRecoProducts;
}

function includesPreferredSku(recoProducts = [], skuId) {
    const result = recoProducts.some(recoProduct => {
        return recoProduct?.currentSku?.skuId === skuId;
    });

    return result;
}

function buildResponse(details = {}, properties = []) {
    const response = {};

    for (const key of properties) {
        if (Object.prototype.hasOwnProperty.call(details, key)) {
            response[key] = details[key];
        }
    }

    return response;
}

export {
    overrideLocAndCh,
    mergeStockAvailabilityWithProductSkus,
    mergeProductDetailsWithRecoProducts,
    includesPreferredSku,
    buildResponse
};
