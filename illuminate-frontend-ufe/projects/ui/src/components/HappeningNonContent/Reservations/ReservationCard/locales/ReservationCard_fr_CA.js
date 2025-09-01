export default function getResource(label, vars = []) {
    const resources = {
        UPCOMING: 'À venir',
        PAST: 'Passé',
        CANCELLED: 'Annulée',
        CANCELLED_BY_STORE: 'Annulé par le magasin',
        LATE_CANCELLATION: 'Annulation tardive',
        NO_SHOW: 'Absence',
        reschedule: 'Changer la date',
        cancel: 'Annuler',
        bookAgain: 'Réserver à nouveau',
        viewProduct: 'Afficher les recommandations',
        cancelRSVP: 'Annuler la réponse',
        rsvp: 'Réserver',
        free: 'GRATUIT',
        noArtist: 'Tous les artistes disponibles',
        fee: `${vars[0]} Frais`,
        changeCountryMessage: `Pour sélectionner un magasin au ${vars[0]}, allez dans vos ${vars[1]} et changez votre pays pour ${vars[0]}.`,
        switchCountryBasketMessage: `Une fois le pays modifié, tous les articles dont la vente est restreinte au ${vars[0]} ou les articles Réservation et ramassage seront retirés de votre panier.`,
        changeCountry: 'Changer de pays',
        bottomOfTheSite: 'au bas de la page',
        ok: 'OK'
    };

    return resources[label];
}
