import ufeApi from 'services/api/ufeApi';
import selfReturnUtils from 'utils/SelfReturn';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Delete+Item+From+Self-service+NCR+Order

function deleteItemFromOrder(orderId, skuId) {
    const originatingOrderId = selfReturnUtils.getOriginalOrderId();
    const originalOrderIdParam = originatingOrderId ? `?originalOrderId=${originatingOrderId}` : '';
    const url = `/api/selfReturn/order/${orderId}/items/${skuId}` + originalOrderIdParam;

    return ufeApi.makeRequest(url, { method: 'DELETE' }, { skipLoginPrompt: true }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default deleteItemFromOrder;
