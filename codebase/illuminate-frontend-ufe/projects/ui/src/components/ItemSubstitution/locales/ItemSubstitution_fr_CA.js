
module.exports = function getResource(label) {
    const resources = {
        outOfStock: 'En cas de rupture de stock :',
        notSubstitute: 'Ne pas remplacer',
        substituteWith: 'Remplacer par...',
        substitutionInfoTitle: 'À propos de la substitution d’article',
        substituteOption: 'option d’article de remplacement'
    };

    return resources[label];
};
