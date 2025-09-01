export default function getResource(label, vars = []) {
    const resources = {
        biAccountRequiredText: 'Vous devez avoir un compte Beauty Insider pour déposer une demande de carte de crédit Sephora.',
        birthdayForAutoEnrolledMessage: 'Saisissez votre date de naissance pour recevoir un cadeau gratuit pendant le mois de votre anniversaire. C’est l’un des nombreux avantages des membres Beauty Insider.',
        birthdayForNotAutoEnrolledMessage: 'Inscrivez-vous à notre programme de récompense pour gagner des points à chaque achat, un cadeau d’anniversaire, des échantillons et des expériences uniques.',
        enterBirthdayForGiftText: 'Entrez la date de votre anniversaire et recevez un cadeau gratuit tous les ans.',
        pointText: 'point',
        pointsText: 'points',
        signupAndEarnText: `Inscrivez-vous et accumulez *${vars[0]} ${vars[1]}* pour la commande d’aujourd’hui`,
        joinAndAgree: 'Devenir membre et accepter ',
        termsAndConditionsLink: 'Conditions',
        biTermsAndConditionsLink: 'Modalités Beauty Insider',
        joinCheckboxLabel: 'Inscrivez-vous au programme de récompenses gratuit de Sephora et gagnez des points sur chaque achat.',
        byUncheckingMessage: 'En décochant la case ci-dessus, vous vous inscrivez uniquement à Sephora.com.',
        byJoiningText: 'En vous inscrivant, vous acceptez notre',
        automaticEmailOffersText: ' et vous recevrez automatiquement des offres Beauty Insider par courriel',
        enterBirthdayText: 'Entrez la date de votre anniversaire et recevez un cadeau gratuit tous les ans.',
        testEnterBirthdayText: 'Entrez votre date d’anniversaire pour recevoir votre cadeau d’anniversaire annuel.'
    };
    return resources[label];
}
