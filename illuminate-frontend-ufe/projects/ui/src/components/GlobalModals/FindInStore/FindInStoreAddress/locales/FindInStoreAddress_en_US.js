export default function getResource(label, vars = []) {
    const resources = {
        kilometer: 'kilometer',
        mile: 'mile',
        away: 'away',
        closed: 'Closed',
        storeClosed: 'Store Closed',
        openUntil: `Open until ${vars[0]}`,
        getDirections: 'Get directions',
        kohlsCopy: 'Sephora promotions and rewards may not apply at Kohl\'s stores.'
    };

    return resources[label];
}
