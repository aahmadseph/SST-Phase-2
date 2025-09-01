export default function getResource(label, vars = []) {
    const resources = {
        appExclusive: 'Exclusivité sur l’application',
        limitedTimeOffer: 'Offre d’une durée limitée',
        comingSoon: 'À venir',
        firstAccess: 'Accès privilégié',
        limitedEdition: 'Série limitée',
        onlyAtSephora: 'Exclusivité Sephora',
        onlineOnly: 'En ligne seulement',
        outOfStock: 'Rupture de stock',
        salePrice: 'Solde',
        new: 'Nouveauté',
        onlyFewLeft: 'Plus que quelques articles en stock',
        match: 'correspondance'
    };
    return resources[label];
}
