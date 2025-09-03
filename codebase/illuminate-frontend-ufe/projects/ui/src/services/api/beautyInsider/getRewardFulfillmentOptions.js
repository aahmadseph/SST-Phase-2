import { makeRequest } from 'services/api/ufeApi';
import languageLocale from 'utils/LanguageLocale';

const { getCurrentCountry, getCurrentLanguage } = languageLocale;

// https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=432998673
function getRewardFulfillmentOptions(_jwtAccesstoken, options) {
    const country = getCurrentCountry();
    const language = getCurrentLanguage();
    const url = `/gway/productgraph/v5/rewards/${options.skuId}?ch=rwd&loc=${language}-${country}&storeId=${options.storeId}&zipCode=${options.zipCode}`;

    return makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getRewardFulfillmentOptions;
