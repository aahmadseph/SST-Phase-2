export default function getResource(label, vars = []) {
    const resources = { departments: 'Services' };
    return resources[label];
}
