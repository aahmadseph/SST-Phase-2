import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { isUfeEnvProduction } from '#server/config/envConfig.mjs';

function getCreditCardsFromProfile(options) {
    const {
        creditCardId
    } = options.parseQuery;
    const timeout = isUfeEnvProduction ? options.timeout : 5000;
    const url = `/v2/payment-profile/payments/${creditCardId}`;

    if (!creditCardId) {
        const error = {
            value: {
                data: {
                    errorCode: -1,
                    errorMessages: ['There is no Payment Id passed']
                },
                url
            }
        };

        return Promise.reject(error);
    }

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', {
        ...options,
        timeout
    });
}


export default logAPICheck(getCreditCardsFromProfile);
