export default function getResource(label, vars = []) {
    const resources = {
        completeStoreList: 'Liste complète des magasins',
        happeningAtSephora: 'En cours chez Sephora',
        findASephora: 'Trouver un magasin Sephora',
        storeLocator: 'Trouver un magasin',
        storeLocations: 'Emplacements du magasin'
    };
    return resources[label];
}
