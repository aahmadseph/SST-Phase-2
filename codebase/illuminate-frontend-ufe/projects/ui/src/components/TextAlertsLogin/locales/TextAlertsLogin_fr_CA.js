
export default function getResource(label, vars = []) {
    const resources = {
        stepOne: '1. Ouvrir une session',
        stepTwo: '2. Entrer votre numéro de téléphone cellulaire',
        noAccount: 'Pas de compte?',
        createAccount: 'Créer un compte',
        forgotPassword: 'Mot de passe oublié?',
        buttonSignIn: 'Ouvrir une session maintenant et m’envoyer des alertes par textos',
        buttonSendAlerts: 'Envoyez-moi des alertes par textos de Sephora',
        mobileLabel: 'Numéro de téléphone cellulaire',
        emailAddressLabel: 'Adresse de courriel',
        notYouMessage: 'Ce n’est pas vous?',
        passwordLabel: 'Mot de passe',
        andText: 'et',
        showPasswordLinkAriaLabel: 'Montrer le mot de passe',
        hidePasswordLinkAriaLabel: 'Cacher le mot de passe',
        enterMobileErrorMessage: 'Veuillez saisir un numéro de téléphone cellulaire valable.',
        enterPasswordErrorMessage: 'Veuillez saisir votre mot de passe.'
    };

    return resources[label];
}
