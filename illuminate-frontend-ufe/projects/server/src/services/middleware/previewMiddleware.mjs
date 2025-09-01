import {
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';
import {
    ENABLE_PREVIEW
} from '#server/config/envConfig.mjs';
import { isHealthcheckURL, isNonePageRoute } from '#server/services/utils/routerUtils.mjs';

const PREVIEW_URL = '/preview';

export default function previewMiddleware(request, response, next) {

    const isAsset = isNonePageRoute(request.apiOptions.apiPath) || isHealthcheckURL(request.apiOptions.apiPath);

    if (ENABLE_PREVIEW && !isAsset) {
        const cookies = request.cookies;

        if (!cookies['prv'] && !request.url.startsWith(PREVIEW_URL)) {
            sendTempRedirect(response, 'No preview cookie set!', PREVIEW_URL);

            return;
        }
    }

    next();
}
