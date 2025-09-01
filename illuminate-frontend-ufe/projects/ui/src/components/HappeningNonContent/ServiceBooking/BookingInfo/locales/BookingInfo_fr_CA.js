export default function getResource(label, vars = []) {
    const resources = {
        bookAnAppointment: 'Prendre rendez-vous',
        yourService: 'Vos services',
        reviewAndPay: 'Révision et paiement',
        confirmAppointmentDetails: 'Confirmer les détails du rendez-vous',
        free: 'GRATUIT',
        secureWaitlistSpotHeader: 'Réservez votre place dans la liste d’attente!',
        secureWaitlistSpotBody: `Nous sommes ravis de vous annoncer qu’un rendez-vous correspondant à vos préférences s’est libéré. Vous avez : ${vars[0]}. Agissez rapidement pour réviser et payer avant que nous ne présentions l’offre au prochain client sur notre liste.`
    };

    return resources[label];
}
