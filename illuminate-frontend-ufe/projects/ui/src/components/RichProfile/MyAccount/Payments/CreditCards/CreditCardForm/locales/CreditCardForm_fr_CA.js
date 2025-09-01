export default function getResource(label, vars = []) {
    const resources = {
        edit: 'Modifier',
        add: 'Ajouter',
        addCreditCard: 'Ajouter une carte de crédit ou de débit',
        editCreditCard: 'Modifier la carte de crédit ou de débit',
        cardType: 'Type de carte',
        cardTypeRequired: 'Type de carte requis.',
        cardNumber: 'Numéro de carte',
        cardNumberRequired: 'Numéro de carte de crédit requis.',
        mm: 'MM',
        yy: 'AA',
        cvc: 'CVV/CVC',
        moreInfoCvc: 'Plus d’informations relatives au CVC',
        expirationMonth: 'Mois d’expiration',
        expirationMonthRequired: 'Mois d’expiration requis.',
        expirationYear: 'Année d’expiration',
        expirationYearRequired: 'Année d’expiration requise',
        setAsDefaultCreditCard: 'Définir comme carte par défaut',
        deleteCreditCard: 'Supprimer la carte',
        cancel: 'Annuler',
        update: 'Mise à jour',
        save: 'Enregistrer',
        areYouSureYouWouldLikeToDelete: 'Êtes-vous sûr de vouloir supprimer votre carte de façon définitive?',
        yes: 'Oui',
        no: 'Non',
        debitCardDisclaimer: 'Cartes de débit Visa et Mastercard seulement',
        accountUpdateModal: 'Mise à jour du compte',
        deleteDefaultCardErrorModal: 'Impossible de supprimer cette carte pour le moment. Veuillez réessayer plus tard.',
        done: 'Terminé'
    };
    return resources[label];
}
