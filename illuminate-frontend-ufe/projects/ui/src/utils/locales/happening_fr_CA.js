export default function getResource(label, vars=[]) {
    const resources = {
        changeCountry: 'Changer de pays',
        changeCountryMessage: `Pour sélectionner un magasin au ${vars[0]}, allez dans vos ${vars[1]} et changez votre pays pour ${vars[0]}.`,
        switchCountryBasketMessage: `Une fois le pays modifié, tous les articles dont la vente est restreinte au ${vars[0]} ou les articles Réservation et ramassage seront retirés de votre panier.`,
        bottomOfTheSite: 'au bas de la page',
        ok: 'OK',
        joinUsUntil: 'Joignez-vous à nous jusqu’au',
        MORNING: 'Matin avant 11 h 45',
        AFTERNOON: 'Après-midi de 12 h 00 à 16 h 45',
        EVENING: 'Soir après 17 h 00',
        exclusiveHoldUntil: 'réservation exclusive jusqu’au',
        on: 'le',
        youFoundAnotherTime: 'Vous avez trouvé une autre plage horaire',
        doYouWantToCancelPrevWaitlistAppt: `Voulez-vous annuler votre rendez-vous précédent dans la liste d’attente pour ${vars[0]} dans : ${vars[1]}?`,
        no: 'Non',
        yesCancel: 'Oui, annuler'
    };

    return resources[label];
}
