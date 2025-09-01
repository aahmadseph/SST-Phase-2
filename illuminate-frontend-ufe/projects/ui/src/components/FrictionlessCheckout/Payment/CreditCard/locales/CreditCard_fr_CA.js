export default function getResource(label, vars = []) {
    const resources = {
        defaultCard: '(défaut)',
        exp: 'Exp.'
    };

    return resources[label];
}
