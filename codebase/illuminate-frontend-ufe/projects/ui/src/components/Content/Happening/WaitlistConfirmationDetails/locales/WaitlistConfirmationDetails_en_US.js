export default function getResource(label, vars = []) {
    const resources = {
        youAreWaitlisted: 'You\'re on the Waitlist!',
        emailConfirmation: `You\'ll receive a waitlist confirmation email at ${vars[0]}.`,
        artist: `Artist: ${vars[0]}`,
        specialRequests: `Special Requests: ${vars[0]}`,
        confirmationNumber: 'Confirmation Number',
        viewMyReservations: 'View My Reservations',
        cancelWaitlist: 'Cancel Waitlist',
        no: 'No',
        yes: 'Yes'
    };

    return resources[label];
}
