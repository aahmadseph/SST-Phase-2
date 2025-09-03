export default function getResource(label, vars = []) {
    const resources = {
        smsSignInModalTitle: 'S’abonner aux alertes par texto de Sephora',
        greeting: `Bonjour ${vars[0]},`,
        ModalTextHeading: 'Recevez nos textos!',
        ModalTextInputHeading: 'Restez à l’affût des aubaines exclusives, des nouveautés et plus encore lorsque vous vous inscrivez aux alertes par texto de Sephora.',
        enterMobileNumber: 'Numéro de téléphone cellulaire',
        signUpNow: 'Terminer l’inscription',
        TermsAndConditon: 'En entrant votre numéro de téléphone, en cliquant sur Terminer l’inscription et en confirmant votre inscription, vous consentez aux ',
        TermsAndConditonCA: 'En entrant votre numéro de téléphone et en cliquant sur Terminer l’inscription, vous consentez aux ',
        textTerms: 'MODALITÉS DES TEXTOS',
        TermsAndConditon2: ' et à recevoir des textos de marketing automatiques, y compris des rappels de panier abandonné. La fréquence des messages varie. Le consentement n’est pas une condition d’achat. Des frais de messagerie texte et de données peuvent s’appliquer. Consultez notre ',
        privacyPolicy: 'POLITIQUE DE CONFIDENTIALITÉ',
        TermsAndConditon3: ' et ',
        notice: 'AVIS DE PRIME FINANCIÈRE.',
        TermsAndConditon4: ' Textez ARRET pour annuler en tout temps. Textez AIDE pour obtenir de l’aide.',
        TermsAndConditon5: ' Sephora : 160, rue Bloor Est, Bureau 1100, Toronto (Ontario) M4W 0A2, Canada. 1-877-737-4672.'
    };

    return resources[label];
}
