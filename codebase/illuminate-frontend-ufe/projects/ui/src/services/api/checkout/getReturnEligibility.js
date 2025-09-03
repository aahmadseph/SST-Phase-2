import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Reason+Codes+API
function getReturnEligibility(reasonCode, orderId) {
    const url = `/api/selfReturn/orders/${orderId}/eligibility?reasonCode=${reasonCode}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getReturnEligibility;
