export default function getResource(label, vars = []) {
    const resources = {
        UPCOMING: 'Upcoming',
        PAST: 'Past',
        CANCELLED: 'Canceled',
        CANCELLED_BY_STORE: 'Canceled By Store',
        LATE_CANCELLATION: 'Late Cancelation',
        NO_SHOW: 'No Show',
        reschedule: 'Reschedule',
        cancel: 'Cancel',
        bookAgain: 'Book Again',
        viewProduct: 'View Product Recs',
        cancelRSVP: 'Cancel RSVP',
        rsvp: 'RSVP',
        free: 'FREE',
        noArtist: 'Any Available Artist',
        fee: `${vars[0]} Fee`,
        changeCountryMessage: `In order to search for stores in ${vars[0]}, please go to the ${vars[1]} and change your country to ${vars[0]}.`,
        switchCountryBasketMessage: `Once you switch, any ${vars[0]}-restricted and/or Reserve & Pickup items will be removed from your basket.`,
        changeCountry: 'Change Country',
        bottomOfTheSite: 'bottom of the site',
        ok: 'OK'
    };

    return resources[label];
}
