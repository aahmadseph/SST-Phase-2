export default function getResource(label) {
    const resources = {
        addNewCard: 'Ajoutez une nouvelle carte de crédit ou de débit',
        editCreditCard: 'Modifier la carte de crédit ou de débit',
        cardNumberDisplay: 'Numéro de carte',
        expirationMonth: 'Mois d’expiration',
        expirationYear: 'Année d’expiration',
        save: 'Enregistrer',
        cancel: 'Annuler',
        setDefault: 'Définir comme carte par défaut',
        cardNumberRequired: 'Numéro de carte de crédit requis.',
        expirationMonthRequired: 'Mois d’expiration requis.',
        expirationYearRequired: 'Année d’expiration requise',
        update: 'Mise à jour',
        deleteCard: 'Supprimer la carte',
        cardTypeTitle: 'Type de carte',
        cardNumberTitle: 'Numéro de carte',
        mm: 'MM',
        yy: 'AA',
        cvc: 'CVV/CVC',
        cardNumberIncorrect: 'Un problème est survenu avec votre carte de crédit. Veuillez vérifier le numéro ou utiliser une autre carte de crédit.'
    };

    return resources[label];
}
