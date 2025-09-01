export default function getResource(label, vars = []) {
    const resources = {
        addDeliveryInstructions: 'Ajouter les instructions de livraison',
        cancelLinkText: 'Annuler',
        deliveryInstructions: 'Instructions de livraison',
        deliveryInstructionsHint: 'Instructions de livraison (facultatif)',
        editLinkText: 'Modifier',
        maxCharactersInfo: `${vars[0]} / 250 caractères`,
        orderDeliveryNote: 'Nous laisserons votre commande à votre porte si vous n’êtes pas là au moment de la livraison.',
        saveAndContinue: 'Enregistrer et continuer',
        oosError: 'Un ou plusieurs articles sont présentement en rupture de stock. Veuillez vous rendre à votre',
        oosBasket: 'panier',
        oosUpdate: 'et modifier vos articles.',
        deliveryWindowTitle: 'Planifier une période de livraison',
        deliveryWindowUnavailable: 'Actuellement non disponible',
        chooseDifferentTime: 'Choisir un autre moment',
        confirm: 'Confirmer',
        ok: 'OK',
        errorTitle: 'Erreur',
        sameDayUnlimited: 'Livraison le jour même illimitée',
        nextDayDelivery: 'Livraison le lendemain'
    };

    return resources[label];
}
