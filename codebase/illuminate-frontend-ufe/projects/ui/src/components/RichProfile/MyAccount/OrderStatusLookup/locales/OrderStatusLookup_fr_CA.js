const resources = {
    titleLabel: 'Consultez votre commande',
    orderNumberInputLabel: 'Numéro de commande',
    emailInputLabel: 'Adresse de courriel',
    submitButtonLabel: 'Trouver ma commande',
    signInText1: 'Si vous détenez un compte,',
    signInText2: 'pour afficher l’historique des achats.',
    signInLinkText: 'ouvrir une session'
};

export default function getResource(label) {
    return resources[label];
}
