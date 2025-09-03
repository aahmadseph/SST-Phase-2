import ufeApi from 'services/api/ufeApi';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';

function getRougeRewards(_token) {
    const { isSampleSellThroughBiRewardsEnabled = false } = Sephora.configurationSettings;
    const baseUrl = isSampleSellThroughBiRewardsEnabled ? '/gway/productaggregation/v5/bi/rewards' : '/gway/productgraph/v5/bi/rewards';
    const languageLocale = localeUtils.getCurrentLanguageLocale();
    let headers = {};

    const url = `${baseUrl}?ch=rwd&loc=${languageLocale}&biExclusiveLevel=ROUGE`;

    if (isSampleSellThroughBiRewardsEnabled) {
        headers = {
            defaultSACountryCode: userUtils.getDefaultSACountryCode(),
            defaultSAZipCode: userUtils.getDefaultSAZipCode()
        };
    }

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getRougeRewards;
