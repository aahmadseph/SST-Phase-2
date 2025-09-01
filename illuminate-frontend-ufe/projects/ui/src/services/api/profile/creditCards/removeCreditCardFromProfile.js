import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Remove+Credit+Card+from+Profile+API

function removeCreditCardFromProfile(userProfileId, creditCardId) {
    const url = `/api/users/profiles/${userProfileId}/creditCard/${creditCardId}`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeCreditCardFromProfile;
