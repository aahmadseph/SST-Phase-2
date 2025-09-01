import ufeApi from 'services/api/ufeApi';

function getPasskeys() {
    const url = '/gway/v1/dotcom/auth/passkeys';

    return ufeApi
        .makeRequest(url, {
            method: 'GET'
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

function removePasskey(passkeyId, userData) {
    const url = `/gway/v1/dotcom/auth/passkeys/${passkeyId}?firstName=${userData?.firstName}&lastName=${userData?.lastName}`;

    return ufeApi
        .makeRequest(url, {
            method: 'DELETE'
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    getPasskeys,
    removePasskey
};
