export default function getResource(label, vars = []) {
    const resources = { viewAll: 'View All' };
    return resources[label];
}
