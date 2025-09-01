export default function getResource(label) {
    const resources = {
        invoiceTo: 'Facturer à :',
        invoiceNumber: 'Numéro de facture :',
        invoiceAmount: 'Montant de la facture :',
        invoiceDate: 'Date de la facture :'
    };

    return resources[label];
}
