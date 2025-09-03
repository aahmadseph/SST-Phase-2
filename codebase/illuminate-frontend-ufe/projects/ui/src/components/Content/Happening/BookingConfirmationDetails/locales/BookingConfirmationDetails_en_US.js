export default function getResource(label, vars = []) {
    const resources = {
        youAreBookedTitle: 'You\'re booked!',
        emailConfirmation: `You\'ll receive a confirmation email at ${vars[0]}.`,
        phoneConfirmation: `You’ll receive a confirmation text at ${vars[0]}.`,
        artist: `Artist: ${vars[0]}`,
        selectedFeature: `Selected Feature: ${vars[0]}`,
        specialRequests: `Special Requests: ${vars[0]}`,
        confirmationNumber: 'Confirmation Number',
        addToCalendarButton: 'Add To Calendar',
        rescheduleButton: 'Reschedule',
        cancelButton: 'Cancel',
        viewAllReservations: 'View All Reservations',
        areYouSure: 'Are you sure you want to cancel?',
        areYouSureWithin24Hours: `Are you sure you want to cancel? Canceling within 24 hours of your appt will incur a ${vars[0]} charge.`,
        seePolicies: 'See policies',
        moreDetails: 'for more details.',
        cancelService: 'Cancel Service',
        no: 'No',
        yes: 'Yes',
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
