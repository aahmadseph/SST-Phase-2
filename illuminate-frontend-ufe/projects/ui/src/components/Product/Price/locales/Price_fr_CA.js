export default function getResource(label, vars = []) {
    const resources = {
        free: 'GRATUIT',
        billedMonthly: 'facturé mensuellement'
    };
    return resources[label];
}
