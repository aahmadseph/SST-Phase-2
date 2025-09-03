import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Subscription+Cancel+Reasons+API

function getSubscriptionCancelReasons() {
    const url = '/api/util/subscription/play/cancelReasons';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data.cancelReasons));
}

export default getSubscriptionCancelReasons;
