/* eslint-disable object-curly-newline */
import {
    apiPost
} from '#server/services/utils/apiRequest.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';

export default async function getAccessToken(options = {}) {

    const authClientName = options.authClientName;

    const authPostData = stringifyMsg({
        clientName: authClientName
    });

    return apiPost('POST', '/v1/oauth/sdn/accessToken', options.headers, options, authPostData);
}
