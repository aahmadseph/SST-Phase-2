import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';
import languageLocaleUtils from 'utils/LanguageLocale';

// https://store-aggregation-eus1-qa2.lower.internal.sephora.com/store-aggregation/swagger-ui/index.html

function getShopSameDay(token, payload) {
    const { biAccountId, profileId, zipCode } = payload;
    const url = `/gway/v1/dotcom-sys/sameDay/${zipCode ?? ''}`;
    const location = `${languageLocaleUtils.getCurrentLanguage().toLowerCase()}-${languageLocaleUtils.getCurrentCountry()}`;

    const options = {
        method: 'GET',
        headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json',
            'content-type': 'application/json',
            'content-language': location,
            ...(biAccountId && { 'x-auth-bi-id': biAccountId }),
            ...(profileId && { 'x-auth-atg-id': profileId }),
            'x-requested-source': CHANNELS.RWD
        }
    };

    return ufeApi.makeRequest(url, options).then(data => {
        return data.errorCode ? Promise.reject(data) : data;
    });
}

export default getShopSameDay;
