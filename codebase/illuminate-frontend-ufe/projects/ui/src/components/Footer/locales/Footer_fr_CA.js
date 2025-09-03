const resources = {
    allRightReserved: 'Sephora USA, Inc. Tous droits réservés.',
    termsOfUse: 'conditions d’utilisation de Sephora',
    privacyPolicy: 'politique de confidentialité',
    findAStore: 'Trouver un magasin',
    chat: 'Clavardage avec le service à la clientèle',
    getTheApp: 'Obtenez l’appli',
    textApp: 'Télécharger',
    regionAndLanguage: 'Région et langue',
    downloadApp: 'Téléchargez l’appli Sephora',
    siteMap: 'Plan du site',
    accessibility: 'Accessibilité',
    iOSBanner: 'Téléchargez l’appli Sephora | Téléchargez sur l’App Store > pour iOS',
    googlePlayBanner: 'Téléchargez l’appli Sephora | Obtenez sur Google Play > pour Android',
    belong: 'Quelque chose de beau nous unit.',
    weBelong: 'Quelque chose de beau',
    somethingBeautiful: 'nous unit',
    yourPrivacyChoices: 'Vos choix en matière de confidentialité',
    yourPrivacyChoicesCanada: 'Préférences en matière de témoins',
    websiteFeedback: 'Des commentaires sur le site Web? Faites-les-nous savoir ▸',
    employeeFeedback: 'Employés : Vous éprouvez des problèmes? Faites-les-nous savoir ▸',
    textAlertsTitle: 'Recevez les textos de Sephora',
    textAlertsSubtitle: 'S’inscrire maintenant',
    error: 'Erreur',
    ok: 'OK',
    alreadyLoggedIn: 'Vous êtes déjà connecté. Pour terminer la configuration de votre compte, veuillez vous déconnecter et cliquer de nouveau sur le lien dans votre courriel.'
};

export default function getResource(label) {
    return resources[label];
}
