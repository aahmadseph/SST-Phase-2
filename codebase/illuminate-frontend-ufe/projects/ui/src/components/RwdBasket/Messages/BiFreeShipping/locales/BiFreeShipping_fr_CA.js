export default function getResource(label, vars=[]) {
    const resources = {
        biFreeShip: `Les membres Beauty Insider profitent de la ${vars[0]} sur toutes les commandes.`,
        freeShipQualifies: `Vous êtes maintenant admissible à la ${vars[0]}.`,
        biFreeShipVar: 'Expédition standard GRATUITE',
        biFreeShipPointsVar: `Profitez de *l’expédition GRATUITE* et accumulez au moins *${vars[0]} points* sur cette commande.`
    };

    return resources[label];
}
