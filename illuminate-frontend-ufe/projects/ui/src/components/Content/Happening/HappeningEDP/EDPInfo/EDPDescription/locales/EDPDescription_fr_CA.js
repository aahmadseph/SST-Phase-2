export default function getResource(label, vars = []) {
    const resources = {
        descriptionLabel: 'Description',
        bookAppointment: 'Prendre rendez-vous',
        buyGiftCard: 'Vous voulez offrir un service? Acheter une carte-cadeau Sephora',
        free: 'GRATUIT'
    };

    return resources[label];
}
