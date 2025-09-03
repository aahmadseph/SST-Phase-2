import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import { CHANNELS } from 'constants/Channels';

const { getCurrentCountry, getCurrentLanguage } = languageLocaleUtils;

// This will provide the SEO information for Buy Pages from SEO Service
function getSeoBuyPage({ path }) {
    const sdnUfeAPIUserKey = Sephora.configurationSettings.sdnUfeAPIUserKey;
    const seoName = /buy\/(.+)/.exec(path)[1];
    const country = getCurrentCountry();
    const language = getCurrentLanguage();

    const options = {
        method: 'GET',
        country,
        language,
        channel: CHANNELS.RWD
    };

    if (userUtils.isAnonymous()) {
        options.headers = {
            'X-Api-Key': sdnUfeAPIUserKey
        };
    }

    const url = `/gway/v1/seo-service/util/buyPages/${seoName}/seoName?loc=${language?.toLowerCase()}-${country}`;

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getSeoBuyPage;
