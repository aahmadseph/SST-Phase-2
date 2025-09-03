export default function getResource(label, vars = []) {
    const resources = { reviewRecentPurchases: 'Review Recent Purchases' };
    return resources[label];
}
