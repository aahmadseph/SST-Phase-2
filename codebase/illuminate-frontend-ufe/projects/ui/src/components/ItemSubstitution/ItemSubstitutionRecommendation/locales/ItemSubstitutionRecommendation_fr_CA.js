module.exports = function getResource(label, vars=[]) {
    const resources = {
        viewDetails: 'Voir les détails',
        viewOptions: 'Afficher toutes les options disponibles',
        regPrice: ' Prix courant',
        selectSaleItems: 'Sélectionner les articles en solde',
        finalSale: '*Vente finale :* aucun retour ni échange',
        size: 'Format'
    };

    return resources[label];
};
