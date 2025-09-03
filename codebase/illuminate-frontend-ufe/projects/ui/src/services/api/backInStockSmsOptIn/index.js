import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

// https://jira.sephora.com/browse/CE-286

function getApiUrl(type) {
    const qsParams = { type };
    const urlParams = urlUtils.makeQueryString(qsParams);

    const isSDNEnabled = Sephora.configurationSettings?.isSDNEnabledForOSSCSS || false;

    return isSDNEnabled ? `/gway/v1/notify/skus?${urlParams}` : `/api/util/skus/notify?${urlParams}`;
}

function getApiPayload(payload) {
    const isSDNEnabled = Sephora.configurationSettings?.isSDNEnabledForOSSCSS || false;

    return isSDNEnabled ? { ...payload, notificationType: 'SMS' } : payload;
}

function backInStockSMSOptInForm(payload, type) {
    const url = getApiUrl(type);
    const apiPayload = getApiPayload(payload);
    const requestOrigin = 'OOSNotification';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({ ...apiPayload, requestOrigin }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { backInStockSMSOptInForm };
