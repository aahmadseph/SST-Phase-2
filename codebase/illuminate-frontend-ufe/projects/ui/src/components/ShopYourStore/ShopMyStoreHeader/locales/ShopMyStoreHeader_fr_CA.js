export default function getResource(label, vars=[]) {
    const resources = {
        shop: 'Magasiner',
        openUntil: `Ouvert jusqu’à ${vars[0]} aujourd’hui`,
        closed: 'Magasin fermé',
        storeDetails: 'Détails du magasin',
        findAStore: 'Trouver un magasin',
        servicesAndEvents: 'Services et événements'
    };

    return resources[label];
}
