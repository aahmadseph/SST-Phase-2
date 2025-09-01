export default function getResource(label, vars = []) {
    const resources = {
        updateTermsOfUse: 'Conditions d’utilisation Sephora mises à jour',
        askQuestionsBi: 'Des personnes réelles. Des conversations réelles. En temps réel. Trouvez l’inspiration pour vous faire belle, osez des questions et bénéficiez de conseils avisés de membres Beauty Insider qui vous ressemblent. Vous êtes prêt?',
        termsChanged: 'Nos conditions d’utilisation ont changé.',
        agreeToContinue: 'En choisissant « Continuer », vous acceptez nos',
        termsOfUse: 'conditions d’utilisation de Sephora',
        agreeToPublicPage: 'Certaines informations du profil de la collectivité sont publiques. Si vous cliquez sur « Annuler, » vous aurez tout de même une page de profil publique. Voir',
        forMoreInformation: 'pour de plus amples renseignements.',
        joinAndAgree: 'Rejoignez la collectivité et acceptez',
        agreeTermsAndConditions: 'Vous devez accepter les conditions d’utilisation de la collectivité pour continuer',
        continue: 'continuer'
    };
    return resources[label];
}
