const resources = {
    result: 'Résultat',
    results: 'Résultats',
    resultsFor: 'pour',
    showMoreProducts: 'Afficher plus de produits',
    relatedContent: 'Contenu relié',
    showMore: 'Afficher plus',
    showLess: 'Afficher moins',
    browseMore: 'Découvrez plus',
    of: 'de',
    shopByCategory: 'Magasiner par catégorie',
    default: 'Par défaut',
    sort: 'Trier',
    relevancy: 'Pertinence',
    bestselling: 'Favoris beauté',
    topRated: 'Meilleur classement',
    exclusive: 'Exclusivement',
    new: 'Nouveauté',
    priceDesc: 'Par ordre décroissant de prix',
    priceAsc: 'Par ordre croissant de prix',
    brandName: 'Nom de la marque',
    clearAll: 'Tout réinitialiser',
    andAbove: 'et plus',
    featuredContent: 'Contenu en vedette',
    yourBeautyPreferences: 'Vos préférences beauté'
};

export default function getResource(label) {
    return resources[label];
}
