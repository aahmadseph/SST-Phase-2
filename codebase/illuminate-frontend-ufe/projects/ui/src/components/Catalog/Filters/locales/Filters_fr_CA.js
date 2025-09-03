const resources = {
    filters: 'Filtres',
    modalTitle: 'Filtrer et trier',
    clear: 'Réinitialiser',
    clearAll: 'Tout réinitialiser',
    showResults: 'Afficher les résultats',
    showMore: 'Afficher plus',
    apply: 'Appliquer',
    search: 'Recherche',
    noResults: 'Aucun résultat',
    viewAZ: 'Voir de A à Z',
    viewByRelevance: 'Afficher selon la pertinence',
    chooseStore: 'Choisir un magasin',
    setYourLocation: 'Définir votre emplacement',
    pickUp: 'Ramassage',
    sameDayDelivery: 'Livraison le jour même',
    pickupAndDelivery: 'Ramassage et livraison',
    clearSearch: 'Effacer la recherche',
    jumpTo: 'Aller à...'
};

export default function getResource(label) {
    return resources[label];
}
