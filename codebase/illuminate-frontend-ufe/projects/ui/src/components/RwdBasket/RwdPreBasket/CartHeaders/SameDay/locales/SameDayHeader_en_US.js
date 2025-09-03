export default function getResource(label, vars = []) {
    const resources = {
        sameDayDelivery: 'Same-Day Delivery',
        deliveringTo: 'Delivering to ',
        yourLocation: 'your location'
    };
    return resources[label];
}
