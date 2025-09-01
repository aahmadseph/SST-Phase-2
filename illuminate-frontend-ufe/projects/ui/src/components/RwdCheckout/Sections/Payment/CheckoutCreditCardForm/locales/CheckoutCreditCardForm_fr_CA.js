const resources = {
    endingIn: 'se terminant par',
    cardNumber: 'Numéro de carte',
    mm: 'MM',
    yy: 'AA',
    cvc: 'CVV/CVC',
    moreInfoPopover: 'Plus d’informations relatives au CVC',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    billingAddress: 'Adresse de facturation',
    useMyAddressRadio: 'Utiliser mon adresse de livraison',
    useDiffAddressRadio: 'Utiliser une adresse différente',
    saveCardCheckboxText: 'Enregistrer cette carte pour des achats futurs',
    makeDefaultCheckboxText: 'Définir comme carte par défaut',
    editCardTitle: 'Modifier la carte de crédit ou de débit',
    addNewCardTitle: 'Ajouter une nouvelle carte de crédit ou de débit',
    cancelButton: 'Annuler',
    saveContinueButton: 'Enregistrer et continuer',
    debitCardDisclaimer: 'Cartes de débit Visa et Mastercard seulement',
    expirationDate: 'Date d’expiration (MM/AA)'
};

export default function getResource(label) {
    return resources[label];
}
