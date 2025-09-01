import {
    sendPermRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    sendAPI404Response
} from '#server/utils/sendAPIResponse.mjs';
import {
    APPLICATION_NAME
} from '#server/config/envConfig.mjs';
import {
    JERRI_APPLICATION_NAME
} from '#server/config/Constants.mjs';

const send404Function = APPLICATION_NAME === JERRI_APPLICATION_NAME ? sendPermRedirect : sendAPI404Response;

export default function decodeURIErrorMiddleware(request, response, next) {

    try {
        decodeURI(request.url);
        decodeURIComponent(request.url);
    } catch (err) {
        // log bad URL
        send404Function(response, `${err?.message} ${request.url}`);

        return;
    }
    next();
}
