
export default function getResource(label, vars = []) {
    const resources = {
        noResults1: 'Nous sommes désolés, aucun produit ne correspond à vos choix de filtres.',
        noResults2: 'Veuillez essayer de modifier certains de vos filtres pour afficher des résultats.',
        noSDDResult: `La livraison le jour même n’est pas disponible pour ${vars[0]}.`,
        noSDDResult2: 'Essayez de vérifier la disponibilité d’autres emplacements.',
        SDDUnavailable: 'La livraison le jour même n’est pas disponible pour le moment.',
        SDDUnavailable2: 'Veuillez réessayer plus tard.'
    };
    return resources[label];
}
