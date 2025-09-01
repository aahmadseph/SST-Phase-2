const resources = {
    tryChangeFilters: 'Veuillez essayer de modifier certains de vos filtres pour afficher plus de résultats.',
    showMoreEvents: 'Afficher plus d’événements',
    of: 'de',
    results: 'Résultats',
    sortBy: 'Trier par',
    adjustFilters: 'Régler les filtres',
    noEventsMessage: 'Nous sommes désolés de ne pas avoir trouvé d’événements près de chez vous. Essayez de changer de lieu ou de magasin pour obtenir plus de résultats.',
    changeLocation: 'Changer d’emplacement'
};

export default function getResource(label) {
    return resources[label];
}
