import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+PayPal+from+Profile+API

function removePayPalFromProfile(userProfileId) {
    const url = `/api/users/profiles/${userProfileId}/paypal`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removePayPalFromProfile;
