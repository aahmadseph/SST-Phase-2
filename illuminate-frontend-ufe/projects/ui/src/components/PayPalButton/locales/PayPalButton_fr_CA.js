export default function getResource(label, vars = []) {
    const resources = { payWithText: 'Payer avec' };

    return resources[label];
}
