export default function getResource(label, vars = []) {
    const resources = {
        searchResults: 'Résultats de recherche',
        sale: 'Solde'
    };

    return resources[label];
}
