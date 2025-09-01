export default function getResource(label) {
    const resources = {
        paymentMethodErrorMessage: 'Vous devez sélectionner le mode de paiement par carte Sephora pour appliquer les récompenses Carte de crédit.',
        gotIt: 'Compris',
        showMore: 'Afficher plus',
        showLess: 'Afficher moins',
        applyRewards: 'Appliquer les récompenses Carte de crédit*',
        available: 'disponible',
        applied: 'appliqué',
        orderSubtotal: 'Sous-total de la commande'
    };

    return resources[label];
}
