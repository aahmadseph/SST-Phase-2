export default function getResource(label, vars = []) {
    const resources = { remove: 'Retirer' };
    return resources[label];
}
