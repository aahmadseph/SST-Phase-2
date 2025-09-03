export default function getResource(label, vars = []) {
    const resources = {
        youAreBookedTitle: 'Vous avez réservé!',
        emailConfirmation: `Vous recevrez un courriel de confirmation au ${vars[0]}.`,
        phoneConfirmation: `Vous recevrez un texto de confirmation au ${vars[0]}.`,
        artist: `Artiste : ${vars[0]}`,
        selectedFeature: `Caractéristique sélectionnée : ${vars[0]}`,
        specialRequests: `Demandes spéciales : ${vars[0]}`,
        confirmationNumber: 'Numéro de confirmation',
        addToCalendarButton: 'Ajouter au calendrier',
        rescheduleButton: 'Changer la date',
        cancelButton: 'Annuler',
        viewAllReservations: 'Voir toutes les réservations',
        areYouSure: 'Souhaitez-vous vraiment annuler?',
        areYouSureWithin24Hours: `Souhaitez-vous vraiment annuler? Une annulation dans les 24 heures précédant votre rendez-vous entraînera des frais de ${vars[0]}.`,
        seePolicies: 'Consulter les politiques',
        moreDetails: 'pour plus de détails.',
        cancelService: 'Annuler le service',
        no: 'Non',
        yes: 'Oui',
        dontMissOutForCreateAcountPart1: 'Faites vite! Devenez membre Beauty Insider, notre programme de fidélisation GRATUIT pour accumuler les points',
        dontMissOutForCreateAcountPart2: 'à la fin de votre service.',
        createAccountButton: 'Créer un compte',
        dontMissOutForSignInPart1: 'Faites vite! Ouvrez une session dans votre compte Beauty Insider existant pour accumuler les points',
        dontMissOutForSignInPart2: 'à la fin de votre service.',
        singInButton: 'Ouvrir une session',
        points: ` ${vars[0]} points `
    };

    return resources[label];
}
