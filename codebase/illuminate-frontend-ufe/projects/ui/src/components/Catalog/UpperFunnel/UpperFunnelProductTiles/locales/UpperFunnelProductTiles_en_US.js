export default function getResource(label, vars = []) {
    const resources = {
        curbsideAvailable: 'Curbside Available',
        pickup: 'Pickup',
        sameDayDelivery: 'Same-Day Delivery',
        shipToHomeTitle: 'Get It Shipped',
        shipToHomeShipMessage: `Delivery by ${vars[0]} to ${vars[1]}`
    };
    return resources[label];
}
