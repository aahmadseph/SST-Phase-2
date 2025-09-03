import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import { isValidProfileId } from '#server/services/apiOrchestration/userFull/utils/utils.mjs';

function getProfileId(options) {
    // Look for profileId either as numeric or alphanumeric
    const profileId = options.url.match(/users\/profiles\/([a-zA-Z0-9]+)/)?.[1];

    if (!isValidProfileId(profileId)) {
        return Promise.reject('There is no profile id');
    }

    const preferenceStructQueryParam = options?.parseQuery?.preferenceStruct;
    const url = `/v2/users/customer-lookup/profileid/${profileId}${preferenceStructQueryParam ? `?preferenceStruct=${preferenceStructQueryParam}` : ''}`;

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default logAPICheck(getProfileId);
