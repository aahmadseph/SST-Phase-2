import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import { CHANNELS } from 'constants/Channels';

const { getCurrentCountry, getCurrentLanguageLocale } = languageLocaleUtils;

// https://jira.sephora.com/browse/ATGD-32

function contactUs(token, params) {
    const channel = CHANNELS.RWD;
    const country = getCurrentCountry();
    const locale = getCurrentLanguageLocale();
    const url = `/gway/v1/dotcom/util/customerService/contact?channel=${channel}&country=${country}&locale=${locale}`;

    const options = {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default contactUs;
