export default function getResource(label, vars = []) {
    const resources = { remove: 'Remove' };
    return resources[label];
}
