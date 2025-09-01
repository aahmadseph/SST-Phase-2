import {
    resolve,
    basename
} from 'path';
import { sendAPIJsonResponse, sendAPI401Response } from '#server/utils/sendAPIResponse.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import getSdnToken from '#server/services/api/oauth/sdn/getSdnToken.mjs';
import {
    getBodyBuffer
} from '#server/services/utils/urlUtils.mjs';
import {
    getError
} from '#server/utils/serverUtils.mjs';
import {
    CHANNELS,
    SDN_CHANNELS
} from '#server/services/utils/Constants.mjs';
import Logger from '#server/libs/Logger.mjs';

const filename = basename(resolve(import.meta.url));
const logger = Logger(filename);

async function getSdnAuthToken(request, response) {
    const bodyData = safelyParse(getBodyBuffer(request));
    if ((!bodyData || !bodyData.clientName) ||
        (!CHANNELS[bodyData.clientName] && !SDN_CHANNELS[bodyData.clientName])) {
        return sendAPI401Response(response, true);
    }

    const options = Object.assign({}, request.apiOptions, {
        channel: 'RWD',
        clientName: bodyData.clientName
    });

    return await getSdnToken(options).then(results => {
        const dataParsed = safelyParse(results.data);
        const formattedData = {
            sdnAccessToken: dataParsed.access_token,
            expiresIn: dataParsed.expires_in
        };
        return sendAPIJsonResponse(response, formattedData);
    }).catch(e => {
        logger.error(getError(e));
        return sendAPI401Response(response, true);
    });
}

function addAuthenticationRoutes(app) {
    app.post(/\/gapi\/oauth\/sdn\/accessToken*/, getSdnAuthToken);
}


export default {
    addAuthenticationRoutes,
    getSdnAuthToken
};
