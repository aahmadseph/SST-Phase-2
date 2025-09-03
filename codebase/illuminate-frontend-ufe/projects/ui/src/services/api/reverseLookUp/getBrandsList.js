import ufeApi from 'services/api/ufeApi';

/**
 * reverse-look-up-controller API
 *  http://product-catalog-service-qa1.eus1-devqa.internalsephora.com/product-catalog-service/swagger-ui/index.html?configUrl=/product-catalog-service/v3/api-docs/swagger-config#/reverse-look-up-controller
 */
function getBrandsList(token) {
    const sdnDomain = Sephora.configurationSettings.sdnDomainBaseUrl;
    const url = `${sdnDomain}/v1/reverseLookUp/brandsList`;

    const options = {
        url,
        method: 'GET',
        headers: { authorization: `Bearer ${token}` }
    };

    return ufeApi.makeRequest(url, { ...options }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getBrandsList;
