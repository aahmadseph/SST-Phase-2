import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import { getConfigurationValue } from '#server/services/utils/configurationCache.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

function getSubscriptions(options) {
    const isARForNGPEnabled = getConfigurationValue(options, 'isARForNGPEnabled', false);

    const selectedProfileId = isARForNGPEnabled ? options.parseQuery.biAccountId : options.profileId;

    const isAutoReplenishEmptyHubEnabled = getConfigurationValue(options, 'isAutoReplenishEmptyHubEnabled', false);
    const url = `/${isAutoReplenishEmptyHubEnabled ? 'v3' : 'v2'}/subscription/profiles/${selectedProfileId}`;

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default logAPICheck(getSubscriptions);
