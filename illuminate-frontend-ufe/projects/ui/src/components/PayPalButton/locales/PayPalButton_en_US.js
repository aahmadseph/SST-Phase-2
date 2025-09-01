export default function getResource(label, vars = []) {
    const resources = { payWithText: 'Pay With' };

    return resources[label];
}
