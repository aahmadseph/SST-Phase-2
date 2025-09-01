export default function getResource(label, vars = []) {
    const resources = {
        free: 'FREE',
        billedMonthly: 'billed monthly'
    };
    return resources[label];
}
