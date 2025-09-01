import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';

function fetchTrendingContent(placement) {
    const locale = `${localeUtils.getCurrentLanguage().toLowerCase()}-${localeUtils.getCurrentCountry()}`;

    const url = `/api/content/p13n/trending/${placement}/${locale}/ufe`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default fetchTrendingContent;
