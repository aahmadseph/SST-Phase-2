export default function getResource(label, vars = []) {
    const resources = {
        orderText: 'Order',
        dateLocationText: 'Date & Location'
    };

    return resources[label];
}
