import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import { CHANNELS } from 'constants/Channels';

const { getCurrentCountry, getCurrentLanguage } = languageLocaleUtils;

function getBuyPageData({ path }) {
    const seoName = /buy\/(.+)/.exec(path)[1];
    const options = {
        method: 'GET',
        country: getCurrentCountry(),
        language: getCurrentLanguage(),
        channel: CHANNELS.RWD
    };

    return ufeApi.makeRequest(`/api/util/buyPages/${seoName}/seoName`, options);
}

export default getBuyPageData;
