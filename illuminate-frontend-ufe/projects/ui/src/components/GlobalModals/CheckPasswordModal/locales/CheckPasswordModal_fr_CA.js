export default function getResource(label) {
    const resources = {
        title: 'Fermer le compte',
        bodyText: 'Pour des raisons de sécurité, veuillez entrer votre mot de passe de nouveau.',
        passwordPlaceholder: 'Mot de passe',
        errorMessage: 'Veuillez saisir votre mot de passe.',
        showPasswordLinkAriaLabel: 'Montrer le mot de passe',
        hidePasswordLinkAriaLabel: 'Cacher le mot de passe',
        cancelButton: 'Annuler',
        submitButton: 'Continuer'
    };
    return resources[label];
}

