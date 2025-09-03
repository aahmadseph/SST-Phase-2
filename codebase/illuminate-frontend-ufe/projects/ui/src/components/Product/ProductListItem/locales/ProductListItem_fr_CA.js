
export default function getResource(label, vars = []) {
    const resources = {
        writeAReview: 'Rédiger un commentaire',
        answerAQuestion: 'Répondre à une question',
        free: 'GRATUIT',
        qty: 'QTÉ',
        itemIsNoLongerAvailable: 'Cet article n’est plus disponible',
        viewFullSize: 'Voir en format standard',
        shopTheBrand: 'Découvrir la marque',
        viewDetails: 'Voir les détails',
        findInStore: 'Trouver en magasin',
        viewBrand: 'voir la marque',
        recentActivity: 'activité récente',
        purchases: 'achats',
        redeemed: 'Échangés',
        itemShipToCanada: 'Cet article ne peut pas être expédié au Canada',
        itemShipToUS: 'Cet article ne peut pas être expédié aux États-Unis',
        itemSubstituted: 'Article remplacé',
        advisorNotes: 'REMARQUES DU CONSEILLER',
        similarProductsLink: 'Voir des produits similaires',
        deliveryEvery: 'Livraison chaque',
        finalSaleItem: 'Vente finale : Aucun retour ni échange'
    };
    return resources[label];
}
