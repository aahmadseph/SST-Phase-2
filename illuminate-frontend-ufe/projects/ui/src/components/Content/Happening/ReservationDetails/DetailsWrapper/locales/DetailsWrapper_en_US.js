export default function getResource(label, vars = []) {
    const resources = {
        UPCOMING: 'Upcoming',
        PAST: 'Past',
        CANCELLED: 'Canceled',
        CANCELLED_BY_STORE: 'Canceled By Store',
        LATE_CANCELLATION: `Late Cancelation ${vars[0]} Fee`,
        NO_SHOW: `No Show ${vars[0]} Fee`,
        addToCalendar: 'Add to Calendar',
        reschedule: 'Reschedule',
        cancel: 'Cancel',
        bookAgain: 'Book Again',
        productRecs: 'View Product Recs',
        serviceDescription: 'Service Description',
        confirmation: 'Confirmation',
        location: 'Location',
        details: 'Details',
        selectedFeature: 'Selected Feature',
        reservationDetails: 'Reservation Details',
        dateAndTime: 'Date and Time',
        eventDescription: 'Event Description',
        dontMissOutForCreateAcountPart1: 'Don’t miss out! Join Beauty Insider, our FREE loyalty program to bank those',
        dontMissOutForCreateAcountPart2: 'after service completion.',
        createAccountButton: 'Create Account',
        dontMissOutForSignInPart1: 'Don’t miss out! Sign in to your existing Beauty Insider account to bank those',
        dontMissOutForSignInPart2: 'after service completion.',
        singInButton: 'Sign In',
        points: ` ${vars[0]} points `
    };

    return resources[label];
}
