import ufeApi from 'services/api/ufeApi';
import selfReturnUtils from 'utils/SelfReturn';

// https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=275023233

function updateAddress(payload) {
    const originatingOrderId = selfReturnUtils.getOriginalOrderId();
    const originalOrderIdParam = originatingOrderId ? `?originalOrderId=${originatingOrderId}` : '';
    const url = '/api/selfReturn/updateNCR/shippingAddress/updateAddress' + originalOrderIdParam;

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'PUT',
                body: JSON.stringify(payload)
            },
            { skipLoginPrompt: true }
        )
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateAddress;
