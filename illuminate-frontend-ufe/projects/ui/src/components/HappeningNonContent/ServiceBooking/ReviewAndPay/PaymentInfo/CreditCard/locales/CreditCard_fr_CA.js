export default function getResource(label, vars = []) {
    const resources = {
        default: '(défaut)',
        exp: 'Exp.'
    };

    return resources[label];
}
