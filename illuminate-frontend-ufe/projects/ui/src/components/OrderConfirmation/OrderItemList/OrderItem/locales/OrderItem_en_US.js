export default function getResource(label, vars = []) {
    const resources = {
        birthdayGift: 'Birthday Gift',
        free: 'FREE',
        welcomeKit: 'Welcome Kit',
        rouge: 'Rouge',
        orderFullSizeButton: 'Order Full Size',
        qty: 'Qty',
        deliveryLabel: 'Delivery Every'
    };

    return resources[label];
}
