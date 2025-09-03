export default function getResource(label, vars = []) {
    const resources = {
        qty: 'Quantité',
        loved: 'Coup de cœur',
        moveToLoves: 'Déplacer vers les favoris',
        getItSooner: 'Obtenez-le plus rapidement',
        outOfStock: 'Rupture de stock',
        outOfStockAtSelectedStore: 'Rupture de stock dans certains magasins',
        finalSale: '*Vente finale* : Aucun retour ni échange',
        onlyFewLeft: 'Plus que quelques articles en stock',
        shippingRestrictions: 'Restrictions d’expédition',
        shippingRestrictionModalText: 'En raison des réglementations d’expédition, cet article et le reste de votre commande doivent être expédiés par voie terrestre (livraison en 2 à 8 jours au total). Cela comprend les commandes accélérées.',
        gotIt: 'Compris',
        size: `FORMAT ${vars[0]}`,
        item: `ARTICLE ${vars[0]}`,
        save: 'Enregistrer'
    };
    return resources[label];
}
