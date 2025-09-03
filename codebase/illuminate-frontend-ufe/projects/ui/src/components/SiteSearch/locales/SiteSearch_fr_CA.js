export default function getResource(label, vars = []) {
    const resources = {
        search: 'Recherche',
        cancel: 'Annuler',
        previousSearches: 'Recherches précédentes',
        clearInputAriaLabel: 'effacer le texte de la recherche',
        trendingCategories: 'Catégories tendance',
        searchSuggestions: 'Suggestions de recherche',
        productSuggestions: 'Suggestions de produits',
        continueBrowsing: 'Continuer à explorer',
        buyItAgain: 'Acheter de nouveau'
    };

    return resources[label];
}
