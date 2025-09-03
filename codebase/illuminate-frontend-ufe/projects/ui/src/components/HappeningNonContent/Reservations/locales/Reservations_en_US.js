export default function getResource(label, vars = []) {
    const resources = {
        upcoming: 'Upcoming',
        past: 'Past',
        notAttended: 'Not Attended',
        canceled: 'Canceled',
        title: 'My Reservations',
        bookService: 'Book a Service',
        browseEvent: 'Browse Events',
        cancelEvent: 'Cancel RSVP',
        less24HoursCancel: 'Are you sure you want to cancel? Canceling within 24 hours of your appt will incur a $XX charge. See policies for more details',
        normalCancel: 'Are you sure you want to cancel?',
        modalContent: 'Are you sure you want to cancel your RSVP?',
        modalNoButton: 'No',
        modalYesButton: 'Yes',
        showMoreButton: 'Show More Reservations'
    };

    return resources[label];
}
