import ufeApi from 'services/api/ufeApi';

function setSmsSignup(payload) {
    const url = '/api/checkout/orders/smsUpdate';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(errorException => Promise.reject(errorException));
}

export default setSmsSignup;
