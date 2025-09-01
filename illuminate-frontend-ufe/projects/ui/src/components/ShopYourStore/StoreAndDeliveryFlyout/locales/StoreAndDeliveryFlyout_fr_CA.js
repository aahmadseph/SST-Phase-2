export default function getResource(label, vars = []) {
    const resources = {
        shopThisStore: 'Magasiner dans cette succursale',
        shopYourStore: 'Magasiner dans votre magasin',
        shopSameDay: 'Profiter de la livraison le jour même',
        shopSameDayDelivery: 'Profiter de la livraison le jour même',
        sameDayDeliveryTo: 'Livraison le jour même à',
        openUntil: `Ouvert jusqu’à ${vars[0]} aujourd’hui`,
        closed: 'Fermé',
        storeDetails: 'Détails du magasin',
        findASephora: 'Trouver un magasin Sephora',
        chooseStore: 'Choisir un magasin',
        chooseStoreToBegin: 'Choisir un magasin pour commencer.',
        chooseLocation: 'Choisir un emplacement',
        chooseLocationToBegin: 'Choisir un emplacement pour commencer.'
    };

    return resources[label];
}
