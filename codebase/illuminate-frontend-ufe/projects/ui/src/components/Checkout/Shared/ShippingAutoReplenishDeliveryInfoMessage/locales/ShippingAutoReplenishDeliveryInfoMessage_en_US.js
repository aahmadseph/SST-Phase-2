export default function getResource(label, vars = []) {
    const resources = {
        shippingAutoReplenishMessage: 'Expedited shipping options will only be for the first delivery. Subsequent Auto-Replenish items will arrive via standard shipping.',
        gotIt: 'Got it'
    };

    return resources[label];
}
