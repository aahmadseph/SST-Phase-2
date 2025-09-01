import ufeApi from 'services/api/ufeApi';
import languageLocale from 'utils/LanguageLocale';

const { getCurrentCountry, getCurrentLanguage } = languageLocale;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Samples+API

function getSamples() {
    const country = getCurrentCountry();
    const language = getCurrentLanguage();
    const url = Sephora.configurationSettings.isPRSServiceEnabled ? `/api/v3/util/samples?ch=rwd&loc=${language}-${country}` : '/api/util/samples';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getSamples;
