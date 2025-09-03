export default function getResource(label, vars=[]) {
    const resources = {
        biFreeShip: `Les membres Beauty Insider profitent de la *${vars[0]}* sur toutes les commandes.`,
        freeShipQualifies: `Vous êtes maintenant admissible à la *${vars[0]}*.`,
        biFreeShipVar: 'livraison standard GRATUITE'
    };

    return resources[label];
}
