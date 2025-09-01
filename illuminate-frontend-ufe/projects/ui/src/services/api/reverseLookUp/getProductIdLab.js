import ufeApi from 'services/api/ufeApi';

function getProductIdLab(token, productId, { l, a, b }) {
    const sdnDomain = Sephora.configurationSettings.sdnDomainBaseUrl;
    const url = `${sdnDomain}/v1/reverseLookUp/product/${productId}/lab?l=${l}&a=${a}&b=${b}`;

    const options = {
        url,
        method: 'GET',
        headers: { authorization: `Bearer ${token}` }
    };

    return ufeApi.makeRequest(url, { ...options }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getProductIdLab;
