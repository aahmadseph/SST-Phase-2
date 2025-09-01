import ufeApi from 'services/api/ufeApi';
import selfReturnUtils from 'utils/SelfReturn';

// https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=275023507

function addSamplesToReplacementOrder(params) {
    const originatingOrderId = selfReturnUtils.getOriginalOrderId();
    const originalOrderIdParam = originatingOrderId ? `?originalOrderId=${originatingOrderId}` : '';
    const url = '/api/selfReturn/orders/samplesToReplacementOrder' + originalOrderIdParam;

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'POST',
                body: JSON.stringify(params)
            },
            { skipLoginPrompt: true }
        )
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addSamplesToReplacementOrder;
