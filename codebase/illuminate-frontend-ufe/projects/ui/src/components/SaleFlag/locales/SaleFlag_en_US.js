export default function getResource(label, vars = []) {
    const resources = { saleCopy: 'Sale' };

    return resources[label];
}
