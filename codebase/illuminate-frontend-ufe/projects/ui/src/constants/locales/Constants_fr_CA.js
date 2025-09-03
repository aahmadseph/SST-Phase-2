module.exports = function getResource(label, vars = []) {
    const resources = {
        canadaLegalCopy:
            'Sephora Beauty Canada, Inc. (160 Bloor St. East Suite 1100 Toronto, ON M4W 1B9 | Canada, sephora.ca) demande le consentement en son propre nom et au nom de Sephora USA, Inc. (350 Mission Street, Floor 7, San Francisco, CA 94105, sephora.com). Vous pouvez retirer votre consentement en tout temps.',
        prop65Msg: 'L’expédition de cet article est interdite vers les adresses californiennes.',
        comingSoon: 'À venir',
        availableInStoreOnly: 'Uniquement disponible en magasin',
        soldOut: 'Rupture de stock',
        outOfStock: 'Rupture de stock',
        emailWhenInStock: 'M’aviser lorsque le produit est disponible',
        removeReminder: 'Gérer les notifications',
        add: 'Ajouter'
    };

    return resources[label];
};
