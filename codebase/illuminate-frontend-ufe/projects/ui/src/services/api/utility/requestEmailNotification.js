import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Email+Notification+Request+API

function buildUrl(subscribe, type) {
    const qsParams = subscribe ? { type } : { action: 'cancel' };

    return urlUtils.makeQueryString(qsParams);
}

function _requestEmailNotification(email, skuId, type, subscribe) {
    const isSDNEnabled = Sephora.configurationSettings?.isSDNEnabledForOSSCSS || false;
    const urlParams = buildUrl(subscribe, type);

    let url = `/api/util/skus/notify?${urlParams}`;
    let apiPayload = { email, skuId };

    if (isSDNEnabled) {
        url = `/gway/v1/notify/skus?${urlParams}`;
        apiPayload = { ...apiPayload, notificationType: 'EMAIL' };
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(apiPayload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

function requestEmailNotificationForSubscriptionType(email, skuId, subscriptionType) {
    return _requestEmailNotification(email, skuId, subscriptionType, true);
}

function cancelEmailNotificationRequest(email, skuId) {
    return _requestEmailNotification(email, skuId, null, false);
}

export default {
    requestEmailNotificationForSubscriptionType,
    cancelEmailNotificationRequest
};
