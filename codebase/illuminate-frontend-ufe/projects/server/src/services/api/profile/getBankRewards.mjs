import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { isUfeEnvProduction } from '#server/config/envConfig.mjs';
import {
    KS
} from '#server/services/apiOrchestration/userFull/utils/constants.mjs';
import { getConfigurationValue } from '#server/services/utils/configurationCache.mjs';

function getBankRewards(options) {
    const profileId = options.profileId;
    const isWoodyCCRewardsEnabled = getConfigurationValue(options, KS.IS_WOODY_CC_REWARDS_ENABLED, false);
    const url = `/v2/scc-rewards/${profileId}/bankRewards?isWoodyCCRewardsEnabled=${isWoodyCCRewardsEnabled}`;
    const timeout = isUfeEnvProduction ? options.timeout : 5000;

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', {
        ...options,
        timeout
    });
}

export default logAPICheck(getBankRewards);
