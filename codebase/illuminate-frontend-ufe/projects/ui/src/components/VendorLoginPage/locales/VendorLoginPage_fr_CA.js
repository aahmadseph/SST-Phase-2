const resources = {
    restockMessage: 'La dernière étape, et vous êtes arrivé!',
    reorderMessage: 'Débloquez un accès exclusif pour réorganiser vos articles essentiels par message texte.*',
    emailLabel: 'Adresse de courriel',
    passwordLabel: 'Mot de passe',
    emptyPassword: 'Veuillez saisir votre mot de passe.',
    hidePasswordLabel: 'Cacher le mot de passe',
    showPasswordLabel: 'Montrer le mot de passe',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: 'Pas de compte?',
    createAccount: 'Créer un compte',
    signIn: 'Ouvrir une session',
    disclaimer: '*En ouvrant une session dans votre compte Sephora, vous resterez connecté pour une période de six mois par SMS. Vous pouvez mettre fin à votre session en vous désabonnant.',
    privacyPolicy: 'politique de confidentialité',
    beautyInsiderTerms: 'modalités Beauty Insider'
};

export default function getResource(label) {
    return resources[label];
}
