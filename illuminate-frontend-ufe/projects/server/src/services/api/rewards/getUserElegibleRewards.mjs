import { httpsRequest } from '#server/services/utils/apiRequest.mjs';
import {
    SDN_API_HOST, SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

function getUserElegibleRewards(options) {
    const url = `/v2/loyalty-rewards/${options.loyaltyId}/eligible-rewards`;

    // Hardcoded since these are static values
    const headersIn = {
        'x-country-code': options?.country || 'US',
        'x-tenant-id': 'SEPHORA',
        'x-source': 'ATG'
    };

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options, {}, headersIn);
}

export default getUserElegibleRewards;
