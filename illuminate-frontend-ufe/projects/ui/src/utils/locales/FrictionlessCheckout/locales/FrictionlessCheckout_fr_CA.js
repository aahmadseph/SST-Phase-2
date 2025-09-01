export default function getResource(label, vars = []) {
    const resources = {
        defaultMessage: 'Un problème est survenu. Veuillez vérifier vos informations et essayer de nouveau.',
        creditCardMigratedError: 'Veuillez modifier les paiements.',
        cardMissingDetailsDefault: 'Il peut y avoir des erreurs dans votre sélection; veuillez vérifier de nouveau.',
        contactCS: `La vérification du compte est requise pour terminer l’achat. Veuillez clavarder avec le service à la clientèle ou l’appeler au ${vars[0]}.`,
        csPhone: '1-877-SEPHORA (1-877-737-4672)',
        csHours: 'Heures d’ouverture du service à la clientèle :',
        monToFri: 'Du lundi au vendredi',
        monFriHours: `${vars[0]} : de 5 h à 21 h HP`,
        satToSun: 'Samedi et dimanche',
        satSunHours: `${vars[0]} : de 6 h à 21 h HP`,
        ok: 'OK',
        chat: 'Clavardage',
        error: 'Erreur',
        adjustBasket: 'Ajuster le panier',
        verificationRequired: 'Vérification requise',
        guestErrorMessage: 'Nous ne pouvons pas traiter votre commande en ligne pour le moment. Nous vous invitons à vos rendre dans l’un de nos magasins Sephora.',
        defaultErrorMessage: 'Nous sommes désolés, une erreur s’est produite. Veuillez vérifier votre connexion Internet et essayez de nouveau.',
        BIUnavailable: 'Beauty Insider n’est pas disponible pour le moment. Veuillez revenir plus tard.',
        confirmCVV: 'Veuillez confirmer votre CVV pour passer votre commande'
    };

    return resources[label];
}
