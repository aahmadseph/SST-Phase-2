export default function getResource(label, vars = []) {
    const resources = { departments: 'Departments' };
    return resources[label];
}
