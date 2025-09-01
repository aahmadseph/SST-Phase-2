import { httpsRequest } from '#server/services/utils/apiRequest.mjs';
import {
    SDN_API_HOST, SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

function getUserRewardsSkus(options) {
    const {
        ch = CHANNELS.RWD, loc ='en-US'
    } = options.parseQuery;

    const rewardsTypeFilter = options.rewardsTypes
        ? `&rewardTypes=${options.rewardsTypes}`
        : '';

    const url = `/productgraph/v5/bi/rewards?ch=${ch}&loc=${loc}${rewardsTypeFilter}`;

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default getUserRewardsSkus;
