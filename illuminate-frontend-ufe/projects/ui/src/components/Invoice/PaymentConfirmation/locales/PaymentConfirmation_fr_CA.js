const resources = {
    invoiceNumber: 'Numéro de facture : ',
    continueShopping: 'Continuer à magasiner',
    paymentConfirmationTitle: 'Nous l’avons!',
    confirmationEmail: 'Vous recevrez un courriel de confirmation.'
};

export default function getResource(label) {
    return resources[label];
}
