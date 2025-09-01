module.exports = function getResource(label, vars = []) {
    const resources = {
        unverifiedTitle: 'Veuillez revérifier votre adresse',
        unverifiedLegend: 'Votre adresse d’expédition n’a pas pu être vérifiée.',
        unverifiedButtonText: 'Modifier l’adresse',
        recommendedTitle: 'Utiliser plutôt l’adresse recommandée?',
        recommendedLegend: 'Veuillez confirmer que l’adresse d’expédition normalisée ci-dessous est correcte.',
        recommendedButtonText: 'Utiliser l’adresse recommandée'
    };

    return resources[label];
};
