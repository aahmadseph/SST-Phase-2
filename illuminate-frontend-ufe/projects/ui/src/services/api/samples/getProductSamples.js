import ufeApi from 'services/api/ufeApi';
import getAuthDataId from 'services/api/utility/getAuthDataId';
import userUtils from 'utils/User';

function getProductSamples(productId) {
    const { isSampleSellThroughPdpSamplesEnabled = false } = Sephora.configurationSettings;
    const authId = getAuthDataId();
    let profileId = '';
    let headers = {};

    if (authId) {
        profileId = '&profileId=' + authId;
    }

    let url = `/api/v3/catalog/products/${productId}?productSamples=true` + profileId;

    if (isSampleSellThroughPdpSamplesEnabled) {
        const defaultSAZipCode = userUtils.getDefaultSAZipCode();
        const defaultSACountryCode = userUtils.getDefaultSACountryCode();

        url = `/gway/productaggregation/v3/catalog/products/aggregate?ids=${productId}&productSamples=true${authId ? `&profileId=${authId}` : ''}`;

        headers = {
            defaultSACountryCode,
            defaultSAZipCode
        };
    }

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getProductSamples;
