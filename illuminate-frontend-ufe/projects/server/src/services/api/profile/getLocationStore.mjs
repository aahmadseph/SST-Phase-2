import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

function getLocationStore(options) {
    const url = `/v2/location-management/locations/store/${options.storeIdOrDefault}`;

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options, {}, options.headers);
}

export default logAPICheck(getLocationStore);
