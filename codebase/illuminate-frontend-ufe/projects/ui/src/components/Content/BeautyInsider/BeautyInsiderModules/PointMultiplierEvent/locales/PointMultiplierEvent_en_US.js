export default function getResource(label, vars = []) {
    const resources = {
        ends: `Ends ${vars[0]}`,
        pointMultiplier: 'Point Multiplier Event',
        apply: 'Apply Promo',
        remove: 'Remove',
        applied: 'Applied',
        details: 'View Details',
        perDollar: 'Per Dollar',
        pointMultiplierEventTitle: 'Point Multiplier Event',
        gotIt: 'Got It'
    };
    return resources[label];
}
