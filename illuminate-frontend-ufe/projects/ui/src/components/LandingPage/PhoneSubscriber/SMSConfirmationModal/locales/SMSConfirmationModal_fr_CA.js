export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'S’abonner à Sephora',
        continueShopping: 'Continuer à magasiner',
        heading: 'Vous y êtes presque! Un message texte est en route.',
        checkYourSMS: `Nous l’avons envoyé à ${vars[0]}. \nRépondez O pour confirmer votre abonnement.`,
        disclaimerLine1US: `En entrant votre numéro de téléphone, en cliquant sur soumettre et en confirmant votre inscription, vous consentez à ${vars[0]} et à recevoir des messages textes de marketing automatiques récurrents, y compris des rappels de paniers abandonnés. La fréquence des messages varie. Le consentement n’est pas une condition d’achat. Des frais de messagerie texte et de données peuvent s’appliquer. Voir notre ${vars[1]} et notre ${vars[2]}. Textez ARRET pour annuler en tout temps. AIDE pour obtenir de l’aide.`,
        disclaimerLine1CA: `En entrant votre numéro de téléphone, en cliquant sur soumettre et en confirmant votre inscription, vous consentez aux ${vars[0]} et à recevoir des messages textes de marketing automatiques récurrents avec des offres exclusives et des nouvelles sur les produits. La fréquence des messages varie. Des frais de messagerie texte et de données peuvent s’appliquer. Consultez notre ${vars[1]}. Textez ARRET pour annuler en tout temps. AIDE pour obtenir de l’aide. Sephora : 600, boul. de Maisonneuve Ouest, bureau 2400, Montréal (Québec) H3A 3J2, Canada. 1-877-737-4672.`,
        textTerms: 'modalités des messages texte',
        privacyPolicy: 'politique de confidentialité',
        noticeOfFinancialInsentive: 'Avis de prime financière'
    };

    return resources[label];
}
