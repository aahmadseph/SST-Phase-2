import ufeApi from 'services/api/ufeApi';

const updateDeliveryInstructions = (deliveryInstructions, shippingGroupId) => {
    const url = '/api/checkout/orders/shippingGroups/deliveryInstructions';
    const options = {
        method: 'POST',
        body: JSON.stringify({
            deliveryInstructions,
            shippingGroupId
        })
    };
    const result = ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));

    return result;
};

export default updateDeliveryInstructions;
