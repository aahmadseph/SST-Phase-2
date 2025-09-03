/* eslint-disable camelcase */
import ufeApi from 'services/api/ufeApi';

function addOrUpdateGiftMessage(giftMessageData, isNew) {
    const url = '/api/checkout/orders/digitalGiftMsg';

    const {
        imageUrl, yourName, recipientName, recipientEmailAddress, giftMessage, orderId = 'current', sid, currentLanguage
    } = giftMessageData;

    const payload = {
        imageUrl,
        customerName: yourName,
        recipientName,
        email: recipientEmailAddress,
        giftMessage,
        orderId,
        sid,
        language_sid: currentLanguage
    };

    return ufeApi
        .makeRequest(url, {
            method: isNew ? 'POST' : 'PUT',
            body: JSON.stringify(payload)
        })
        .then(response => (response.errorCode ? Promise.reject(response) : response));
}

export default addOrUpdateGiftMessage;
