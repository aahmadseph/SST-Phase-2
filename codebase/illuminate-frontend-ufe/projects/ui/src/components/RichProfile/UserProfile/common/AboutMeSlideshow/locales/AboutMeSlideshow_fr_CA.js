export default function getResource(label, vars = []) {
    const resources = { edit: 'Modifier' };
    return resources[label];
}
