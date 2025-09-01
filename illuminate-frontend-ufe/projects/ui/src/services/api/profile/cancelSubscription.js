import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Cancel+Subscription+API

function cancelSubscription(profileId, subscriptionType) {
    const url = `/api/users/profiles/${profileId}/subscription/${subscriptionType}`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default cancelSubscription;
