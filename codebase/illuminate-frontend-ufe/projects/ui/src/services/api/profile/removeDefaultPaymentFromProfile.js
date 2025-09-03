import ufeApi from 'services/api/ufeApi';

function removeDefaultPaymentFromProfile(userProfileId, detaultPayment) {
    const url = `/api/users/profiles/${userProfileId}/defaultPayments/${detaultPayment}`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeDefaultPaymentFromProfile;
