export default function getResource(label, vars = []) {
    const resources = {
        closed: 'Fermé',
        findASephora: 'Trouver un magasin Sephora',
        showMoreLocations: 'Afficher plus d’emplacements',
        happeningAtSephora: 'En cours chez Sephora',
        freeServicesAtStore: 'Services gratuits, lancements de marques, ateliers et plus - consulter les événements du jour dans votre magasin.',
        seeWhatsHappening: 'Voir ce qui se passe',
        map: 'Plan',
        list: 'Liste',
        noStoreNear: `Nous n’avons pas été en mesure de trouver un magasin près de « ${vars[0]} ».`,
        pleaseTryDifferentLocation: 'Veuillez essayer un autre emplacement.',
        seeCompleteStoreList: 'Voir la liste complète des magasins',
        sephora: 'Sephora',
        openUntil: 'Ouvert jusqu’à',
        storeDetails: 'Détails du magasin',
        happeningAtRedesign: 'Services et événements chez Sephora',
        seeWhatsGoingOnRedesign: 'Découvrir les services de beauté et les événements gratuits dans votre magasin dès aujourd’hui.',
        seeWhatsHappeningRedesign: 'Découvrir les services et les événements'

    };
    return resources[label];
}
