import ufeApi from 'services/api/ufeApi';
// https://confluence.sephora.com/wiki/display/ILLUMINATE/Update+Payment+Credit+Card+API

function updatePaymentCreditCard(creditCardInfo, isSelectOnly = false) {
    const url = `/api/payments/creditCard?type=${isSelectOnly ? 'select' : 'update'}`;

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(creditCardInfo)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updatePaymentCreditCard;
