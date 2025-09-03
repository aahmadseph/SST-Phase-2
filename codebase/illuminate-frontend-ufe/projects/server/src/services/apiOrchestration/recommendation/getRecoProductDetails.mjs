/* eslint-disable complexity */
import { sendAPIJsonResponse } from '#server/utils/sendAPIResponse.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import getProductDetailsWithStock from '#server/services/apiOrchestration/recommendation/getProductDetailsWithStock.mjs';

async function getRecoProductDetails(request, response) {
    try {
        const productId = request.apiOptions.apiPath.split('/')[4];
        const includeAllDetails = request?.apiOptions?.parseQuery?.includeAllDetails === 'true';
        const productDetails = await getProductDetailsWithStock(request, productId, includeAllDetails);

        const frontendResponse = {
            productPage: productDetails
        };

        return sendAPIJsonResponse(response, frontendResponse);
    } catch (error) {
        const errorData = safelyParse(error?.data) || error?.message;
        const logErrorMessage = error?.errorMessages?.join() || error?.message;

        return sendAPIJsonResponse(response, errorData, logErrorMessage);
    }
}

export default getRecoProductDetails;
