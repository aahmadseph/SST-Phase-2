import ufeApi from 'services/api/ufeApi';

//https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Paypal+Checkout+API

function updatePayPalCheckout(payload, type) {
    const url = `/api/checkout/orders/paypal?type=${type}`;

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updatePayPalCheckout;
