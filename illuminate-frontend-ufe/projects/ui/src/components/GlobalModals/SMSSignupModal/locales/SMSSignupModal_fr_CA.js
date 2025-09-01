export default function getResource(label, vars = []) {
    const resources = {
        smsSignupModalTitle: 'Recevoir des mises à jour de commande par texto',
        greeting: `Bonjour ${vars[0]},`,
        beautiful: 'Beauté',
        smsSignupModalTextHeading: 'Recevez des mises à jour par texto pour cette commande.',
        smsSignupModalTextInputHeading: 'Entrez votre numéro de téléphone cellulaire ci-dessous.',
        enterMobileNumber: 'Numéro de téléphone cellulaire',
        smsSignUpModalTerms1: 'J’accepte les ',
        textTerms: 'MODALITÉS DES TEXTOS',
        smsSignUpModalTerms2: ' et autoriser Sephora à utiliser un système automatisé, un composeur automatique, un système automatisé pour la sélection ou la composition de numéros de téléphone, un système de composition téléphonique automatique (« ATDS ») ou tout autre type de système, de logiciel, de matériel, ou machine (peu importe la classification) qui peut utiliser une procédure ou un processus automatisé pour envoyer des messages texte concernant ma commande au numéro de téléphone cellulaire fourni. Le consentement n’est pas une condition d’achat. Des frais de messagerie texte et de données peuvent s’appliquer. Consultez notre ',
        privacyPolicy: 'POLITIQUE DE CONFIDENTIALITÉ',
        signupTextNotifText: 'Inscrivez-moi pour recevoir des notifications par texto au sujet de cette commande.',
        signUpNow: 'S’inscrire maintenant',
        invalidNumberErrorMessage: 'Veuillez saisir un numéro de téléphone cellulaire valable.',
        textTermsErrorMessage: 'Vous devez accepter les modalités avant de continuer.',
        genericErrorMessage: 'Oups! Nous avons eu de la difficulté à traiter votre demande. Veuillez essayer de nouveau.',
        gotIt: 'Compris',
        smsSignupConfirmationHeadingUSA: 'Vue d’ensemble!',
        smsSignupConfirmationHeadingCA: 'Vous y êtes presque! Un message texte est en route.',
        smsSignupConfirmationTextUSA: `Un texto de confirmation est en route. Nous l’avons envoyé à ･･･ ･･･ ･${vars[0]}.`,
        smsSignupConfirmationTextCA: `Nous l’avons envoyé à ･･･ ･･･ ･${vars[0]}. Répondez O pour confirmer votre abonnement.`
    };

    return resources[label];
}
