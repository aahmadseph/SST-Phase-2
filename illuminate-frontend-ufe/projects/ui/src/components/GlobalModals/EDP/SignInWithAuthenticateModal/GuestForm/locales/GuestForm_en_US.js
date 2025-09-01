const resources = {
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email Address',
    phone: 'Phone',
    sendReminders: 'Yes, send me text message reminders about my appointment.',
    specialRequests: 'Special Requests (optional)',
    specialRequestsPlaceholder: 'Help our Beauty Advisors prepare for your visit, e.g. I’m interested in trying out a new smoky eye for an upcoming event.',
    completeBooking: 'Complete Booking'
};

export default function getResource(label) {
    return resources[label];
}
