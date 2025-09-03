
module.exports = function getResource(label) {
    const resources = {
        color: 'Couleur',
        size: 'Format',
        edit: 'Modifier',
        doNotSubstitute: 'Ne pas remplacer',
        oufOfStock: 'Rupture de stock : ',
        substituteWith: 'Remplacer par : ',
        substituteOption: 'Option d’article de remplacement : '
    };

    return resources[label];
};
