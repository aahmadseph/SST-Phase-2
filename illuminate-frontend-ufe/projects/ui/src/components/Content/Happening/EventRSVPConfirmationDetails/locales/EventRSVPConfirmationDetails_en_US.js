export default function getResource(label, vars = []) {
    const resources = {
        rsvpTitle: 'You’re RSVP’d!',
        confirmationWithPhoneMsg: 'You\'ll receive a confirmation text at ',
        confirmationWithEmailMsg: 'You\'ll receive a confirmation email at ',
        confirmationNum: 'Confirmation Number',
        addToCal: 'Add to Calendar',
        cancelRsvp: 'Cancel RSVP',
        viewAll: 'View All Reservations',
        areYouSure: 'Are you sure you want to cancel your RSVP?',
        no: 'No',
        yes: 'Yes'
    };

    return resources[label];
}
