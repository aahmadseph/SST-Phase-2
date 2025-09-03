export default function getResource(label, vars = []) {
    const resources = { viewAll: 'Voir tout' };
    return resources[label];
}
