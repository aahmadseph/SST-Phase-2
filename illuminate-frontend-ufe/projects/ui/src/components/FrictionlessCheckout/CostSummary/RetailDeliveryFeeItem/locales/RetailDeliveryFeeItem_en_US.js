export default function getResource(label, vars = []) {
    const resources = {
        defaultText: 'Retail Delivery Fee',
        qtyTbd: 'TBD',
        retailDeliveryModalTitle: 'Retail Delivery Fee'
    };

    return resources[label];
}
