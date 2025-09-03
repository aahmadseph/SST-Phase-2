export default function getResource(label, vars = []) {
    const resources = {
        product: 'produit',
        products: 'produits',
        of: 'de',
        showMoreProducts: 'Afficher plus de produits',
        noResults1: 'Nous sommes désolés, aucun produit ne correspond à vos choix de filtres.',
        noResults2: 'Veuillez essayer de modifier certains de vos filtres pour afficher des résultats.',
        item: 'article',
        items: 'articles'
    };

    return resources[label];
}
