import {
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';

const MOBILE_COOKIE_VALUE = 'mobile';
const DESKTOP_COOKIE_VALUE = 'desktop';

function updateDeviceType(request, response) {

    const value = request.query.isMobile === 'true' ?
        MOBILE_COOKIE_VALUE : DESKTOP_COOKIE_VALUE;

    request.cookies[COOKIES_NAMES.DEVICE_TYPE] = value;
    response.cookie(
        COOKIES_NAMES.DEVICE_TYPE,
        value, {
            path: '/',
            type: 'session',
            secure: true
        }
    );
}

export default function mobileSwitchMiddleware(request, response, next) {
    if (request.query.isMobile && !request.path.startsWith('/api') &&
        !request.path.startsWith('/js/') &&
        !request.path.startsWith('/img/') &&
        !request.path.startsWith('/productimages') &&
        !request.path.startsWith('/contentimages')) {
        updateDeviceType(request, response);
    }

    next();
}
