export default function getResource(label, vars = []) {
    const resources = {
        shipmentNumber: `Shipment ${vars[0]} of ${vars[1]}`,
        item: 'Item',
        price: 'Price',
        qty: 'Qty',
        amount: 'Amount'
    };

    return resources[label];
}
