export default function getResource(label, vars = []) {
    const resources = {
        title: 'Obtenez-le plus rapidement',
        mainHeader: 'Sauter votre prochaine livraison et ajouter au panier ci-dessous. Votre abonnement reprendra automatiquement les livraisons le',
        cancel: 'Annuler',
        item: 'ARTICLE',
        qty: 'Qté',
        notRated: 'Aucune note',
        oneReview: 'Un commentaire',
        yearlySavings: 'économies annuelles',
        nextShipmentBy: 'Prochaine livraison le',
        addToBasket: 'Ajouter au panier'
    };

    return resources[label];
}
