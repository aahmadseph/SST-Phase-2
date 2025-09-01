import { CHANNELS } from 'constants/Channels';
import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';

const { makeRequest } = ufeApi;
const { getCurrentCountry, getCurrentLanguage } = languageLocaleUtils;

// https://jira.sephora.com/browse/INFL-1011

function getGroupedBrandsList() {
    const channel = CHANNELS.RWD;
    const language = getCurrentLanguage()?.toLowerCase();
    const country = getCurrentCountry();
    const paramsString = `?ch=${channel}&loc=${language}-${country}`;

    const url = `/api/v2/catalog/groupedBrandsList${paramsString}`;

    return makeRequest(url).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { getGroupedBrandsList };
