export default function getResource(label, vars = []) {
    const resources = {
        foundation: 'Foundation',
        concealer: 'Concealer'
    };
    return resources[label];
}
