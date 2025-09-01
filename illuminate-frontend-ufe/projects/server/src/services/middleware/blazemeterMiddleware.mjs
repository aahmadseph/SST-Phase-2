import {
    getHeader
} from '#server/utils/responseHeaders.mjs';

const BLAZEMETER_HEADER_NAME = 'X-LoadTest',
    BLAZEMETER_HEADER_VALUE = 'Blazemeter';

export default function blazemeterMiddleware(request, response, next) {

    const bmHeader = getHeader(request.headers, BLAZEMETER_HEADER_NAME);

    if (bmHeader && bmHeader === BLAZEMETER_HEADER_VALUE) {
        request.apiOptions.isMockedResponse = true;
        request.apiOptions.headers[BLAZEMETER_HEADER_NAME] = BLAZEMETER_HEADER_VALUE;
    }

    next();
}
