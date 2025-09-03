export default function getResource(label, vars = []) {
    const resources = {
        rsvpTitle: 'Vous avez confirmé votre présence!',
        confirmationWithPhoneMsg: 'Vous recevrez un texto de confirmation au ',
        confirmationWithEmailMsg: 'Vous recevrez un courriel de confirmation au ',
        confirmationNum: 'Numéro de confirmation',
        addToCal: 'Ajouter au calendrier',
        cancelRsvp: 'Annuler la réponse',
        viewAll: 'Voir toutes les réservations',
        areYouSure: 'Souhaitez-vous vraiment annuler la confirmation de votre présence?',
        no: 'Non',
        yes: 'Oui'
    };

    return resources[label];
}
