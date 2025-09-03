module.exports = function getResource(label, vars = []) {
    const resources = {
        freeShipping: 'Vous pouvez maintenant bénéficier de la livraison gratuite!',
        rougeFreeShipping: 'Votre statut de membre Rouge vous donne droit à la LIVRAISON FLASH GRATUITE pour chaque commande.',
        rougeEnrolledForFree: 'Membre Rouge, visitez la page Flash pour vous inscrire GRATUITEMENT. Cet article sera retiré de votre panier.'
    };

    return resources[label];
};
