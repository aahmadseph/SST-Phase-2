export default function getResource(label, vars = []) {
    const resources = {
        emailAddresLabel: 'Adresse de courriel',
        phoneNumber: 'Numéro de téléphone aux États-Unis',
        signUp: 'S’inscrire',
        phoneInputErrorMsg: 'Veuillez entrer un numéro de téléphone au format XXX-XXX-XXXX',
        successMsg: 'Merci! Vous êtes maintenant inscrit(e)',
        successMsgEmail: ' pour les courriels.',
        successMsgPhone: ' pour les alertes par message texte.',
        errorMsg: 'Veuillez corriger la ou les erreurs dans les champs en surbrillance ci-dessous. '
    };
    return resources[label];
}
