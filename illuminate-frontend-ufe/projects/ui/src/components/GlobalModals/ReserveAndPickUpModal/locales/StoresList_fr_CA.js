export default function getResource(label, vars = []) {
    const resources = {
        pickupNotOffered: ' –Le ramassage n’est pas offert',
        openUntil: `Ouvert jusqu’à ${vars[0]}`,
        closed: 'Fermé',
        milesAway: ' kilomètres de distance',
        inStock: 'En stock',
        outOfStock: 'Rupture de stock',
        limitedStock: 'Quantités limitées',
        payInStore: 'Payer en magasin',
        payOnline: 'Payer en ligne',
        goTo: 'Aller à ',
        kohlsCopy: ' ou visiter un magasin pour acheter. Les promotions et les récompenses Sephora peuvent ne pas s’appliquer dans les magasins Kohl’s.',
        kmAway: ' kilomètres de distance'
    };

    return resources[label];
}
