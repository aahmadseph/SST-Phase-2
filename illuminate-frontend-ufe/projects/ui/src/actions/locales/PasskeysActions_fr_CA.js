module.exports = function getResource(label) {
    const resources = {
        anErrorOccurredPleaseTryAgainLater: 'Une erreur s’est produite. Veuillez réessayer plus tard.',
        error: 'Erreur',
        ok: 'OK',
        passkeyFromYourAccount: 'clé d’accès de votre compte.',
        passkeyRemoved: 'Clé d’accès supprimée',
        pleaseConfirmYouWantToRemove: 'Voulez-vous vraiment supprimer?',
        removePasskey: 'Supprimer la clé d’accès',
        removePasskeysTitle: 'Supprimer la clé d’accès?',
        yourPasskeyHaveBeenRemoved: 'Votre clé d’accès a été supprimée.'
    };
    return resources[label];
};
