const resources = {
    seeProductDetails: 'Voir les détails du produit',
    appExclusive: 'Pour l’acheter, téléchargez ou ouvrez l’appli Sephora.',
    notRated: 'Aucune note',
    oneReview: 'Un commentaire',
    reviews: ' commentaires',
    productPreview: 'Aperçu du produit',
    viewDetails: 'Voir les détails',
    nextProduct: 'Produit suivant',
    prevProduct: 'Produit précédent',
    seeFullDetails: 'Voir tous les détails'
};

export default function getResource(label) {
    return resources[label];
}
