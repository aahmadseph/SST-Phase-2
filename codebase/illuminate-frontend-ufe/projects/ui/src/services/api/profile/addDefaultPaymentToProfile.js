import ufeApi from 'services/api/ufeApi';

function addDefaultPaymentToProfile(defaultPayment) {
    const url = '/api/users/profiles/defaultPayment';

    return ufeApi
        .makeRequest(url, { method: 'POST', body: JSON.stringify({ defaultPayment }) })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addDefaultPaymentToProfile;
