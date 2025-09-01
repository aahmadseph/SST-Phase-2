import ufeApi from 'services/api/ufeApi';

function getVenmoToken() {
    const url = '/api/checkout/venmoToken';

    return ufeApi.makeRequest(url).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getVenmoToken;
