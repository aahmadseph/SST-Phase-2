import ufeApi from 'services/api/ufeApi';

function getProductFrequency(productId) {
    const url = `/api/v3/catalog/skus/${productId}/frequency`;

    return ufeApi
        .makeRequest(url, { method: 'GET' })
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(reason => {
            // eslint-disable-next-line no-console
            console.error('getProductFrequency failed for ' + `productId: ${productId}.`);

            return Promise.reject(reason);
        });
}

export default getProductFrequency;
