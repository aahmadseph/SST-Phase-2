import { isHealthcheckURL, isNonePageRoute } from '#server/services/utils/routerUtils.mjs';

export default function cspMiddleware(request, response, next) {

    const isAsset = isNonePageRoute(request.path) || isHealthcheckURL(request.path);
    if (isAsset) {
        next();
        return;
    }

    // eslint-disable-next-line
    response.set(`Content-Security-Policy`, `frame-ancestors 'none'`); // maintain this syntax to ensure that 'none' stays within single quotes
    next();
}
