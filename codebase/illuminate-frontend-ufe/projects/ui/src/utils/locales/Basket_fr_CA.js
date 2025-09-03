export default function getResource(label, vars=[]) {
    const resources = {
        free: 'GRATUIT',
        biFreeShip: 'Les membres Beauty Insider profitent de la *livraison standard GRATUITE* sur toutes les commandes.',
        freeShip: `Votre commande est admissible à la *${vars[0]}.*`,
        freeShipVar: 'livraison standard GRATUITE',
        biFreeShipShort: 'Les membres Beauty Insider profitent de la *livraison standard GRATUITE*',
        tbdText: 'À déterminer'
    };

    return resources[label];
}
