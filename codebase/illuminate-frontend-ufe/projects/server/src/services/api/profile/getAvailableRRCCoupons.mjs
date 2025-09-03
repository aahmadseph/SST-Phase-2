import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { COOKIES_NAMES } from '#server/services/utils/Constants.mjs';
import { ENABLE_PREVIEW } from '#server/config/envConfig.mjs';

function getAvailableRRCCoupons(options) {
    const biAccountId = options.biAccountIdOrDefault;
    const params = new URLSearchParams();

    if (ENABLE_PREVIEW) {
        const previewDate = Number(options.headers.Cookie?.[COOKIES_NAMES.PRV]?.split('|')[0]) || '';
        const previewDateInMillis = previewDate && previewDate * 1000;
        const previewDateToString = previewDateInMillis ? new Date(previewDateInMillis).toISOString() : new Date().toISOString();
        params.set('previewDate', previewDateToString);
    } else {
        const currentDate = new Date().toISOString() || '';
        params.set('startDate', currentDate);
    }

    const url = `/v2/promotion/coupons/customers/${biAccountId}?${params}`;

    const headersIn = {
        'Content-Type': 'application/json'
    };

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options, {}, headersIn);
}

export default logAPICheck(getAvailableRRCCoupons);
