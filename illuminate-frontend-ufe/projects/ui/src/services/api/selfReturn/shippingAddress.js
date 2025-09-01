import ufeApi from 'services/api/ufeApi';
import selfReturnUtils from 'utils/SelfReturn';

// https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=275023233

function shippingAddress(payload) {
    const originatingOrderId = selfReturnUtils.getOriginalOrderId();
    const originalOrderIdParam = originatingOrderId ? `?originalOrderId=${originatingOrderId}` : '';
    const url = '/api/selfReturn/replacementOrders/shippingGroups/shippingAddress' + originalOrderIdParam;

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'POST',
                body: JSON.stringify(payload)
            },
            { skipLoginPrompt: true }
        )
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default shippingAddress;
