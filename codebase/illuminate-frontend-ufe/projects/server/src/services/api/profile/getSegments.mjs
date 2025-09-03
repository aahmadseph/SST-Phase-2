import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

function getSegments(options) {
    const url = '/v2/profile/segments';

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default logAPICheck(getSegments);
