export default function getResource(label, vars = []) {
    const resources = {
        viewSimilarProductsText: 'Voir des produits similaires',
        writeReviewText: 'Rédiger une évaluation',
        moreColor: 'plus de couleur',
        moreColors: 'plus de couleurss',
        itemShip: 'Cet article ne peut pas être expédié vers le pays suivant',
        canada: ' Canada',
        us: ' É.-U. (États-Unis)',
        color: 'Couleur : ',
        value: 'valeur'
    };

    return resources[label];
}
