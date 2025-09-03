export default function getResource(label, vars = []) {
    const resources = { freeShipping: 'Expédition gratuite' };
    return resources[label];
}
