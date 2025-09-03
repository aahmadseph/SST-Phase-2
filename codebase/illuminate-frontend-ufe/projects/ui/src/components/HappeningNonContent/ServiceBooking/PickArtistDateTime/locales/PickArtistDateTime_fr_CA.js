export default function getResource(label, vars = []) {
    const resources = {
        store: 'Magasin',
        edit: 'Modifier',
        pickAnArtist: 'Choisir un(e) artiste',
        anyAvailableArtist: 'Quelconque artiste disponible',
        artistAvailabilityNotice: 'L’artiste peut changer en fonction de la disponibilité ce jour-là.',
        continueToReviewAndPay: 'Continuer pour vérifier et Payer',
        pickDateAndTime: 'Choisissez une date et une heure',
        showCalendar: 'Afficher le calendrier',
        timeSlotsTooltip: 'Les plages horaires qui ne sont pas affichées sont entièrement réservées.',
        morning: 'Matin',
        afternoon: 'Après-midi',
        evening: 'Soir',
        before: 'Avant',
        after: 'Après',
        noAvailableTimes: 'Aucune heure disponible',
        pickDate: 'Choisissez une date',
        done: 'Terminé',
        calendarMessage: `Si vous souhaitez prendre rendez-vous plus de 90 jours à l’avance, communiquez avec votre ${vars[0]} favori.`,
        today: 'Aujourd’hui',
        noTimeSlotsIn90DaysErrorMessage: `Nous sommes désolés, mais il n’y a pas de places disponibles pour ce service dans ce magasin dans les 90 prochains jours. Veuillez envisager d’appeler directement le magasin pour planifier ou ${vars[0]} pour réserver en ligne.`,
        chooseAnotherLocation: 'choisir un autre magasin',
        noArtistTimeSlotsErrorMessage: 'Nous sommes désolés, mais il n’y a plus de plages horaires disponibles à cette date. Veuillez essayer d’ajuster les sélections d’artiste et de date ci-dessus pour voir plus de disponibilités.',
        joinWaitlist: 'Rejoindre la liste d’attente',
        timeSlotsNotShown: 'Les plages horaires qui ne sont pas affichées sont entièrement réservées.',
        aboutTheWaitlist: 'À propos de la liste d’attente',
        waitlistHoldInfo: 'Si la plage horaire que vous avez choisie est dans plus de 24 heures, rejoignez la liste d’attente et vous recevrez un courriel et un rendez-vous exclusif si une disponibilité s’ouvre.',
        waitlistLearnMore: 'En savoir plus',
        joinWaitlistButton: 'Continuer à rejoindre la liste d’attente',
        noAvailableArtistTimes: 'Désolé, ce service est complet dans ce magasin à la date sélectionnée. Veuillez essayer d’ajuster les sélections d’artiste et de date ci-dessus pour voir plus de disponibilités. (Ou vous pouvez choisir un autre magasin)',
        gotIt: 'Compris'
    };

    return resources[label];
}
