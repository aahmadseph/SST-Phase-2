export default function getResource(label, vars = []) {
    const resources = {
        updatePaymentMethod: 'Mettre à jour le mode de paiement',
        remove: 'Retirer',
        edit: 'Modifier',
        addNewCardTitle: 'Ajouter une nouvelle carte de crédit ou de débit',
        cancel: 'Annuler',
        save: 'Enregistrer',
        cvc: 'CVV/CVC',
        updateSecurityCode: 'Veuillez saisir votre code de sécurité.',
        CVCDescription: 'Veuillez fournir le code CVV/CVC associé à votre carte pour mettre à jour votre abonnement.',
        gotIt: 'Compris',
        expiredCreditCardMsg: 'Cette carte est expirée. Veuillez effectuer une mise à jour des renseignements de votre carte.'
    };

    return resources[label];
}
