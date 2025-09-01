import ufeApi from 'services/api/ufeApi';

function getInvoice(token) {
    const url = `/api/payments/invoice?token=${token}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(response => (response.errorCode ? Promise.reject(response) : response));
}

export default getInvoice;
