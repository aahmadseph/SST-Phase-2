export default function getResource(label, vars = []) {
    const resources = {
        UPCOMING: 'Upcoming',
        PAST: 'Past',
        CANCELLED: 'Canceled',
        CANCELLED_BY_STORE: 'Canceled By Store',
        LATE_CANCELLATION: 'Late Cancelation',
        NO_SHOW: 'No Show',
        fee: `${vars[0]} Fee`,
        WAITLIST: 'Waitlist',
        WAITLIST_HOLD: `Waitlist Hold Until ${vars[0]}`,
        WAITLIST_EXPIRED: 'Waitlist Expired',
        WAITLIST_CANCELED: 'Waitlist Canceled'
    };

    return resources[label];
}
