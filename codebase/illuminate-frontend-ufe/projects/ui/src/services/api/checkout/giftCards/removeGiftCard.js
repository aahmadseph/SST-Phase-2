import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Gift+Card+API

function removeGiftCard(orderId, paymentGroupId) {
    const url = `/api/checkout/orders/${orderId}/paymentGroups/${paymentGroupId}/giftCard`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeGiftCard;
