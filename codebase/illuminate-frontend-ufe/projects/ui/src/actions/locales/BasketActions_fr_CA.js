module.exports = function getResource (label, vars = []) {
    const resources = {
        confirmBasketUpdateModalTitle: 'Confirmation',
        confirmBasketUpdateModalButtonText: 'Continuer',
        sureToContinueMessage: 'Souhaitez-vous vraiment continuer?',
        error: 'Erreur',
        ok: 'OK',
        autoReplenishTitle: 'Le réapprovisionnement automatique ne peut pas être ajouté',
        autoReplenishP1: 'La quantité de réapprovisionnement automatique est limitée à un (1) par article. Cet article est déjà dans votre panier avec une autre méthode d’expédition.',
        autoReplenishP2: 'Pour vous inscrire au réapprovisionnement automatique, retirez l’article de votre panier et retournez à la page du produit.',
        gotIt: 'Compris',
        outOfStockTitle: 'Article en rupture de stock',
        outOfStockText: 'Désolé, cet article est en rupture de stock. Elle ne sera pas ajoutée à votre panier.',
        alreadyInCart: 'Bonjour! Il semble que vous avez déjà ajouté cet article dans votre panier.',
        limitExceededTitle: 'Limite atteinte pour cet article',
        genericErrorTitle: 'Erreur',
        samplesError: 'Un problème est survenu lors de l’ajout de cet échantillon. Veuillez réessayer plus tard.'
    };
    return resources[label];
};
