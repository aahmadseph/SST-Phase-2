module.exports = function getResource(label, vars = []) {
    const resources = {
        bazaarVoiceApiRequestFailureReason: 'BazaarVoice est désactivé',
        fieldValue: 'Valeur :',
        uploadPhotoRejectMessage: 'Une erreur s’est produite lors de votre chargement. Votre fichier doit comporter une extension .jpg, .png, .heic, .tiff ou .gif et ne pas dépasser 5 Mo.',
        addStructureApiRequestFailureReason: 'AddStructure est désactivé',
        playerLoadTimeoutRejectMessage: `Échec du chargement du lecteur en ${vars[0]} ms!`,
        lithiumApiRequestFailureReasonDisabled: 'Lithium est désactivé',
        lithiumSessionExpired: 'session expirée'
    };

    return resources[label];
};
