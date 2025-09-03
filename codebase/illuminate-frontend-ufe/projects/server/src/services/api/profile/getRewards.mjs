import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { getConfigurationValue } from '#server/services/utils/configurationCache.mjs';

function getRewards(options) {
    const isNewRewardsEnabled = getConfigurationValue(options, 'isNewRewardsEnabled', false);
    const {
        promotionPoints = 0,
        realTimeVIBStatus,
        birthDay,
        birthMonth
    } = options.beautyInsiderAccount || {};
    const body = isNewRewardsEnabled ? {
        totalPoints: promotionPoints,
        currentTier: realTimeVIBStatus,
        birthDay,
        birthMonth
    }
        : {};

    const method = isNewRewardsEnabled ? 'POST' : 'GET';
    const postData = JSON.stringify(body);

    const headers = {
        'x-country-code': options?.country || 'US',
        ...(isNewRewardsEnabled && { 'Content-Type': 'application/json' })
    };

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, '/v2/profile/loyalty/rewards', method, options, postData, headers);
}

export default logAPICheck(getRewards);
