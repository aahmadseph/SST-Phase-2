export default function getResource(label, vars = []) {
    const resources = {
        deletePaymentOption: 'Supprimer le paiement',
        defaultPayment: 'Paiement par défaut',
        cancel: 'Annuler',
        edit: 'Modifier',
        paymentNameAccount: `${vars[0]} Compte`
    };

    return resources[label];
}
