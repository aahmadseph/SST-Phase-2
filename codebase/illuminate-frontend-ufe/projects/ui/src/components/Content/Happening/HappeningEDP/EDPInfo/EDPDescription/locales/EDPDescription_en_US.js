export default function getResource(label, vars = []) {
    const resources = {
        descriptionLabel: 'Description',
        bookAppointment: 'Book an Appointment',
        buyGiftCard: 'Want to gift a service? Buy a Sephora Gift Card',
        free: 'FREE'
    };

    return resources[label];
}
