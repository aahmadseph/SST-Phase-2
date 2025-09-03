const resources = {
    endingIn: 'se terminant par',
    cardNumber: 'Numéro de carte',
    mm: 'MM',
    yy: 'AA',
    cvc: 'Code de sécurité',
    moreInfoPopover: 'Plus d’informations relatives au CVC',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    billingAddress: 'Adresse de facturation',
    useMyAddressRadio: 'Utiliser mon adresse de livraison par défaut',
    useMyBillingAddressRadio: 'Utiliser mon adresse de facturation existante',
    useDiffAddressRadio: 'Utiliser une adresse différente',
    saveCardCheckboxText: 'Conserver pour des réservations et des achats futurs',
    makeDefaultCheckboxText: 'Définir comme carte par défaut',
    editCardTitle: 'Modifier la carte de crédit ou de débit',
    addNewCardTitle: 'Ajouter une nouvelle carte de crédit ou de débit',
    cancel: 'Annuler',
    useThisCard: 'Utiliser cette carte',
    debitCardDisclaimer: 'Cartes de débit Visa et Mastercard seulement',
    genericCreditCardApiError: 'Nous n’avons pas été en mesure de valider votre carte de crédit. Veuillez entrer à nouveau les renseignements relatifs à votre carte de crédit ou utiliser une autre carte.',
    creditCardNumberIncorrect: 'Le numéro de carte de crédit est incorrect'
};

export default function getResource(label) {
    return resources[label];
}
