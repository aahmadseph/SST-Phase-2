export default function getResource(label, vars = []) {
    const resources = {
        ifYouOrderWithin: `Si vous ${vars[0]}`,
        free: 'GRATUIT',
        warning: 'Avertissement',
        shippingMethodError: `Malheureusement, nous ne pouvons effectuer l'expédition à votre adresse que par l'entremise de ${vars[0]}. Veuillez sélectionner cette méthode ou choisir une autre adresse sur la feuille Apple Pay.`,
        error: 'Erreur',
        adjustBasket: 'Ajuster le panier',
        verificationRequired: 'Vérification requise',
        contactCS: `La vérification du compte est requise pour terminer l’achat. Veuillez clavarder avec le service à la clientèle ou l’appeler au ${vars[0]}.`,
        csPhone: '1-877-SEPHORA (1-877-737-4672)',
        csHours: 'Heures d’ouverture du service à la clientèle :',
        monToFri: 'Du lundi au vendredi',
        monFriHours: `${vars[0]} : de 5 h à 21 h HP`,
        satToSun: 'Samedi et dimanche',
        satSunHours: `${vars[0]} : de 6 h à 21 h HP`,
        ok: 'OK',
        chat: 'Clavardage',
        guestErrorMessage: 'Nous ne pouvons pas traiter votre commande en ligne pour le moment. Nous vous invitons à vos rendre dans l’un de nos magasins Sephora.'
    };

    return resources[label];
}
