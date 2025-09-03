import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

function getLinkedAccounts(options) {
    const url = '/v2/users/profiles/linkAccountDetails';

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default logAPICheck(getLinkedAccounts);
