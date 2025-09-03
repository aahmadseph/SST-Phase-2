import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Remove+Order+Payment+API

function removeOrderPayment(orderId, paymentGroupId, creditCardId) {
    const url = creditCardId
        ? `/api/checkout/orders/${orderId}/paymentGroups/${paymentGroupId}/` + `creditCard/${creditCardId}`
        : `/api/checkout/orders/${orderId}/paymentGroups/${paymentGroupId}/creditCard`;

    return ufeApi.makeRequest(url, { method: 'DELETE' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default removeOrderPayment;
