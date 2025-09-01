export default function getResource(label, vars = []) {
    const resources = { edit: 'Edit' };
    return resources[label];
}
