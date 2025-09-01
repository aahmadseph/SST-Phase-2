import ufeApi from 'services/api/ufeApi';

/* eslint-disable max-len */
// API documentation: https://confluence.sephora.com/wiki/display/STORE/Notification+Request
/* eslint-enable max-len */

function curbsidePickupCheckin(token, orderId, body) {
    const sdnDomain = Sephora.configurationSettings.sdnDomainBaseUrl;
    const url = sdnDomain + '/v1/notifications';

    const payload = {
        channel: 'pushNotification',
        messageTemplate: 'curbsideNotificaton_v1.0.0',
        targets: ['x-store'],
        ...body
    };

    const curbsideConcierge = Object.prototype.hasOwnProperty.call(body.messageDetails, 'conciergeIndicator');

    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        url: url,
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-requestor': curbsideConcierge ? 'CURBSIDE_CONCIERGE' : 'curbside',
            'x-key-value': orderId,
            'x-key-type': 'orderId'
        },
        mode: 'cors'
    };

    return ufeApi
        .makeRequest(url, options)
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(e => {
            // 409 code in this case is fine
            if (e?.errorCode === 409) {
                return Promise.resolve(e);
            }

            return Promise.reject(e);
        });
}

export default curbsidePickupCheckin;
