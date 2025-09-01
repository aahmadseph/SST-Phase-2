module.exports = function getResource (label, vars = []) {
    const resources = {
        signOutInfoModalTitle: 'Confirmation',
        signOutInfoModalMessage: 'Les articles suivants seront supprimés : Tout le stock immatériel, sauf les cartes-cadeaux. Souhaitez-vous vraiment continuer?',
        signOutInfoModalButtonText: 'Continuer'
    };
    return resources[label];
};
