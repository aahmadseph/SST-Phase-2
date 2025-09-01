export default function getResource(label, vars = []) {
    const resources = {
        defaultCard: '(Default)',
        exp: 'Exp'
    };

    return resources[label];
}
