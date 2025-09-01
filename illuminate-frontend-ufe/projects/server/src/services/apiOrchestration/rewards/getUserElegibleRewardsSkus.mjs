/* eslint-disable complexity */
import {
    sendAPIJsonResponse, sendAPI401Response, sendAPI404Response
} from '#server/utils/sendAPIResponse.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import getUserElegibleRewards from '#server/services/api/rewards/getUserElegibleRewards.mjs';
import getUserRewardsSkus from '#server/services/api/rewards/getUserRewardsSkus.mjs';
import {
    getOptionsWithClientHeaders, getRewardsTypesFromUserElegibleRewards
} from '#server/services/apiOrchestration/rewards/utils/utils.mjs';

async function getUserElegibleRewardsSkus(request, response) {
    try {
        const loyaltyIdFromUrl = request.apiOptions.apiPath.split('/')[3];
        const clonedOptions = getOptionsWithClientHeaders(request, ['seph-access-token', 'x-api-key']);
        clonedOptions.loyaltyId = loyaltyIdFromUrl;
        let defaultRewardTypes = 'points';

        if (loyaltyIdFromUrl!=='current'){
            const elegibleRewardsResponse = await getUserElegibleRewards(clonedOptions);
            const userElegibleRewards = safelyParse(elegibleRewardsResponse.data);
            const rewardsTypes = getRewardsTypesFromUserElegibleRewards(userElegibleRewards);
            defaultRewardTypes = rewardsTypes;
        }

        clonedOptions.rewardsTypes = defaultRewardTypes;
        const userRewardsSkusResponse = await getUserRewardsSkus(clonedOptions);
        const userRewardsSkus = safelyParse(userRewardsSkusResponse.data);

        return sendAPIJsonResponse(response, userRewardsSkus);
    } catch (error) {
        if (error.statusCode === 401) {
            return sendAPI401Response(response);
        }

        if (error.statusCode === 404) {
            return sendAPI404Response(response);
        }

        const errorData = safelyParse(error.data) || error?.err;
        const logErrorMessage = errorData.errors?.map(err => err.errorMessage).join(' ') || error?.err;

        return sendAPIJsonResponse(response, {}, logErrorMessage);
    }
}

export default getUserElegibleRewardsSkus;
