const resources = {
    new: 'Nouveauté',
    value: 'valeur',
    colors: 'Couleurs',
    color: 'Couleur',
    quickLook: 'Aperçu rapide',
    sponsored: 'Commandité',
    regPrice: ' Prix courant',
    selectSaleItems: 'Sélectionner les articles en solde',
    viewSimilarProducts: 'Voir des produits similaires',
    purchased: 'ACHETÉS',
    buyItAgain: 'ACHETER DE NOUVEAU'
};

export default function getResource(label) {
    return resources[label];
}
