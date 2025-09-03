import getPXSDetails from '#server/services/api/catalog/products/getPXSDetails.mjs';
import getBopisSpecificProductDetails from '#server/services/api/profile/getBopisSpecificProductDetails.mjs';
import getSameDaySpecificProductDetails from '#server/services/api/profile/getSameDaySpecificProductDetails.mjs';
import {
    overrideLocAndCh,
    buildResponse,
    mergeStockAvailabilityWithProductSkus
} from '#server/services/apiOrchestration/recommendation/utils/recommendationUtils.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import { FULFILLMENT_TYPES } from '#server/services/utils/Constants.mjs';

function getProductDetailsWithStock(request, productId, includeAllDetails = false) {
    return new Promise((resolve, reject) => {
        const {
            fulfillmentType, preferedSku, storeId, zipCode
        } = request.apiOptions.parseQuery;

        const options = Object.assign({}, overrideLocAndCh(request.apiOptions), {
            productUrl: productId,
            preferedSku,
            storeId,
            zipCode
        });

        const apisToCall = [getPXSDetails(options)];

        if (fulfillmentType === FULFILLMENT_TYPES.PICK) {
            apisToCall.push(getBopisSpecificProductDetails(options));
        } else if (fulfillmentType === FULFILLMENT_TYPES.SAMEDAY) {
            apisToCall.push(getSameDaySpecificProductDetails(options));
        }

        Promise.all(apisToCall)
            .then(([productDetailsResponse, stockAvailabilityResponse]) => {
                const productDetails = safelyParse(productDetailsResponse.data);
                const stockAvailability = safelyParse(stockAvailabilityResponse.data);

                // Send back original backend errors
                if (productDetails?.errorCode) {
                    reject(productDetailsResponse);
                } else if (stockAvailability?.errorCode) {
                    reject(stockAvailabilityResponse);
                }

                const productDetailsWithStockAvailability = mergeStockAvailabilityWithProductSkus(productDetails, stockAvailability);
                let response = productDetailsWithStockAvailability;

                if (!includeAllDetails) {
                    // We don't need the entire product details response, unless we are building the Mini PDP
                    response = buildResponse(productDetailsWithStockAvailability, [
                        'productId',
                        'currentSku',
                        'ancillarySkus',
                        'regularChildSkus',
                        'onSaleChildSkus',
                        'skuSelectorType',
                        'swatchType',
                        'productDetails',
                        'parentCategory'
                    ]);
                }

                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export default getProductDetailsWithStock;
