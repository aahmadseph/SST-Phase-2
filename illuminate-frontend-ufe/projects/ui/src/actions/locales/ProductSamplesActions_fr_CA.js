module.exports = function getResource(label) {
    const resources = {
        title: 'Échantillons ajoutés',
        message: 'Vos échantillons ont été ajoutés à votre panier.',
        ok: 'OK',
        errorTitle: 'Erreur',
        errorMessage: 'Un problème est survenu lors du chargement de cette page. Veuillez réessayer plus tard.',
        errorButton: 'Compris'
    };
    return resources[label];
};
