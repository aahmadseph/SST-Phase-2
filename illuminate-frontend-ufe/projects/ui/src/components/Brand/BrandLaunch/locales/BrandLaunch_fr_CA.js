
export default function getResource(label, vars = []) {
    const resources = {
        lead: 'Inscrivez-vous aux alertes par textos de Sephora pour obtenir les dernières mises à jour.',
        stepOne: '1. Ouvrir une session',
        stepTwo: '2. Entrer votre numéro de téléphone cellulaire',
        noAccount: 'Pas de compte?',
        createAccount: 'Créer un compte',
        forgotPassword: 'Mot de passe oublié',
        buttonSignIn: 'Ouvrir une session et m’envoyer des alertes par textos',
        buttonSendAlerts: 'Envoyez-moi des alertes par textos de Sephora',
        mobileLabel: 'Numéro de téléphone cellulaire',
        emailAddressLabel: 'Adresse de courriel',
        notYouMessage: 'Ce n’est pas vous?',
        passwordLabel: 'Mot de passe',
        andText: 'et',
        showPasswordLinkAriaLabel: 'Montrer le mot de passe',
        hidePasswordLinkAriaLabel: 'Cacher le mot de passe',
        enterMobileErrorMessage: 'Veuillez saisir un numéro de téléphone cellulaire valable.',
        enterPasswordErrorMessage: 'Veuillez saisir votre mot de passe.',
        disclaimerUS: `En entrant votre numéro de téléphone, en cliquant sur soumettre et en confirmant votre inscription, vous consentez aux [modalités des textos|${vars[0]}] et à recevoir des messages textes de marketing automatiques récurrents, y compris des rappels de paniers abandonnés. La fréquence des messages varie. Le consentement n’est pas une condition d’achat. Des frais de messagerie texte et de données peuvent s’appliquer. Consultez notre [politique de confidentialité|${vars[1]}].\n\nLes alertes marketing par messages texte à propos des lancements de marques exclusifs à Sephora sont offertes aux membres Beauty Insider seulement. Si vous avez déjà choisi de recevoir des messages texte marketing de Sephora, vous recevrez des mises à jour sur les lancements de marque exclusifs à Sephora et aucune autre mesure n’est nécessaire.`,
        disclaimerCA: `En entrant votre numéro de téléphone, en cliquant sur soumettre et en confirmant votre inscription, vous consentez aux [modalités des textos|${vars[0]}] et à recevoir des messages textes de marketing automatiques récurrents avec des offres exclusives et des nouvelles sur les produits, y compris des rappels de paniers abandonnés. La fréquence des messages varie. Des frais de messagerie texte et de données peuvent s’appliquer. Consultez notre [politique de confidentialité|${vars[1]}]. Textez ARRET pour annuler en tout temps. AIDE pour obtenir de l’aide. Sephora : 600, boul. de Maisonneuve Ouest, bureau 2400, Montréal (Québec) H3A 3J2, Canada. 1-877-737-4672.\n\nLes alertes marketing par messages texte à propos des lancements de marques exclusifs à Sephora sont offertes aux membres Beauty Insider seulement. Si vous avez déjà choisi de recevoir des messages texte marketing de Sephora, vous recevrez des mises à jour sur les lancements de marque exclusifs à Sephora et aucune autre mesure n’est nécessaire.`
    };

    return resources[label];
}
