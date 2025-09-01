export default function getResource(label, vars = []) {
    const resources = { viewAll: 'Tout afficher' };

    return resources[label];
}
