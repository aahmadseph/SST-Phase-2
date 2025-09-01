export default function getResource(label) {
    const resources = {
        sameDayDelivery: 'Same-Day Delivery ',
        sameDayUnlimited: 'Same-Day Unlimited ',
        standard: 'Standard ',
        item: 'Item',
        items: 'Items'
    };

    return resources[label];
}
