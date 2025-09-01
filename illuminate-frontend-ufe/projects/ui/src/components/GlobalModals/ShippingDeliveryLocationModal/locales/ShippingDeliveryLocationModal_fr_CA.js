export default function getResource(label, vars = []) {
    const resources = {
        title: 'Lieu d’expédition et de livraison',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        useLocation: 'Utiliser l’emplacement actuel',
        locationSharingDisabled: 'Le partage de position est désactivé',
        locationUpdateSettings: 'Pour partager votre position, veuillez mettre à jour les paramètres de votre navigateur.',
        ok: 'OK',
        zipCodePlaceholder: 'Code postal',
        emptyZipError: 'Code postal requis.',
        invalidZipError: 'Veuillez saisir un code postal valide.',
        changeLocation: 'Changer de lieu',
        changeLocationMessage: 'L’emplacement de livraison sera maintenant :',
        changeLocationMessage2: 'pour tous les articles expédiés',
        currentLocationText: 'votre emplacement actuel'
    };

    return resources[label];
}
