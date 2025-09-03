export default function getResource(label, vars = []) {
    const resources = { viewAll: 'View all' };

    return resources[label];
}
