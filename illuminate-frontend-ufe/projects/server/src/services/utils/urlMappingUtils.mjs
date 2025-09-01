import {
    shouldRedirect
} from '#server/services/utils/urlUtils.mjs';
import {
    PARAMETERS
} from '#server/services/utils/Constants.mjs';

function addQueryParams(url, options) {
    const {
        [PARAMETERS.LANG]: lang,
        [PARAMETERS.COUNTRY_SWITCH]: countrySwitch
    } = options;

    if (!lang && !countrySwitch) {
        return url;
    }

    let newUrl = `${url}?`;

    if (lang) {
        newUrl = `${newUrl}&lang=${lang}`;
    }

    if (countrySwitch) {
        newUrl = `${newUrl}&country_switch=${countrySwitch}`;
    }

    return newUrl.replace('?&', '?');
}

async function urlMappingUtils(_response, _lookupOptions) {
    return shouldRedirect();
}

export {
    urlMappingUtils,
    addQueryParams
};
