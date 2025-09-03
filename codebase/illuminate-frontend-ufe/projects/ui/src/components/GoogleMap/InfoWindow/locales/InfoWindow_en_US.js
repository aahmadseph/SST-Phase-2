export default function getResource(label, vars = []) {
    const resources = {
        openUntil: `Open until ${vars[0]}`,
        closed: 'Closed',
        storeHoursUnavailable: 'Store hours not available'
    };
    return resources[label];
}
