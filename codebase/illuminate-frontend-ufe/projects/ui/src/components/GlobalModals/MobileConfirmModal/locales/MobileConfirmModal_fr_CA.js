export default function getResource(label, vars = []) {
    const resources = {
        mobileModalTitle: 'S’abonner à Sephora',
        mobileModalSubtitle: 'Vous y êtes presque! Un message texte est en route.',
        sent: 'Nous vous l’avons envoyé au',
        buttonContinue: 'Continuer à magasiner',
        mobileTerms: `En entrant votre numéro de téléphone, en cliquant sur Terminer l’inscription, vous consentez aux [MODALITÉS DES TEXTOS|${vars[0]}] et à recevoir des messages textes de marketing automatiques récurrents, 
        y compris des rappels de paniers abandonnés. La fréquence des messages varie. Le consentement n’est pas une condition d’achat. Des frais de messagerie texte et de données peuvent s’appliquer. 
        Consultez notre [POLITIQUE DE CONFIDENTIALITÉ|${vars[1]}] et notre [AVIS DE PRIME FINANCIÈRE|${vars[2]}]. Textez ARRET pour annuler en tout temps. Textez AIDE pour obtenir de l’aide.`,
        mobileTermsAdditionalInfo: ' Sephora : 600, boul. de Maisonneuve Ouest, bureau 2400, Montréal (Québec) H3A 3J2, Canada. 1-877-737-4672.'
    };

    return resources[label];
}
