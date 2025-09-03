export default function getResource(label, vars = []) {
    const resources = {
        UPCOMING: 'À venir',
        PAST: 'Passé',
        CANCELLED: 'Annulée',
        CANCELLED_BY_STORE: 'Annulé par le magasin',
        LATE_CANCELLATION: `Frais d’annulation tardive de ${vars[0]}`,
        NO_SHOW: `Frais d’absence de ${vars[0]}`,
        addToCalendar: 'Ajouter au calendrier',
        reschedule: 'Changer la date',
        cancel: 'Annuler',
        bookAgain: 'Réserver à nouveau',
        productRecs: 'Afficher les recommandations',
        serviceDescription: 'Description du service',
        confirmation: 'Confirmation',
        location: 'Emplacement',
        details: 'Détails',
        selectedFeature: 'Caractéristique sélectionnée',
        reservationDetails: 'Détails de la réservation',
        dateAndTime: 'Date et heure',
        eventDescription: 'Description de l’événement',
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
