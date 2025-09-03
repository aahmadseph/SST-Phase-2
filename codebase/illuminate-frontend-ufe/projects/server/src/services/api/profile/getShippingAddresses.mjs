import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';
import { isValidProfileId } from '#server/services/apiOrchestration/userFull/utils/utils.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { isUfeEnvProduction } from '#server/config/envConfig.mjs';

function getShippingAddresses(options) {
    const {
        shippingAddressId
    } = options.parseQuery;
    const profileId = options.profileId;

    if (!isValidProfileId(profileId)) {
        return Promise.reject('There is no profile id');
    }
    const url = `/v2/users/profiles/${profileId}/address/${shippingAddressId}`;
    const timeout = isUfeEnvProduction ? options.timeout : 5000;

    if (shippingAddressId === undefined) {
        const error = {
            value: {
                data: {
                    errorCode: -1,
                    errorMessages: ['There is no Shipping Address passed']
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

export default logAPICheck(getShippingAddresses);
