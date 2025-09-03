const resources = {
    showMore: 'Afficher plus de produits',
    breadcrumb: 'Breadcrumb',
    viewing: 'Affichage',
    results: 'résultats'
};

export default function getResource(label) {
    return resources[label];
}
