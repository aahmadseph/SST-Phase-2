export default function getResource(label, vars = []) {
    const resources = {
        paymentModalTitle: 'Paiement',
        paymentModalText: 'Vous paierez les articles réservés au moment du ramassage, comme vous le feriez normalement pour les achats en magasin. Voir ',
        paymentMethods: 'Modes de paiement',
        forMoreDetails: ' pour plus de détails.',
        gotIt: 'Compris'
    };

    return resources[label];
}
