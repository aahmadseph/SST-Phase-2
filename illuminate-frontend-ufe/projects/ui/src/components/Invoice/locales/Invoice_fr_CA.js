export default function getResource(label) {
    const resources = {
        invoice: 'Facture',
        secure: 'Sûr',
        paymentMethod: 'Mode de paiement',
        billingAddress: 'Adresse de facturation',
        errorTitle: 'Erreur',
        ok: 'OK'
    };

    return resources[label];
}
