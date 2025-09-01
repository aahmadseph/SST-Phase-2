export default function getResource(label) {
    const resources = {
        invoiceTotal: 'Total de la facture : ',
        submitPayment: 'Soumettre le paiement'
    };

    return resources[label];
}
