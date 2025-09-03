export default function getResource(label, vars = []) {
    const resources = {
        foundation: 'Fond de teint',
        concealer: 'Anticernes'
    };
    return resources[label];
}
