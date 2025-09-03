export default function getResource(label, vars = []) {
    const resources = {
        autoReplenish: 'Auto-Replenish',
        freeStandardShipping: 'Free Standard Shipping with Auto-Replenish.'
    };
    return resources[label];
}
