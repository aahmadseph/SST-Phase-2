
export default function getResource(label, vars = []) {
    const resources = {
        at: 'à',
        via: 'par',
        noPurchaseHistoryMessage: 'Vous n’avez actuellement aucun historique d’achat.',
        purchaseBIMessage: 'Tous les achats effectués à partir de votre compte Beauty Insider apparaîtront automatiquement ici.',
        listReferenceMessage: 'Utilisez cette liste en tant que référence pour l’ensemble de vos achats de beauté.',
        startShoppingMessage: 'Commencer à magasiner',
        showMoreMessage: 'Afficher plus',
        orderDateDataAt: 'date_commande',
        purchasedOnline: 'Acheté en ligne'
    };
    return resources[label];
}
