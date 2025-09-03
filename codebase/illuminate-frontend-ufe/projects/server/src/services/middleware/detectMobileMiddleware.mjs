import {
    CHANNELS,
    COUNTRIES,
    LANGUAGES
} from '#server/services/utils/Constants.mjs';
import { getHeader } from '#server/utils/responseHeaders.mjs';
import {
    getSourceValue
} from '#server/services/utils/apiHeaders.mjs';

export default function detectMobileMiddleware(request, _response, next) {
    const loc = request.query.loc || '';
    const ch = request.query.ch || '';
    const xSephoraChanel = request.headers['x-sephora-channel'] || '';
    const userAgent = request.headers['user-agent'] || '';
    const sourceHeader = getHeader(request.headers, 'x-requested-source');

    if ( sourceHeader ) {
        request.apiOptions.headers['x-requested-source'] = sourceHeader;
    } else {
        request.apiOptions.headers['x-requested-source'] = getSourceValue(request.apiOptions);
    }

    if (loc.includes('-')) {
        const [
            language, country
        ] = loc.split('-');

        if (language === LANGUAGES.EN || language === LANGUAGES.FR) {
            request.apiOptions.language = language;
        }

        if (country?.toLowerCase() === COUNTRIES.CA || country?.toLowerCase() === COUNTRIES.US) {
            request.apiOptions.country = country.toUpperCase();
        }

        request.apiOptions.locale = `${request.apiOptions.language}-${request.apiOptions.country}`;
    }

    if (ch.includes(CHANNELS.IPHONE_APP) || ch.includes(CHANNELS.ANDROID_APP)) {
        request.apiOptions.channel = ch;
    } else if (xSephoraChanel.includes('iPhone') ||
        (userAgent.startsWith('Sephora') && userAgent.includes('iPhone'))) {
        request.apiOptions.channel = CHANNELS.IPHONE_APP;
    } else if (xSephoraChanel.includes('androidApp') ||
        (userAgent.startsWith('Sephora') && userAgent.includes('androidApp'))) {
        request.apiOptions.channel = CHANNELS.ANDROID_APP;
    }

    next();
}
