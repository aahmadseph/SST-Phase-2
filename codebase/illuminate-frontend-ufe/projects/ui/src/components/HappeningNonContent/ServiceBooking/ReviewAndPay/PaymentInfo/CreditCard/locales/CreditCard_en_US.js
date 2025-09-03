export default function getResource(label, vars = []) {
    const resources = {
        default: '(Default)',
        exp: 'Exp'
    };

    return resources[label];
}
