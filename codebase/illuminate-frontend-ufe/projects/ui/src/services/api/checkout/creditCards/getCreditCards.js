import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Credit+Cards+API

function getCreditCards(orderId, country, isFilterSelected) {
    let qparams = '';

    if (country && isFilterSelected) {
        qparams = `?country=${country}&filterSelectedCard=${isFilterSelected}`;
    }

    const url = `/api/checkout/orders/${orderId}/creditCards` + qparams;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getCreditCards;
