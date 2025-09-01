import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Scheduled+Slots+for+SDD+API
function getSamedaySchedules(orderId = 'current') {
    const url = `/api/checkout/orders/${orderId}/samedaySchedules`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getSamedaySchedules;
