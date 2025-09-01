export default function getResource(label, vars = []) {
    const resources = {
        ends: `Ends ${vars[0]}`,
        apply: 'Apply in Basket',
        remove: 'Remove',
        applied: 'Applied',
        details: 'Details',
        off: 'off',
        points: 'points',
        pointsForDiscountEventTitle: 'Points for Discount Event',
        gotIt: 'Got It',
        eligible: 'Eligible for up to',
        eventDetails: 'Event Details',
        viewDetails: 'View Details'
    };
    return resources[label];
}
