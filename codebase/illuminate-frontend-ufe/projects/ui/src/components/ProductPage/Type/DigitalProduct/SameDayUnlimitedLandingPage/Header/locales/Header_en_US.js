export default function getResource(label) {
    const resources = {
        subscribeToSephora: 'Subscribe to Sephora’s',
        sameDayUnlimited: 'Same-Day Unlimited'
    };

    return resources[label];
}
