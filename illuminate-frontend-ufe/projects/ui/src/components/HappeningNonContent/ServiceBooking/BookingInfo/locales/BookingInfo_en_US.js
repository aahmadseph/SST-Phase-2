export default function getResource(label, vars = []) {
    const resources = {
        bookAnAppointment: 'Book an Appointment',
        yourService: 'Your Services',
        reviewAndPay: 'Review & Pay',
        confirmAppointmentDetails: 'Confirm Appointment Details',
        free: 'FREE',
        secureWaitlistSpotHeader: 'Secure Your Waitlist Spot!',
        secureWaitlistSpotBody: `We are thrilled to let you know an appointment has become available that meets your preferences. You have an ${vars[0]} — act swiftly to review and pay before we extend the offer to the next client on our list.`
    };

    return resources[label];
}
