import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import {
    getConfigSetting,
    getFormattedDate
} from '#server/services/apiOrchestration/userFull/utils/utils.mjs';
import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { COOKIES_NAMES } from '#server/services/utils/Constants.mjs';
import { ENABLE_PREVIEW } from '#server/config/envConfig.mjs';
import { KS } from '#server/services/apiOrchestration/userFull/utils/constants.mjs';

function getPromotions(options, configurationSettings) {
    const biAccountId = options.biAccountIdOrDefault;

    const isWoodyPersonalizedPromo = getConfigSetting(configurationSettings, KS.IS_WOODY_PERSONALIZED_PROMO);
    const params = new URLSearchParams();

    params.set('isWoodyPersonalizedPromo', isWoodyPersonalizedPromo);

    if (ENABLE_PREVIEW) {
        const previewDate = Number(options.headers.Cookie?.[COOKIES_NAMES.PRV]?.split('|')[0]) || '';
        params.set('startDate', getFormattedDate(previewDate));
    } else {
        params.set('startDate', getFormattedDate());
    }

    const url = `/v2/promotion/customer/${biAccountId}/active?${params}`;

    const headersIn = {
        'Content-Type': 'application/json',
        'X-Requested-Source': 'web'
    };

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options, {}, headersIn);
}

export default logAPICheck(getPromotions);
