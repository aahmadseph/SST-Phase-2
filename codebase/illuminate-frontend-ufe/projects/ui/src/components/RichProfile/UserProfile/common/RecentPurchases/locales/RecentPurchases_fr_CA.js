export default function getResource(label, vars = []) {
    const resources = { reviewRecentPurchases: 'Visionner les achats récents' };
    return resources[label];
}
