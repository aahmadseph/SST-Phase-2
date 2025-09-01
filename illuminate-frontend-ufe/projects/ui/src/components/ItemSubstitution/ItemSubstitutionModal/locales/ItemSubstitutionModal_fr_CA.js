const resources = {
    selectSubstitute: 'Sélectionnez un article de remplacement',
    selectSubstituteFor: 'Sélectionnez un article de remplacement pour :',
    recommendedSubstitutions: 'Substitutions recommandées :',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    outOfStock: 'Rupture de stock',
    loadLastSubstitute: 'Un problème est survenu lors du chargement du dernier article de remplacement. Veuillez choisir de nouveau votre article de remplacement.'
};

module.exports = function getResource(label) {
    return resources[label];
};
