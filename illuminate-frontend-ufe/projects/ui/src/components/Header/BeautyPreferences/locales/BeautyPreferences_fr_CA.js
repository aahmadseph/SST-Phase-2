export default function getResource(label, vars = []) {
    const resources = {
        beautyPreferencesTitle: 'Préférences beauté',
        beautyPreferencesDesc: 'Dites-nous vos traits beauté et vos préférences de magasinage pour obtenir des recommandations personnalisées.',
        profileCompletionStatusHeading: 'Remplissez pour accéder à vos recommandations personnalisées',
        profileCompleteMessageHeading: 'Merci d’avoir partagé vos préférences.',
        checkRecommendationsLinkHeading: 'Consultez vos recommandations de produits.',
        profileInterimMessageHeading: 'Continuez! Plus vous nous en dites, plus les recommandations seront efficaces.',
        save: 'Enregistrer',
        saveAndContinue: 'Enregistrer et continuer',
        skipThisQues: 'Ignorer cette question',
        signIn: 'Ouvrir une session pour enregistrer',
        biSignIn: 'Inscrivez-vous au programme Beauty Insider pour économiser',
        confettiModalTitle: 'Vous avez accès à vos favoris',
        confettiModalMessage: 'Jetez un coup d’œil à vos choix de favoris personnalisés ou continuez à remplir vos préférences beauté.',
        confettiModalButton: 'Compris',
        confettiModalMessageComplete: 'Félicitations! Vos préférences beauté sont complètes.',
        privacySettings: 'Paramètres de confidentialité des préférences beauté',
        apiErrorModalTitle: 'Modifications non enregistrées',
        apiErrorModalMessage: 'Un problème est survenu lors du traitement de votre soumission. Veuillez essayer de nouveau.',
        buttonText: 'Compris'
    };
    return resources[label];
}
