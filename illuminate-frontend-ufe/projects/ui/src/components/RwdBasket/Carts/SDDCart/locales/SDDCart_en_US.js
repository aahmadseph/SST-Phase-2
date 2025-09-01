export default function getResource(label, vars = []) {
    const resources = {
        autoReplenishTitle: `Auto-Replenish (${vars[0]})`,
        changeMethod: 'Change Method',
        free: 'FREE',
        sameDayDelivery: 'Same-Day Delivery'
    };

    return resources[label];
}
