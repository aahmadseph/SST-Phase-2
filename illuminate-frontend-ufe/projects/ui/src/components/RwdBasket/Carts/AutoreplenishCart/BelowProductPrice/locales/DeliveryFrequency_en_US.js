export default function getResource(label, vars = []) {
    const resources = {
        deliveryEvery: 'Deliver every:',
        deliveryFrequency: 'Delivery Frequency'
    };

    return resources[label];
}
