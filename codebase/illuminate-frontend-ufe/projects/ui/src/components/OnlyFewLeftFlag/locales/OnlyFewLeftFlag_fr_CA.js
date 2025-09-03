export default function getResource(label, vars = []) {
    const resources = { onlyFewLeftCopy: 'Plus que quelques articles en stock' };

    return resources[label];
}
