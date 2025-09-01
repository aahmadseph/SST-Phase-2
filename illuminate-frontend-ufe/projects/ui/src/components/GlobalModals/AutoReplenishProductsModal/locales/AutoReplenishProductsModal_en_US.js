export default function getResource(label, vars = []) {
    const resources = {
        deliverEvery: 'Deliver Every',
        deliveryFrequency: 'Delivery Frequency',
        itemsInOrder: 'Items in order',
        done: 'Done',
        qty: 'Qty'
    };

    return resources[label];
}
