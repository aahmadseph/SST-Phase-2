export default function getResource(label, vars = []) {
    const resources = {
        cancel: 'Annuler',
        createdOn: 'créé le',
        edit: 'Modifier',
        orDevicePassword: 'ou le mot de passe de l’appareil.',
        passkey: 'Clé d’accès',
        remove: 'Retirer',
        signInWithFaceFingerprintPin: 'Ouvrez une session à l’aide de la reconnaissance faciale, de l’empreinte digitale ou du NIP.',
        signInWithFaceOrFingerprint: 'Ouvrez une session à l’aide de la reconnaissance faciale ou l’empreinte digitale.',
        sephoraAppText: '(Appli Sephora)',
        noPasskey: 'Aucune clé d’accès disponible.'
    };
    return resources[label];
}
