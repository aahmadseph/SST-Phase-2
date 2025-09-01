import {
    sendErrorResponse
} from '#server/utils/sendErrorResponse.mjs';
import {
    sendPermRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    sendAPI404Response,
    sendAPI500Response
} from '#server/utils/sendAPIResponse.mjs';
import {
    APPLICATION_NAME
} from '#server/config/envConfig.mjs';
import {
    JERRI_APPLICATION_NAME
} from '#server/config/Constants.mjs';

const isJERRI = APPLICATION_NAME === JERRI_APPLICATION_NAME;
const send404Function = isJERRI ? sendPermRedirect : sendAPI404Response;
const send500Function = isJERRI ? sendErrorResponse : sendAPI500Response;

export default function defaultErrorHandlerMiddleware(err, request, response, _next) {
    let statusCode = 500;

    if (err?.status) {
        statusCode = err.status;
    } else if (err?.statusCode) {
        statusCode = err.statusCode;
    }

    if (response.headersSent) {
        // headers have already been sent so just redirect to 404 page or for woody send 404 response
        send404Function(response, `${err?.message} ${request.url}`);

        return;
    }

    // send error page
    send500Function(response, `${err?.message} ${request.url}`, { statusCode });
}
