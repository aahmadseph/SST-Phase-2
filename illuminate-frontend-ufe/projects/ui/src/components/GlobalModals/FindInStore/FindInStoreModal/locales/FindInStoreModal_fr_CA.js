const resources = {
    findInStore: 'Trouver dans un magasin Sephora',
    postal: 'Code postal',
    zip: 'Code postal',
    within: 'Dans un rayon de',
    find: 'RECHERCHER',
    inStock: 'En stock',
    viewMap: 'Afficher la carte',
    showMore: 'Afficher plus',
    sorry: 'Nous sommes désolés, cet article n’est pas disponible dans un rayon de',
    selected: 'du code postal sélectionné',
    mile: 'mille',
    kilometer: 'kilomètre',
    away: 'absent'
};

export default function getResource(label) {
    return resources[label];
}
