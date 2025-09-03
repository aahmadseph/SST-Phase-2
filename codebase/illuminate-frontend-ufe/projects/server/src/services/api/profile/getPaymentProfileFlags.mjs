import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';

function getPaymentProfileFlags(options) {
    const biAccountId = options.biAccountIdOrDefault;

    const url = `/v2/payment-profile-service/customers/${biAccountId}/payments`;

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default logAPICheck(getPaymentProfileFlags);
