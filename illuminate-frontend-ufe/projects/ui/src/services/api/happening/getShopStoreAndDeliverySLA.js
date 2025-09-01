import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';
import urlUtils from 'utils/Url';
import languageLocaleUtils from 'utils/LanguageLocale';
import javascriptUtils from 'utils/javascript';
const { buildQuery } = urlUtils;
const { buildMap } = javascriptUtils;

// https://store-aggregation-eus1-qa2.lower.internal.sephora.com/store-aggregation/swagger-ui/index.html

function getShopStoreAndDeliverySLA(token, payload, config) {
    const { biAccountId, profileId, storeId, zipCode } = payload;
    const url = '/gway/v1/dotcom-sys/storeDeliveryDetails';
    const location = `${languageLocaleUtils.getCurrentLanguage().toLowerCase()}-${languageLocaleUtils.getCurrentCountry()}`;
    const queryParams = buildQuery(
        buildMap({
            ...(storeId && { storeId }),
            ...(zipCode && { zipCode })
        })
    );

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

    return ufeApi.makeRequest(url + queryParams, options, config).then(data => {
        return data.errorCode ? Promise.reject(data) : data;
    });
}

export default getShopStoreAndDeliverySLA;
