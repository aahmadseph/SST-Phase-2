import mappings from '#server/config/redirectMapping.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    sendPermRedirect,
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';

export default function redirectionMiddleware(request, response, next) {

    const url = request.apiOptions.apiPath;

    if (!url || url.length === 0) {
        // should never be the base that we are here but jic
        next();
    }

    if (mappings[url]) {
        const redirectFunction = (mappings[url].code === 301) ? sendPermRedirect : sendTempRedirect;
        const message = stringifyMsg({
            'Redirect_From_URL': url,
            'Redirect_To_URL': mappings[url].redirectUrl,
            'statusCode': mappings[url].code
        });
        redirectFunction(response, message, mappings[url].redirectUrl);

        return;
    }

    next();
}
