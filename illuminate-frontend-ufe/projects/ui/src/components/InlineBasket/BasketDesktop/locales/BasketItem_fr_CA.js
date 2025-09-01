export default function getResource(label, vars = []) {
    const resources = {
        item: 'ARTICLE',
        outOfStock: 'Rupture de stock',
        outOfStockAtStore: 'Rupture de stock dans certains magasins',
        soldOut: 'épuisé',
        remove: 'Retirer',
        moveToLoves: 'Déplacer vers les favoris'
    };

    return resources[label];
}
